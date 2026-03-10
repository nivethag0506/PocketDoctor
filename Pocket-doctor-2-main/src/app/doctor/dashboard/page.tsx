
'use client';

import DoctorDashboard from "@/components/dashboards/DoctorDashboard";
import { useSharedState } from "@/components/AppLayout";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { LoaderCircle } from 'lucide-react';

export default function DoctorDashboardPage() {
    const { user } = useSharedState();
    const router = useRouter();

    useEffect(() => {
        if (user && user.role !== 'doctor') {
            router.replace('/');
        }
    }, [user, router]);

    if (!user || user.role !== 'doctor') {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <DoctorDashboard />;
}
