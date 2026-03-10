
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookAppointmentDialog } from "@/components/appointments/BookAppointmentDialog";
import { PlusCircle, CalendarClock, Calendar } from "lucide-react";
import { useSharedState } from "@/components/AppLayout";
import { useMemo } from "react";
import { format, parseISO } from "date-fns";

export default function AppointmentsPage() {
    const { user, patientData, allPatients } = useSharedState();

    // For caretakers, get the linked patient's appointments
    const appointments = useMemo(() => {
        if (!user) return [];

        if (user.role === 'patient' && patientData?.appointments?.next) {
            return [{
                id: 'patient-apt-1',
                date: patientData.appointments.next,
                patientName: patientData.name,
                type: 'Doctor Visit'
            }];
        }

        if (user.role === 'caretaker') {
            // Find the patient linked to this caretaker
            const caretaker = user as { patientId?: string };
            if (caretaker.patientId) {
                const linkedPatient = allPatients.find(p => p.id === caretaker.patientId);
                if (linkedPatient?.appointments?.next) {
                    return [{
                        id: 'caretaker-apt-1',
                        date: linkedPatient.appointments.next,
                        patientName: linkedPatient.name,
                        type: 'Doctor Visit'
                    }];
                }
            }
        }

        return [];
    }, [user, patientData, allPatients]);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">
                        Appointments
                    </h1>
                    <p className="text-muted-foreground">
                        Self-scheduling, reschedule/cancel, waitlist, and automated reminders.
                    </p>
                </div>
                <BookAppointmentDialog>
                    <Button>
                        <PlusCircle className="mr-2" />
                        Schedule New
                    </Button>
                </BookAppointmentDialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {appointments.length > 0 ? (
                        <div className="space-y-4">
                            {appointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-full">
                                            <Calendar className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{apt.type}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Patient: {apt.patientName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">
                                            {format(parseISO(apt.date), 'PPP')}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Scheduled</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                            <div className="p-4 bg-primary/10 rounded-full">
                                <CalendarClock className="w-12 h-12 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">No Upcoming Appointments</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Your appointment calendar will be displayed here.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
