
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Send } from "lucide-react";

export default function EPrescriptionsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    E-Prescriptions
                </h1>
                <p className="text-muted-foreground">
                   Refill requests, status tracking, preferred pharmacy, and adherence reminders.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Prescriptions</CardTitle>
                    <CardDescription>Request refills and track their status.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PrescriptionItem name="Metformin" dosage="500mg" status="Refill due in 5 days" />
                    <PrescriptionItem name="Lisinopril" dosage="10mg" status="Ready for pickup" />
                </CardContent>
            </Card>
        </div>
    )
}


const PrescriptionItem = ({ name, dosage, status }: { name: string, dosage: string, status: string}) => (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-background">
        <div className="flex items-center gap-4">
            <Pill className="h-6 w-6 text-primary" />
            <div>
                <p className="font-semibold">{name} ({dosage})</p>
                <p className="text-sm text-muted-foreground">{status}</p>
            </div>
        </div>
        <Button>
            <Send className="mr-2" />
            Request Refill
        </Button>
    </div>
);
