
import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import type { DoctorDB } from '@/lib/models';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, specialization, role = 'doctor' } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Missing name or email' },
                { status: 400 }
            );
        }

        if (role === 'doctor' && !specialization) {
            return NextResponse.json(
                { error: 'Specialization is required for doctors' },
                { status: 400 }
            );
        }

        const usersCollection = await getCollection('users');

        // Check if email already exists
        const existing = await usersCollection.findOne({ email });
        if (existing) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        const id = `user-${role}-${Date.now()}`;
        const nameParts = name.split(' ');
        const fallback = (
            (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '')
        ).toUpperCase();

        let newUser: any;

        if (role === 'doctor') {
            const collection = await getCollection<DoctorDB>('doctors');
            newUser = {
                _id: id,
                id,
                name,
                email,
                role: 'doctor',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                fallback,
                specialization,
                patientIds: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await collection.insertOne(newUser);
        } else if (role === 'caretaker') {
            const collection = await getCollection('caretakers');

            newUser = {
                _id: id,
                id,
                name,
                email,
                role: 'caretaker',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                fallback,
                patientId: undefined, // Can be linked later
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            await collection.insertOne(newUser);
        } else {
            // Create Patient
            const collection = await getCollection('patients');
            const patientCode = `${fallback}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

            newUser = {
                _id: id,
                id,
                name,
                email,
                role: 'patient',
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                fallback,
                patientCode,
                medications: [],
                emergencyContacts: [],
                medicalHistory: {
                    allergies: 'None',
                    chronicConditions: 'None',
                },
                appointments: {},
                createdAt: new Date(),
                updatedAt: new Date(),
            }
            await collection.insertOne(newUser);
        }

        // Insert into users collection (for login)
        await usersCollection.insertOne({
            _id: id,
            ...newUser,
        });

        return NextResponse.json({ success: true, user: newUser });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
