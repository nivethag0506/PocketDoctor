
'use client';

import { useState } from 'react';
import { useSharedState } from '../AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { MonitorSmartphone, AlertTriangle } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import PatientDashboard from './PatientDashboard';

export default function CaretakerDashboard() {
  const { linkCaretakerToPatient, patientData } = useSharedState();
  const [patientCode, setPatientCode] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleLinkPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientCode.trim()) {
      setError('Please enter a patient code.');
      return;
    }
    const success = linkCaretakerToPatient(patientCode);
    if (success) {
      toast({
        title: 'Patient Linked!',
        description: 'You are now monitoring the patient.',
      });
      setError('');
    } else {
      setError('Invalid patient code. Please check the code and try again.');
    }
  };
  
  if (patientData) {
    return <PatientDashboard />
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Caretaker Dashboard</h1>
        <p className="text-muted-foreground">Link to a patient to begin monitoring.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link to a Patient</CardTitle>
          <CardDescription>
            Enter the 8-character code from the patient's profile to start monitoring their
            medication schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLinkPatient} className="flex flex-col gap-4 max-w-md mx-auto">
            <div className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
              <div className="p-4 bg-primary/10 rounded-full">
                <MonitorSmartphone className="w-12 h-12 text-primary" />
              </div>
              <div className="w-full space-y-2">
                <Label htmlFor="patientCode" className="sr-only">
                  Patient Code
                </Label>
                <Input
                  id="patientCode"
                  placeholder="Enter Patient Code"
                  value={patientCode}
                  onChange={(e) => setPatientCode(e.target.value)}
                  className="text-center text-lg font-mono tracking-widest"
                />
              </div>
              {error && (
                <div className="text-sm text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4"/>
                    {error}
                </div>
              )}
              <Button type="submit" className="w-full">
                Link to Patient
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
