import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { MOCK_USERS, MOCK_PATIENTS, MOCK_DOCTORS, MOCK_CARETAKERS } from '@/lib/mock-data';

export async function POST() {
  const usersCol = await getCollection('users');
  const patientsCol = await getCollection('patients');
  const doctorsCol = await getCollection('doctors');

  // idempotent seed: upsert by _id
  for (const u of MOCK_USERS) {
    await usersCol.updateOne({ _id: u.id }, { $set: { ...u, _id: u.id } }, { upsert: true });
  }
  for (const d of MOCK_DOCTORS) {
    await doctorsCol.updateOne({ _id: d.id }, { $set: { ...d, _id: d.id } }, { upsert: true });
  }
  for (const p of MOCK_PATIENTS) {
    await patientsCol.updateOne({ _id: p.id }, { $set: { ...p, _id: p.id } }, { upsert: true });
  }
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return POST();
}


