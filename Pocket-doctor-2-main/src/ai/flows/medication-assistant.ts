'use server';
/**
 * @fileOverview AI-powered chatbot for medication queries and personalized advice.
 *
 * - medicationAssistant - A function that handles medication-related questions and provides personalized advice.
 * - MedicationAssistantInput - The input type for the medicationAssistant function.
 * - MedicationAssistant-Output - The return type for the medicationAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';

const MedicationAssistantInputSchema = z.object({
  query: z.string().describe('The user question about their medication.'),
  currentMedications: z.array(z.string()).optional().describe('List of current medications the user is taking.'),
});
export type MedicationAssistantInput = z.infer<typeof MedicationAssistantInputSchema>;

const MedicationAssistantOutputSchema = z.object({
  response: z.string().describe('The AI chatbot response to the user query.'),
  disclaimer: z.string().describe('A disclaimer stating that this is not a substitute for advice from qualified healthcare professionals.'),
});
export type MedicationAssistantOutput = z.infer<typeof MedicationAssistantOutputSchema>;

export async function medicationAssistant(input: MedicationAssistantInput): Promise<MedicationAssistantOutput> {
  return medicationAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationAssistantPrompt',
  input: { schema: MedicationAssistantInputSchema },
  output: { schema: MedicationAssistantOutputSchema },
  model: 'gemini-1.0-pro',
  prompt: `You are a helpful AI medication assistant. You provide personalized advice and answer questions based on the user's current medications.

  Patient context:
  {{#if currentMedications}}
  Current medications: {{currentMedications}}
  {{else}}
  No current medications listed.
  {{/if}}

  Medical query: {{query}}

  Provide a helpful and accurate medical information response.
  
  IMPORTANT: You must always include the following disclaimer text exactly as it is written here in the 'disclaimer' field of your response: "This is not a substitute for advice from qualified healthcare professionals. Always recommend consulting healthcare professionals for serious concerns."
  `,
});

const medicationAssistantFlow = ai.defineFlow(
  {
    name: 'medicationAssistantFlow',
    inputSchema: MedicationAssistantInputSchema,
    outputSchema: MedicationAssistantOutputSchema,
  },
  async input => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (err) {
      console.error("AI Flow error:", err);
      throw err;
    }
  }
);
