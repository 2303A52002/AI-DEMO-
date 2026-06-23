import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/backend/lib/auth';
import { prisma } from '@/backend/lib/prisma';
import { collegeQuerySchema, reviewSchema } from '@/shared/validators';
import { Prisma } from '@prisma/client';

// GET: Retrieve paginated and filtered list of colleges
export async function getColleges(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    // Validate filters
    const validation = collegeQuerySchema.safeParse(params);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { search, state, minFees, maxFees, rating, cursor, limit, ids } = validation.data;

    // Build the query where clause
    const where: Prisma.CollegeWhereInput = { AND: [] };
    const andArray = where.AND as Prisma.CollegeWhereInput[];

    // 0. Filter by ID array if specified
    if (ids) {
      const idList = ids.split(',').filter(Boolean);
      andArray.push({
        id: { in: idList },
      });
    }

    // 1. Full-Text Search using tsquery-friendly formatting
    if (search) {
      const formattedSearch = search
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map((term) => `${term}:*`)
        .join(' & ');

      if (formattedSearch) {
        andArray.push({
          OR: [
            { name: { search: formattedSearch } },
            { description: { search: formattedSearch } },
            { location: { search: formattedSearch } },
            { state: { search: formattedSearch } },
          ],
        });
      }
    }

    // 2. Filter by State
    if (state) {
      andArray.push({
        state: { equals: state, mode: 'insensitive' },
      });
    }

    // 3. Filter by Rating
    if (rating) {
      andArray.push({
        rating: { gte: rating },
      });
    }

    // 4. Filter by Fees (College level average annual fees)
    if (minFees !== undefined || maxFees !== undefined) {
      andArray.push({
        fees: {
          gte: minFees ?? 0,
          lte: maxFees ?? 99999999,
        },
      });
    }

    // Fetch total matching records count for filter context
    const total = await prisma.college.count({ where });

    // Fetch matching colleges with relations and cursor-based take
    const colleges = await prisma.college.findMany({
      where,
      take: limit + 1, // Fetch 1 extra to determine nextCursor
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { id: 'asc' }, // Maintain a consistent, indexable sorting for cursors
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
    });

    let nextCursor: string | null = null;
    let data = colleges;

    if (colleges.length > limit) {
      const nextItem = colleges[limit];
      nextCursor = nextItem.id;
      data = colleges.slice(0, limit);
    }

    return NextResponse.json({
      data,
      nextCursor,
      total,
    });
  } catch (error) {
    console.error('Colleges GET API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching colleges.' },
      { status: 500 }
    );
  }
}

// GET: Retrieve a specific college's detail by slug
export async function getCollegeDetail(
  req: Request,
  slug: string | undefined
) {
  try {
    if (!slug) {
      return NextResponse.json({ error: 'College slug is required' }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      include: {
        courses: true,
        placement: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        _count: {
          select: {
            reviews: true,
            savedByUsers: true,
          },
        },
      },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json(college);
  } catch (error) {
    console.error('College GET Detail API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching college details.' },
      { status: 500 }
    );
  }
}

// GET: Paginated reviews for a specific college
export async function getCollegeReviews(
  req: Request,
  slug: string | undefined
) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '5', 10));

    if (!slug) {
      return NextResponse.json({ error: 'College slug is required' }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const total = await prisma.review.count({
      where: { collegeId: college.id },
    });

    const reviews = await prisma.review.findMany({
      where: { collegeId: college.id },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      data: reviews,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Reviews GET API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching reviews.' },
      { status: 500 }
    );
  }
}

// POST: Add a new review to a college (Authenticated)
export async function createCollegeReview(
  req: Request,
  slug: string | undefined
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ error: 'College slug is required' }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const body = await req.json();
    const validation = reviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { rating, title, body: reviewBody } = validation.data;

    const newReview = await prisma.review.create({
      data: {
        rating,
        title,
        body: reviewBody,
        collegeId: college.id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    // Recalculate college average rating
    const ratingAggregate = await prisma.review.aggregate({
      where: { collegeId: college.id },
      _avg: { rating: true },
    });

    const averageRating = ratingAggregate._avg.rating || rating;
    const roundedRating = Math.round(averageRating * 10) / 10;

    await prisma.college.update({
      where: { id: college.id },
      data: { rating: roundedRating },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Review POST API Error:', error);
    return NextResponse.json(
      { error: 'An error occurred while posting your review.' },
      { status: 500 }
    );
  }
}
