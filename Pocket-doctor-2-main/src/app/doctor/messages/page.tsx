
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video } from "lucide-react";

export default function MessagesPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Telemedicine
                </h1>
                <p className="text-muted-foreground">
                    Queue, pre-charting, in-visit tools, and auto-generated summaries.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Telemedicine Workspace</CardTitle>
                    <CardDescription>This page is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <Video className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Virtual Visits</h3>
                    <p className="text-muted-foreground max-w-sm">
                        Manage your virtual visit queue, conduct video calls, and access in-visit tools here.
                    </p>
                </CardContent>
             </Card>
        </div>
    )
}
