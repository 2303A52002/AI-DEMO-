import { getSavedColleges, saveCollege, unsaveCollege } from '@/backend/controllers/saved';

export async function GET() {
  return getSavedColleges();
}

export async function POST(req: Request) {
  return saveCollege(req);
}

export async function DELETE(req: Request) {
  return unsaveCollege(req);
}
