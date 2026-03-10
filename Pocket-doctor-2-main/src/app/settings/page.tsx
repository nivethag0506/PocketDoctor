'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Palette, Languages, HelpCircle } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
       <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
          <p className="text-muted-foreground">
            Manage your application preferences and notifications.
          </p>
        </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Control how you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem icon={Bell} title="Medication Reminders">
              <Switch defaultChecked />
            </SettingItem>
            <SettingItem icon={Bell} title="Appointment Alerts">
              <Switch defaultChecked />
            </SettingItem>
             <SettingItem icon={Bell} title="Report Summaries">
              <Switch />
            </SettingItem>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Display & Language</CardTitle>
            <CardDescription>Adjust the app's appearance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem icon={Palette} title="High Contrast Mode">
              <Switch />
            </SettingItem>
             <SettingItem icon={Languages} title="Language">
              <span className="text-sm text-muted-foreground">English</span>
            </SettingItem>
          </CardContent>
        </Card>

         <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Get help and find more information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SettingItem icon={HelpCircle} title="Help Center" />
            <SettingItem icon={HelpCircle} title="Contact Support" />
            <SettingItem icon={HelpCircle} title="About Pocket Doctor" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const SettingItem = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children?: React.ReactNode }) => (
    <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center gap-4">
            <Icon className="h-6 w-6 text-primary" />
            <Label className="text-base font-medium">{title}</Label>
        </div>
        {children}
    </div>
);
