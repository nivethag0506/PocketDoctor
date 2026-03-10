import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import type { PatientDB } from '@/lib/models';

export async function GET() {
  const col = await getCollection('patients');
  const patients = await col.find({}).toArray();
  const mapped = patients.map((p: any) => ({ ...p, id: p._id }));
  return NextResponse.json(mapped);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, doctorId, appointments, caretakerId } = body as {
      name: string;
      email: string;
      doctorId: string;
      appointments: { next: string };
      caretakerId?: string;
    };

    const usersCol = await getCollection('users');
    const patientsCol = await getCollection<PatientDB>('patients');

    const now = new Date();
    const id = `user-patient-${Date.now()}`;
    const nameParts = name.split(' ');
    const fallback = `${(nameParts[0]?.[0] || '').toUpperCase()}${(nameParts[1]?.[0] || '').toUpperCase()}`;
    const patientCode = `${fallback}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const newPatient: PatientDB = {
      _id: id as any,
      id,
      name,
      email,
      role: 'patient',
      avatar: '',
      fallback,
      patientCode,
      caretakerId: caretakerId || undefined,
      doctorId,
      medications: [],
      emergencyContacts: [],
      medicalHistory: { allergies: 'None', chronicConditions: 'None' },
      appointments,
      createdAt: now,
      updatedAt: now,
    };

    // Insert into patients collection
    await patientsCol.updateOne(
      { _id: newPatient.id },
      { $set: { ...newPatient, _id: newPatient.id } },
      { upsert: true }
    );

    // Mirror minimal record in users collection
    await usersCol.updateOne(
      { _id: newPatient.id },
      {
        $set: {
          _id: newPatient.id,
          id: newPatient.id,
          name: newPatient.name,
          email: newPatient.email,
          role: 'patient',
          avatar: newPatient.avatar,
          fallback: newPatient.fallback,
          doctorId: newPatient.doctorId,
          caretakerId: newPatient.caretakerId,
        },
      },
      { upsert: true }
    );

    // Optionally link caretaker to this patient in users collection
    if (caretakerId) {
      await usersCol.updateOne(
        { _id: caretakerId },
        { $set: { patientId: id } }
      );
    }

    return NextResponse.json({
      success: true,
      patient: { ...newPatient },
    });
  } catch (error) {
    console.error('Error creating patient:', error);
    return NextResponse.json({ success: false, error: 'Failed to create patient' }, { status: 500 });
  }
}
