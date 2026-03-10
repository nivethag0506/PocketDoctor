
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Beaker } from "lucide-react";

export default function LabsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Inbox
                </h1>
                <p className="text-muted-foreground">
                    Lab result sign-off, refill approvals, message routing, and task assignments to staff.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Unified Inbox</CardTitle>
                    <CardDescription>This page is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Beaker className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Lab & Imaging Results</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Patient lab results, imaging reports, and refill requests will appear here for your review and sign-off.
                    </p>
                </CardContent>
             </Card>
        </div>
    )
}
