import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import type { CaretakerDB } from '@/lib/models';

export async function GET() {
  try {
    const col = await getCollection<CaretakerDB>('caretakers');
    const caretakers = await col.find({}).toArray();

    return NextResponse.json(caretakers);
  } catch (error) {
    console.error('Error fetching caretakers:', error);
    return NextResponse.json({ error: 'Failed to fetch caretakers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const col = await getCollection<CaretakerDB>('caretakers');
    const caretakerData = await request.json();

    const caretaker: CaretakerDB = {
      ...caretakerData,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as CaretakerDB;

    const result = await col.insertOne(caretaker as any);

    return NextResponse.json({
      success: true,
      id: result.insertedId,
      caretaker: caretaker,
    });
  } catch (error) {
    console.error('Error creating caretaker:', error);
    return NextResponse.json({ error: 'Failed to create caretaker' }, { status: 500 });
  }
}
