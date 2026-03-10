
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart } from "lucide-react";

export default function PopulationAnalyticsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Population Analytics
                </h1>
                <p className="text-muted-foreground">
                    See trends, gaps in care, and high-risk patient groups.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Panel Management</CardTitle>
                    <CardDescription>Chronic conditions, gaps in care, and quality metrics.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <PieChart className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Insights and trends from your patient data will be displayed here, helping you manage panel health.
                    </p>
                </CardContent>
             </Card>
        </div>
    )
}
