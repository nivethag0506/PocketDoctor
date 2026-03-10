"use client";

import type { Medication } from "@/lib/types";
import { MedicationItem } from "./MedicationItem";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pill } from "lucide-react";
import Link from 'next/link';
import { Button } from "../ui/button";

type MedicationListProps = {
  medications: Medication[];
  onUpdateDose: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => void;
  onDeleteMedication: (medicationId: string) => void;
};

export function MedicationList({ medications, onUpdateDose, onDeleteMedication }: MedicationListProps) {
  if (medications.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>No Medications Added</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-60">
            <Pill className="w-16 h-16 text-muted-foreground" />
            <p className="text-muted-foreground">You haven't added any medications yet.</p>
            <Button asChild>
              <Link href="/guide">Go to Medication Guide to add one</Link>
            </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {medications.map((medication) => (
        <MedicationItem 
          key={medication.id} 
          medication={medication} 
          onUpdateDose={onUpdateDose}
          onDeleteMedication={onDeleteMedication}
        />
      ))}
    </div>
  );
}
