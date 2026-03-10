import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET() {
  const usersCol = await getCollection('users');
  const doctors = await usersCol.find({ role: 'doctor' }).toArray();
  const mapped = doctors.map((d: any) => ({ ...d, id: d._id }));
  return NextResponse.json(mapped);
}
