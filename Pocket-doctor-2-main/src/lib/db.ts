import { MongoClient, Db, Collection } from 'mongodb';

const DEFAULT_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DEFAULT_DB_NAME = process.env.MONGODB_DB || 'pocket_doctor';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb && cachedClient) return cachedDb;
  const client = new MongoClient(DEFAULT_URI);
  await client.connect();
  const db = client.db(DEFAULT_DB_NAME);
  cachedClient = client;
  cachedDb = db;
  return db;
}

export async function getCollection<T = any>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  return db.collection<T>(name);
}

export type PatientDoc = {
  _id: string;
  name: string;
  email: string;
  role: 'patient';
  avatar: string;
  fallback: string;
  patientCode: string;
  caretakerId?: string;
  doctorId?: string;
  medications: any[];
  emergencyContacts: any[];
  medicalHistory: { allergies: string; chronicConditions: string };
  appointments: { next: string };
};

export type DoctorDoc = {
  _id: string;
  name: string;
  email: string;
  role: 'doctor';
  avatar: string;
  fallback: string;
  patientIds: string[];
};

export type CaretakerDoc = {
  _id: string;
  name: string;
  email: string;
  role: 'caretaker';
  avatar: string;
  fallback: string;
  patientId?: string;
};


