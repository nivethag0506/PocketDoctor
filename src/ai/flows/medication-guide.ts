
'use server';
/**
 * @fileOverview Provides detailed information about a specific medication.
 *
 * - getMedicationGuide - A function that returns a guide for a given medication.
 * - MedicationGuideInput - The input type for the getMedicationGuide function.
 * - MedicationGuideOutput - The return type for the getMedicationGuide function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';

const MedicationGuideInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to get information about.'),
});
export type MedicationGuideInput = z.infer<typeof MedicationGuideInputSchema>;

const MedicationGuideOutputSchema = z.object({
  medicationName: z.string(),
  suggestedDosage: z.string().describe("A common or suggested dosage for the medication, e.g., '10mg' or '500mg'."),
  suggestedFrequency: z.string().describe("A common or suggested frequency for taking the medication, e.g., 'Once a day' or 'Twice a day'."),
  timing: z.string().describe('Recommended timing, e.g., "Morning or Evening".'),
  food: z.string().describe('Recommendation regarding food, e.g., "With or without food".'),
  advantages: z.array(z.string()).describe('List of key advantages or uses of the medication.'),
  disadvantages: z.array(z.string()).describe('List of potential disadvantages or side effects.'),
  duration: z.string().describe('Typical duration for taking the medication.'),
  disclaimer: z.string().describe('A disclaimer that this information is for educational purposes only and not a substitute for professional medical advice.'),
});
export type MedicationGuideOutput = z.infer<typeof MedicationGuideOutputSchema>;


export async function getMedicationGuide(input: MedicationGuideInput): Promise<MedicationGuideOutput> {
  return medicationGuideFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationGuidePrompt',
  input: { schema: MedicationGuideInputSchema },
  output: { schema: MedicationGuideOutputSchema },
  model: 'gemini-1.0-pro',
  prompt: `
    You are a trusted medical information provider. Your knowledge comes from a vast dataset of medical information.
    For the medication "{{medicationName}}", provide a comprehensive and accurate guide covering all of the following points in detail:
    - Suggested Dosage (e.g., '10mg' or '500mg')
    - Suggested Frequency (e.g., 'Once a day' or 'Twice a day with a 12-hour interval')
    - Timing (e.g., 'Best taken in the morning', 'Evening with meals')
    - Food (e.g., 'With or without food. Taking it with food can reduce stomach upset.')
    - Key Advantages / Benefits (Provide a list of the primary uses and benefits)
    - Common Disadvantages / Side Effects (Provide a list of potential side effects)
    - Duration (e.g., 'As prescribed by your doctor', 'For short-term use only')

    Provide a clear, easy-to-understand, and well-structured response in the requested format.
    Finally, you MUST include the following disclaimer text exactly as it is written here in the 'disclaimer' field: "This information is for educational purposes only and not a substitute for professional medical advice. Always consult your doctor or pharmacist."
  `,
});


const medicationGuideFlow = ai.defineFlow(
  {
    name: 'medicationGuideFlow',
    inputSchema: MedicationGuideInputSchema,
    outputSchema: MedicationGuideOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
