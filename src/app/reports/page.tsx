'use client';

import { MedicationSummary } from "@/components/medication/MedicationSummary";
import { useSharedState } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LoaderCircle, PieChart } from "lucide-react";
import { AchievementCard } from "@/components/gamification/AchievementCard";

export default function ReportsPage() {
  const { patientData } = useSharedState();

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Reports & Adherence</h1>
        <p className="text-muted-foreground">
          View your adherence statistics, track your progress, and share reports.
        </p>
      </div>

       <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {!patientData ? (
             <Card className="h-full">
                <CardHeader>
                    <CardTitle>Medication Summary</CardTitle>
                    <CardDescription>
                        A summary of your medication adherence.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-96">
                   <LoaderCircle className="w-8 h-8 animate-spin" />
                </CardContent>
             </Card>
          ) : patientData.medications.length > 0 ? (
            <MedicationSummary medications={patientData.medications} />
          ) : (
            <Card>
                <CardHeader>
                    <CardTitle>Medication Summary</CardTitle>
                </CardHeader>
                 <CardContent className="flex flex-col items-center justify-center h-full text-center py-20">
                    <PieChart className="w-16 h-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold">No Data Available</h3>
                    <p className="text-muted-foreground">Add medications to see your adherence reports.</p>
                </CardContent>
            </Card>
          )}
        </div>
         <div className="lg:col-span-1">
          <AchievementCard />
        </div>
      </div>
    </div>
  );
}
