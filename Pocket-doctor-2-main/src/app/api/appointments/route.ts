import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import type { Appointment } from '@/lib/models';

export async function GET(request: NextRequest) {
  try {
    const col = await getCollection<Appointment>('appointments');
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    let query: Record<string, unknown> = {};
    if (patientId) query = { patientId };
    if (doctorId) query = { doctorId };

    const appointments = await col.find(query).toArray();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const col = await getCollection<Appointment>('appointments');
    const appointmentData = await request.json();

    const appointment: Appointment = {
      ...appointmentData,
      id: new Date().toISOString(),
    };

    const result = await col.insertOne(appointment as any);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      appointment: appointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
