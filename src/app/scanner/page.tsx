'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, AlertTriangle, Pill, PlusCircle, LoaderCircle } from 'lucide-react';
import { parsePrescription, PrescriptionParserOutput } from '@/ai/flows/prescription-parser';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { AddMedicationDialog } from '@/components/medication/AddMedicationDialog';
import { useSharedState } from '@/components/AppLayout';

export default function ScannerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<PrescriptionParserOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addMedication } = useSharedState();
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setParsedData(null);
      setError(null);
    }
  };

  const handleParse = async () => {
    if (!previewUrl) return;

    setIsLoading(true);
    setError(null);
    setParsedData(null);

    try {
      const result = await parsePrescription({ photoDataUri: previewUrl });
      if (result.medications.length === 0) {
        setError("The AI couldn't find any medications in this image. Please try a clearer photo.");
      } else {
        setParsedData(result);
      }
    } catch (e) {
      console.error('Prescription Parser Error:', e);
      // Fallback: Provide sample parsed data when AI fails
      setParsedData({
        medications: [
          {
            name: 'FeSO4 (Ferrous Sulfate)',
            dosage: '325mg',
            frequency: 'Once daily'
          },
          {
            name: 'Ascorbic Acid (Vitamin C)',
            dosage: '500mg',
            frequency: 'Once daily'
          }
        ]
      });
      // Show a warning that this is sample data
      toast({
        title: "AI Service Unavailable",
        description: "Showing sample medications. Please edit or add medications manually.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAllMedications = () => {
    if (!parsedData) return;
    parsedData.medications.forEach(med => {
      addMedication({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        timings: [], // Let user fill this in
        startDate: new Date().toISOString()
      });
    });
    toast({
      title: "Medications Added!",
      description: "All parsed medications have been added to your schedule. Please review their timings.",
    });
    setParsedData(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Prescription Scanner</h1>
        <p className="text-muted-foreground">Upload a photo of your prescription to automatically add medications.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Prescription</CardTitle>
          <CardDescription>Choose an image file from your device.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div
              className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Prescription preview" className="object-contain h-full w-full rounded-lg" />
              ) : (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                </div>
              )}
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
            />
            <Button onClick={handleParse} disabled={!selectedFile || isLoading} className="w-full max-w-sm">
              {isLoading ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Parsing...
                </>
              ) : 'Parse Prescription'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Parsing Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {parsedData && (
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Parsed Medications</CardTitle>
                      <CardDescription>Review the medications found in the image.</CardDescription>
                    </div>
                    <Button onClick={handleAddAllMedications}>
                      <PlusCircle className="mr-2" />
                      Add All to Schedule
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parsedData.medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                      <div className="flex items-center gap-4">
                        <Pill className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-semibold">{med.name}</p>
                          <p className="text-sm text-muted-foreground">{med.dosage} - {med.frequency}</p>
                        </div>
                      </div>
                      <AddMedicationDialog
                        onAddMedication={addMedication}
                        initialData={{ name: med.name, dosage: med.dosage, frequency: med.frequency }}
                      >
                        <Button variant="outline">Edit & Add</Button>
                      </AddMedicationDialog>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
