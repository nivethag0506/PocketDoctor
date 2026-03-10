
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default function PrescriptionsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Notes & Orders
                </h1>
                <p className="text-muted-foreground">
                    Use templates/macros, eRx, labs/imaging orders, and quick order sets to speed workflows.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Create New Order</CardTitle>
                    <CardDescription>This page is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <ClipboardList className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Prescription & Lab Orders</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Tools for creating, managing, and sending patient prescriptions and lab orders will be here.
                    </p>
                </CardContent>
             </Card>
        </div>
    )
}
