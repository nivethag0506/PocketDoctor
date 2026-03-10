import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET() {
  const col = await getCollection('patients');
  // Flatten all medications with patient linkage
  const patients = await col.find({}).project({ _id: 1, name: 1, doctorId: 1, medications: 1 }).toArray();
  const prescriptions = patients.flatMap((p: any) => (p.medications || []).map((m: any) => ({ ...m, patientId: p._id, patientName: p.name, doctorId: p.doctorId })));
  return NextResponse.json(prescriptions);
}


