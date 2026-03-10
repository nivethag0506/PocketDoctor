
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldQuestion } from "lucide-react";

export default function PermissionsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
             <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Permissions
                </h1>
                <p className="text-muted-foreground">
                    Caregiver link review, consent management, proxy control, and audit trails.
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Access Management</CardTitle>
                    <CardDescription>This page is under construction.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                    <div className="p-4 bg-primary/10 rounded-full">
                        <ShieldQuestion className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">Consent & Proxy Control</h3>
                    <p className="text-muted-foreground max-w-sm">
                       Review and manage patient consent forms and caregiver access permissions here.
                    </p>
                </CardContent>
             </Card>
        </div>
    )
}
