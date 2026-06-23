import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { predictSchema } from '@/shared/validators';
import { groq, extractJSONArray, PredictResult } from '@/backend/lib/groq';

export async function handlePredict(req: Request) {
  try {
    // 1. Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    // 2. Parse and validate student profile
    const body = await req.json();
    const validation = predictSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { exam, rank, location, branch } = validation.data;

    // 3. Fetch top 20 colleges to act as counselor database
    const colleges = await prisma.college.findMany({
      take: 20,
      include: {
        courses: true,
        placement: true,
      },
      orderBy: { rating: 'desc' },
    });

    if (colleges.length === 0) {
      return NextResponse.json(
        { error: 'No colleges found in the database. Please seed the database first.' },
        { status: 400 }
      );
    }

    // Serialize college data for context
    const collegesContext = colleges.map((col) => ({
      id: col.id,
      name: col.name,
      location: col.location,
      state: col.state,
      fees: col.fees,
      rating: col.rating,
      established: col.established,
      courses: col.courses.map((c) => ({ name: c.name, fees: c.fees, seats: c.seats })),
      placement: col.placement
        ? { avgSalary: col.placement.avgSalary, highestSalary: col.placement.highestSalary }
        : null,
    }));

    // 4. Send query to Groq Llama 3 70B model using JSON mode
    const systemPrompt = `You are an elite, empathetic college counselor. Based on the student's profile (exam, rank, location preference, and branch preference) and the list of available colleges provided, recommend the best-fit colleges from the list.
You must return a JSON object with a single key "recommendations" that contains a JSON array of recommended colleges sorted from best fit to lowest fit.
Each item in the array must follow this exact structure:
{
  "collegeId": "matching college ID from list",
  "collegeName": "matching college name",
  "reason": "Detailed, specific explanation of why this college fits the student's rank, branch choice, location choice, fees, and career goals based on their placement history",
  "fitScore": number (value from 1 to 10 based on compatibility)
}

Be realistic: if a student's rank is low (e.g. 50,000 in JEE Main), recommend colleges in the list that match that rank level (e.g., NITs or private institutions rather than top IITs). If they are looking for CAT, suggest IIMs/B-schools. If NEET, suggest medical colleges. Return only the JSON object. Do not include markdown code block syntax or conversational text in your response.`;

    const userContent = `Student Profile:
- Exam: ${exam}
- Student Rank/Percentile: ${rank}
- Preferred Location: ${location || 'No preference'}
- Preferred Branch/Course: ${branch || 'No preference'}

Available Colleges:
${JSON.stringify(collegesContext, null, 2)}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3, // Low temperature for factual, analytical matching
      response_format: { type: 'json_object' }, // Guarantee JSON output from Groq
    });

    const rawResponse = chatCompletion.choices[0]?.message?.content || '';

    // 5. Parse and validate recommendations
    let recommendations: PredictResult[] = [];
    try {
      const parsedJSON = JSON.parse(rawResponse);
      if (parsedJSON && Array.isArray(parsedJSON.recommendations)) {
        recommendations = parsedJSON.recommendations;
      } else {
        // Fallback to array parser
        recommendations = extractJSONArray<PredictResult>(rawResponse);
      }
    } catch {
      // Fallback extract
      recommendations = extractJSONArray<PredictResult>(rawResponse);
    }

    // Filter out recommendations that don't match database ids
    const validCollegeIds = new Set(colleges.map((c) => c.id));
    const verifiedRecommendations = recommendations.filter((rec) =>
      validCollegeIds.has(rec.collegeId)
    );

    // Fetch full database records for matched colleges to return to frontend
    const matchedColleges = await prisma.college.findMany({
      where: {
        id: { in: verifiedRecommendations.map((rec) => rec.collegeId) },
      },
      include: {
        courses: true,
        placement: true,
      },
    });

    return NextResponse.json({
      recommendations: verifiedRecommendations,
      colleges: matchedColleges,
    });
  } catch (error: any) {
    console.error('Predictor API Error:', error);

    // Provide a user-friendly error response if Groq API fails (e.g., rate limits or key configuration)
    if (error.message && error.message.includes('API key')) {
      return NextResponse.json(
        {
          error: 'The AI Predictor is not configured. Please add a valid GROQ_API_KEY to the environment variables.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'The AI service encountered an issue. Please try again later.' },
      { status: 500 }
    );
  }
}
