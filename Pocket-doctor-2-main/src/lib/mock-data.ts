
import type { Patient, Doctor, Caretaker, AppUser } from './types';
import { subDays, addDays, formatISO } from "date-fns";

export const MOCK_PATIENTS: Patient[] = [];

export const MOCK_DOCTORS: Doctor[] = [];

export const MOCK_CARETAKERS: Caretaker[] = [];

export const MOCK_USERS: AppUser[] = [
    ...MOCK_PATIENTS,
    ...MOCK_DOCTORS,
    ...MOCK_CARETAKERS
];
