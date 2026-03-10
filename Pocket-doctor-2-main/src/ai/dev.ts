'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/medication-assistant.ts';
import '@/ai/flows/medication-guide.ts';
import '@/ai/flows/prescription-parser.ts';
