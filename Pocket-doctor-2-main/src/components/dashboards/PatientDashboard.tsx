'use client';

import { useSharedState } from "@/components/AppLayout";
import { MedicationList } from "@/components/medication/MedicationList";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, PlusCircle, MessageSquare, CalendarClock, HeartPulse, LoaderCircle } from "lucide-react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function PatientDashboard() {
  const { patientData, updateDoseStatus, deleteMedication } = useSharedState();

  if (!patientData) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mt-6">
        <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">
          Today's Schedule
        </h2>
        {patientData.medications.length > 0 ? (
          <MedicationList 
            medications={patientData.medications} 
            onUpdateDose={updateDoseStatus} 
            onDeleteMedication={deleteMedication} 
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
              <div className="p-4 bg-primary/10 rounded-full">
                <Pill className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">No Medications Added</h3>
              <p className="text-muted-foreground max-w-sm">
                Your schedule is empty. Add a medication from the Medication Guide or scan a prescription.
              </p>
              <div className="flex gap-4 mt-2">
                 <Button asChild>
                    <Link href="/guide">
                      <PlusCircle className="mr-2" />
                      Add from Guide
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/scanner">
                      <PlusCircle className="mr-2" />
                      Scan Prescription
                    </Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
