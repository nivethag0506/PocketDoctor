'use server';
/**
 * @fileOverview An AI flow for parsing medications from a prescription image.
 *
 * - parsePrescription - A function that handles the prescription parsing process.
 * - PrescriptionParserInput - The input type for the parsePrescription function.
 * - PrescriptionParserOutput - The return type for the parsePrescription function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';

const PrescriptionParserInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a prescription, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type PrescriptionParserInput = z.infer<typeof PrescriptionParserInputSchema>;

const ParsedMedicationSchema = z.object({
  name: z.string().describe('The name of the medication.'),
  dosage: z.string().describe('The dosage of the medication, e.g., "500mg" or "1 tablet".'),
  frequency: z.string().describe('The frequency for taking the medication, e.g., "Once a day".'),
});

const PrescriptionParserOutputSchema = z.object({
  medications: z.array(ParsedMedicationSchema).describe("An array of medications found in the prescription.")
});
export type PrescriptionParserOutput = z.infer<typeof PrescriptionParserOutputSchema>;

export async function parsePrescription(input: PrescriptionParserInput): Promise<PrescriptionParserOutput> {
  return prescriptionParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prescriptionParserPrompt',
  input: { schema: PrescriptionParserInputSchema },
  output: { schema: PrescriptionParserOutputSchema },
  model: 'gemini-1.5-pro',
  prompt: `You are an expert at reading and interpreting medical prescriptions.

Analyze the provided image of a prescription. Identify each medication listed, along with its dosage and frequency.

Extract the following information for each medication and return it in a structured format:
- Medication Name
- Dosage (e.g., "10mg", "1 tablet")
- Frequency (e.g., "Once daily", "Twice a day")

Here is the prescription to analyze:
{{media url=photoDataUri}}`,
});

const prescriptionParserFlow = ai.defineFlow(
  {
    name: 'prescriptionParserFlow',
    inputSchema: PrescriptionParserInputSchema,
    outputSchema: PrescriptionParserOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
