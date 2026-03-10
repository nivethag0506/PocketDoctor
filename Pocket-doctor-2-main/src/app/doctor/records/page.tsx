
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PatientRecordsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Care Plans
                </h1>
                <p className="text-muted-foreground">
                    Goal setting, tasks for patient/caregiver, progress tracking, and adherence insights.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Manage Care Plans</CardTitle>
                    <CardDescription>This page is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Users className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Patient-Centered Plans</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Define goals, set tasks, and track patient progress against their care plan here.
                    </p>
                </CardContent>
             </Card>
        </div>
    )
}
