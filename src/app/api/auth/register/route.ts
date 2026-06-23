import { handleRegister } from '@/backend/controllers/auth';

export async function POST(req: Request) {
  return handleRegister(req);
}
