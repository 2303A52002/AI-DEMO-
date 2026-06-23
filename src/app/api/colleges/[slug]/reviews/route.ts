import { getCollegeReviews, createCollegeReview } from '@/backend/controllers/colleges';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return getCollegeReviews(req, slug);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  return createCollegeReview(req, slug);
}
