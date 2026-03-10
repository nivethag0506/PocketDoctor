
'use client';

import { useSharedState } from "@/components/AppLayout";
import PatientDashboard from "@/components/dashboards/PatientDashboard";
import { useMemo } from "react";
import { differenceInDays } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Pill } from "lucide-react";
import { LoaderCircle } from 'lucide-react';
import DoctorDashboard from "@/components/dashboards/DoctorDashboard";
import CaretakerDashboard from "@/components/dashboards/CaretakerDashboard";
import { DatabaseViewer } from "@/components/DatabaseViewer";


export default function Home() {
    const { user, patientData } = useSharedState();

    const appointmentDays = useMemo(() => {
        if (!patientData?.appointments.next) return null;
        const days = differenceInDays(new Date(patientData.appointments.next), new Date());
        return days > 0 ? days : 0;
    }, [patientData]);

    if (!user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (user.role === 'doctor') {
        return (
            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
                <DoctorDashboard />
                <DatabaseViewer userRole={user.role} userId={user.id} />
            </div>
        );
    }

    if (user.role === 'caretaker') {
        return (
            <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
                <CaretakerDashboard />
                <DatabaseViewer userRole={user.role} userId={user.id} />
            </div>
        );
    }

    // Default to Patient Dashboard for 'patient' or any other role as safety fallback
    if (!patientData && user.role === 'patient') {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Patient Dashboard
                </h1>
                <p className="text-muted-foreground">
                    A summary of your upcoming appointments and medications.
                </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {appointmentDays !== null ? (
                            <>
                                <div className="text-2xl font-bold">In {appointmentDays} day(s)</div>
                                <p className="text-xs text-muted-foreground">with your primary doctor</p>
                            </>
                        ) : (
                            <div className="text-2xl font-bold">No upcoming appointments</div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                        <Pill className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{patientData?.medications?.length || 0}</div>
                        <p className="text-xs text-muted-foreground">currently in your schedule</p>
                    </CardContent>
                </Card>
            </div>
            <PatientDashboard />
            <DatabaseViewer userRole={user.role} userId={user.id} />
        </div>
    );
}
