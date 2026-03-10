
"use client";

import { MoreVertical, Trash2, Calendar } from "lucide-react";
import type { Medication } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { differenceInDays, differenceInMonths, formatDistanceToNowStrict } from "date-fns";

type MedicationItemProps = {
  medication: Medication;
  onUpdateDose: (medicationId: string, scheduledTime: string, status: 'taken' | 'skipped') => void;
  onDeleteMedication: (medicationId: string) => void;
};

export function MedicationItem({ medication, onUpdateDose, onDeleteMedication }: MedicationItemProps) {
  const { toast } = useToast();

  const handleDoseAction = (scheduledTime: string, status: 'taken' | 'skipped') => {
    onUpdateDose(medication.id, scheduledTime, status);
    toast({
      title: "Dose Logged",
      description: `Your ${status} dose of ${medication.name} at ${scheduledTime} has been recorded.`,
    });
  };

  const handleDelete = () => {
    onDeleteMedication(medication.id);
    toast({
      title: "Medication Removed",
      description: `${medication.name} has been removed from your list.`,
      variant: "destructive",
    });
  }

  const getStatusBadge = (status: 'pending' | 'taken' | 'skipped') => {
    switch (status) {
      case 'taken':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-700">Taken</Badge>;
      case 'skipped':
        return <Badge variant="destructive">Skipped</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  }

  const getDuration = () => {
    const startDate = new Date(medication.startDate);
    const now = new Date();
    const days = differenceInDays(now, startDate);
    const months = differenceInMonths(now, startDate);

    if (days < 1) {
      return "Day 1";
    }
    
    if (months >= 1) {
      return `Month ${months + 1}`;
    }

    return `Day ${days + 1}`;
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline text-xl">{medication.name}</CardTitle>
          <CardDescription>{medication.dosage} - {medication.frequency}</CardDescription>
        </div>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="space-y-3">
            <h4 className="text-sm font-medium">Today's Schedule</h4>
            {medication.doses.map(dose => (
              <div key={dose.scheduled} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className='font-mono'>{dose.scheduled}</span>
                   {getStatusBadge(dose.status)}
                </div>
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDoseAction(dose.scheduled, 'taken')}
                        disabled={dose.status !== 'pending'}
                        className="h-7"
                    >Take</Button>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleDoseAction(dose.scheduled, 'skipped')}
                        disabled={dose.status !== 'pending'}
                        className="h-7"
                    >Skip</Button>
                </div>
              </div>
            ))}
        </div>
        <div className="mt-4 pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{getDuration()}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
