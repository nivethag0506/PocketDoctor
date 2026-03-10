import { getDatabase } from './mongodb';
import { PatientDB, DoctorDB, CaretakerDB, Appointment } from './models';
import { subDays, addDays, formatISO } from "date-fns";

export async function initializeDatabase() {
  try {
    const db = await getDatabase();

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('patients').deleteMany({});
    await db.collection('doctors').deleteMany({});
    await db.collection('caretakers').deleteMany({});
    await db.collection('appointments').deleteMany({});

    // Insert all data (Previously inserted default data here, now keeping it empty)
    // await db.collection('patients').insertMany(patients);
    // await db.collection('doctors').insertMany(doctors);
    // await db.collection('caretakers').insertMany(caretakers);
    // await db.collection('appointments').insertMany(appointments);

    console.log('Database initialized successfully! (Data cleared)');
    return { success: true, message: 'Database initialized successfully! (Data cleared)' };
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
