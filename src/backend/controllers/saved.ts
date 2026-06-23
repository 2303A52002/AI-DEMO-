import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { savedSchema } from '@/shared/validators';

// GET: Retrieve user's saved colleges
export async function getSavedColleges() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const savedColleges = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: {
        college: {
          include: {
            courses: true,
            placement: true,
            _count: {
              select: {
                reviews: true,
                savedByUsers: true,
              },
            },
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    return NextResponse.json(savedColleges);
  } catch (error) {
    console.error('Saved GET API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching saved colleges.' },
      { status: 500 }
    );
  }
}

// POST: Save a college
export async function saveCollege(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const body = await req.json();
    const validation = savedSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { collegeId } = validation.data;

    // Check if college exists
    const collegeExists = await prisma.college.findUnique({
      where: { id: collegeId },
    });

    if (!collegeExists) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Save college (upsert-style creation to prevent duplicate key crashes)
    const savedRecord = await prisma.savedCollege.upsert({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
      update: {}, // No updates needed if already saved
      create: {
        userId: session.user.id,
        collegeId,
      },
    });

    return NextResponse.json(
      { message: 'College saved successfully', data: savedRecord },
      { status: 201 }
    );
  } catch (error) {
    console.error('Saved POST API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while saving the college.' },
      { status: 500 }
    );
  }
}

// DELETE: Unsave a college
export async function unsaveCollege(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const body = await req.json();
    const validation = savedSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { collegeId } = validation.data;

    // Delete the record using the unique composite index
    await prisma.savedCollege.delete({
      where: {
        userId_collegeId: {
          userId: session.user.id,
          collegeId,
        },
      },
    });

    return NextResponse.json({ message: 'College unsaved successfully' });
  } catch (error) {
    console.error('Saved DELETE API Error:', error);
    // Handle record not found error gracefully
    return NextResponse.json(
      { error: 'An error occurred or college was not previously saved.' },
      { status: 500 }
    );
  }
}
