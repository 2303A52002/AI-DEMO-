import { getColleges } from '@/backend/controllers/colleges';

export async function GET(req: Request) {
  return getColleges(req);
}
