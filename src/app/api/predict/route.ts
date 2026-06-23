import { handlePredict } from '@/backend/controllers/predict';

export async function POST(req: Request) {
  return handlePredict(req);
}
