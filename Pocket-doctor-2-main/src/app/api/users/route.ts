import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET() {
  const col = await getCollection('users');
  const users = await col
    .find({})
    .project({ _id: 1, name: 1, email: 1, role: 1, avatar: 1, fallback: 1, patientId: 1, patientIds: 1, caretakerId: 1, doctorId: 1 })
    .toArray();
  const mapped = users.map((u: any) => ({ ...u, id: u._id }));
  return NextResponse.json(mapped);
}


