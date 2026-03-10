
'use client';

import { useMemo } from "react";
import { useSharedState } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarClock } from "lucide-react";
import { format, differenceInDays } from 'date-fns';
import type { Patient } from "@/lib/types";

export default function DoctorAppointmentsPage() {
    const { user, allPatients } = useSharedState();

    const upcomingAppointments = useMemo(() => {
        if (user?.role !== 'doctor') return [];
        
        return allPatients
            .filter(p => p.doctorId === user.id && p.appointments.next)
            .map(p => ({ ...p, daysUntilNext: differenceInDays(new Date(p.appointments.next), new Date())}))
            .filter(p => p.daysUntilNext >= 0)
            .sort((a, b) => a.daysUntilNext - b.daysUntilNext);

    }, [user, allPatients]);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Upcoming Appointments
                </h1>
                <p className="text-muted-foreground">
                    A list of your patients with appointments scheduled soon.
                </p>
            </div>
            {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                    {upcomingAppointments.map(patient => (
                        <AppointmentCard key={patient.id} patient={patient} />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>No Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <CalendarClock className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">All Clear!</h3>
                        <p className="text-muted-foreground max-w-sm">
                            There are no upcoming appointments in the schedule.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function AppointmentCard({ patient }: { patient: Patient & { daysUntilNext: number } }) {
    const formattedDate = format(new Date(patient.appointments.next), "MMMM d, yyyy");

    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border-2 border-primary">
                        <AvatarImage src={patient.avatar} alt={patient.name} />
                        <AvatarFallback>{patient.fallback}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{patient.name}</p>
                        <p className="text-sm text-muted-foreground">{patient.email}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-semibold">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">
                        {patient.daysUntilNext === 0 ? 'Today' : `In ${patient.daysUntilNext} day(s)`}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
