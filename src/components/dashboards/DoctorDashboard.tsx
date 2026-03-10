
"use client";

import { useEffect, useState, useMemo } from "react";
import { CalendarClock, Users, BarChart2, LoaderCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import Link from 'next/link';
import { Button } from "../ui/button";
import { useSharedState } from "@/components/AppLayout";

type Patient = {
    id: string;
    name: string;
    doctorId?: string;
    appointments?: { next?: string };
};

export default function DoctorDashboard() {
    const { user, allPatients } = useSharedState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => setLoading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    const myPatients = useMemo(() => {
        if (!user || user.role !== 'doctor') return [];
        return allPatients.filter(p => p.doctorId === user.id);
    }, [user, allPatients]);

    if (loading || !user) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const totalPatients = myPatients.length;
    const adherenceRate = 82; // placeholder static metric
    const upcomingAppointments = myPatients.filter(p => !!p.appointments?.next).length;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Doctor Dashboard
                </h1>
                <p className="text-muted-foreground">
                    An overview of your schedule, patient metrics and activities.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPatients}</div>
                        <p className="text-xs text-muted-foreground">patients under your care</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Adherence Rate</CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adherenceRate}%</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{upcomingAppointments}</div>
                        <p className="text-xs text-muted-foreground">in the next 7 days</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Welcome, Doctor!</CardTitle>
                    <CardDescription>
                        This is the main dashboard for your practice.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-60">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <CalendarClock className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Ready to Review Your Day?</h3>
                    <p className="text-muted-foreground max-w-sm">
                        You can manage your patient list, view their adherence reports, and handle your schedule.
                    </p>
                    <Button asChild className="mt-2">
                        <Link href="/doctor/patients">
                            <Users className="mr-2" />
                            View Patient 360°
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
