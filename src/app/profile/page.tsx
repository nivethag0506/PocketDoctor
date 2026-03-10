'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, Copy } from 'lucide-react';
import { useSharedState } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { EmergencyContacts } from "@/components/settings/EmergencyContacts";

export default function ProfilePage() {
  const { user, patientData } = useSharedState();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2 mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  const isPatient = user.role === 'patient';
  const codeToCopy = isPatient ? (patientData?.patientCode) : 'N/A';
  
  const handleCopyCode = () => {
    if (codeToCopy) {
      navigator.clipboard.writeText(codeToCopy);
      toast({
        title: "Code Copied!",
        description: "Your unique patient code has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Profile & Settings</h1>
        <p className="text-muted-foreground">
          View your personal information and manage your emergency contacts.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoItem icon={User} label="Name" value={user.name} />
              <InfoItem icon={Mail} label="Email" value={user.email} />
               {isPatient && (
                 <InfoItem icon={Phone} label="Allergies" value={patientData?.medicalHistory.allergies || 'N/A'} />
              )}
               {isPatient && (
                 <InfoItem icon={Phone} label="Chronic Conditions" value={patientData?.medicalHistory.chronicConditions || 'N/A'} />
              )}
            </CardContent>
          </Card>
          
          {isPatient && (
             <Card>
                <CardHeader>
                    <CardTitle>Patient Code</CardTitle>
                    <CardDescription>
                        Share this code with your caretaker to allow them to monitor your schedule.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <span className="font-mono text-lg font-semibold tracking-widest">{codeToCopy}</span>
                    <Button variant="outline" size="icon" onClick={handleCopyCode} disabled={!codeToCopy}>
                        <Copy className="h-4 w-4" />
                    </Button>
                </CardContent>
             </Card>
          )}
        </div>
        
        <div className="lg:col-span-2">
            {isPatient && <EmergencyContacts />}
        </div>
      </div>
    </div>
  );
}


const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-start gap-3">
        <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
        <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">{label}</span>
            <span className="font-semibold">{value}</span>
        </div>
    </div>
)
