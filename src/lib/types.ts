
export type Medication = {
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
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  disclaimer?: string;
};

export type EmergencyContact = {
  id:string;
  name: string;
  phone: string;
  initials: string;
};

export type UserRole = 'patient' | 'doctor' | 'caretaker';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  fallback: string;
}

export interface Patient extends User {
  role: 'patient';
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
}

export interface Doctor extends User {
  role: 'doctor';
  patientIds: string[];
}

export interface Caretaker extends User {
  role: 'caretaker';
  patientId?: string;
}

export type AppUser = Patient | Doctor | Caretaker;
