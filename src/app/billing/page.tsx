
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Billing & Payments
          </h1>
           <p className="text-muted-foreground">
            View statements, itemized charges, insurance details, and use multiple payment methods.
          </p>
        </div>
        <Card>
            <CardHeader>
              <CardTitle>Billing Overview</CardTitle>
              <CardDescription>
                Review your account balance and recent statements.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center h-full min-h-96">
                <div className="p-4 bg-primary/10 rounded-full">
                    <CreditCard className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Payment Portal</h3>
                <p className="text-muted-foreground max-w-sm">
                    A secure portal to view statements, manage insurance, and make payments will be available here.
                </p>
            </CardContent>
        </Card>
      </div>
  );
}
