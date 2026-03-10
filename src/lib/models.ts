import { ObjectId } from 'mongodb';

export interface Medication {
  _id?: ObjectId;
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timings: string[];
  startDate: string;
  doses: {
    scheduled: string;
    status: "pending" | "taken" | "skipped";
  }[];
}

export interface EmergencyContact {
  _id?: ObjectId;
  id: string;
  name: string;
  phone: string;
  initials: string;
}

export interface Appointment {
  _id?: ObjectId;
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  description: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface PatientDB {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  role: 'patient';
  avatar: string;
  fallback: string;
  patientCode: string;
  caretakerId?: string;
  doctorId?: string;
  medications: Medication[];
  emergencyContacts: EmergencyContact[];
  medicalHistory: {
    allergies: string;
    chronicConditions: string;
  };
  appointments: {
    next: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DoctorDB {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  role: 'doctor';
  avatar: string;
  fallback: string;
  patientIds: string[];
  specialization?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaretakerDB {
  _id?: ObjectId;
  id: string;
  name: string;
  email: string;
  role: 'caretaker';
  avatar: string;
  fallback: string;
  patientId?: string;
  relationship?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserDB = PatientDB | DoctorDB | CaretakerDB;
