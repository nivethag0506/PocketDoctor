

"use client";

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, AreaChart, Area, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, Share2, Download, User, CalendarDays, Pill } from 'lucide-react';
import type { Medication } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { differenceInDays, subDays, format } from 'date-fns';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useSharedState } from '../AppLayout';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';

type MedicationSummaryProps = {
  medications: Medication[];
};

// Helper function to generate mock historical data for the area chart
const generateHistoricalData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const taken = Math.floor(Math.random() * 4) + 1; // Random taken doses between 1 and 4
    const skipped = Math.floor(Math.random() * 2); // Random skipped doses between 0 and 1
    data.push({
      date: format(date, "MMM d"),
      taken: taken,
      skipped: skipped,
    });
  }
  return data;
};


export function MedicationSummary({ medications }: MedicationSummaryProps) {
  const { patientData } = useSharedState();
  const { toast } = useToast();
  
  const { overallSummary, medicationDetails, durationData, historicalAdherence } = useMemo(() => {
    let taken = 0;
    let skipped = 0;
    let pending = 0;
    
    const details = medications.map(med => {
      let medTaken = 0;
      let medSkipped = 0;
      let medPending = 0;
      med.doses.forEach(dose => {
        if (dose.status === 'taken') medTaken++;
        else if (dose.status === 'skipped') medSkipped++;
        else medPending++;
      });
      taken += medTaken;
      skipped += medSkipped;
      pending += medPending;
      const totalDoses = medTaken + medSkipped;
      const adherence = totalDoses > 0 ? (medTaken / totalDoses) * 100 : 0;
      return {
        id: med.id,
        name: med.name,
        adherence: Math.round(adherence),
      };
    });

    const duration = medications.map(med => ({
        name: med.name,
        days: differenceInDays(new Date(), new Date(med.startDate)) + 1
    }));
    
    const historical = generateHistoricalData();

    const total = taken + skipped + pending;
    return { 
      overallSummary: { taken, skipped, pending, total },
      medicationDetails: details,
      durationData: duration,
      historicalAdherence: historical,
    };
  }, [medications]);

  const chartConfig = {
    taken: { label: "Taken", color: "hsl(var(--chart-1))" },
    skipped: { label: "Skipped", color: "hsl(var(--chart-2))" },
    pending: { label: "Pending", color: "hsl(var(--chart-3))" },
    days: { label: "Days Taken", color: "hsl(var(--primary))" },
  };

  const handleShare = (contactPhone: string) => {
    const reportSummary = `Hi! Here is the medication adherence report for ${patientData?.name} from Pocket Doctor:
- *Doses Taken Today:* ${overallSummary.taken}
- *Doses Skipped Today:* ${overallSummary.skipped}

*Per-Medication Adherence (Overall):*
${medicationDetails.map(med => `- ${med.name}: ${med.adherence}%`).join('\n')}

This is an automated report.`;

    const whatsappUrl = `https://wa.me/${contactPhone.replace(/\D/g, '')}?text=${encodeURIComponent(reportSummary)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleExport = () => {
    toast({
      title: "Feature Coming Soon!",
      description: "Exporting reports to PDF/Excel will be available in a future update.",
    });
  }


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Taken (Today)</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallSummary.taken}</div>
          <p className="text-xs text-muted-foreground">
            out of {overallSummary.total} total doses today
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doses Skipped (Today)</CardTitle>
          <XCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{overallSummary.skipped}</div>
           <p className="text-xs text-muted-foreground">
            out of {overallSummary.total} total doses today
          </p>
        </CardContent>
      </Card>

       <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Adherence Actions</CardTitle>
          <CardDescription>Share or export your adherence report.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Share2 className="mr-2 h-4 w-4" /> Share Report
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Share with Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    Select a contact to share the report via WhatsApp.
                  </p>
                </div>
                {patientData && patientData.emergencyContacts.length > 0 ? (
                   <div className="grid gap-2">
                    {patientData.emergencyContacts.map((contact) => (
                      <div 
                        key={contact.id} 
                        className="flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => handleShare(contact.phone)}
                      >
                         <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarFallback className="bg-primary text-primary-foreground">{contact.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{contact.name}</p>
                                <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                     <User className="mx-auto h-8 w-8" />
                     <p className="mt-2 text-sm">No emergency contacts found. Please add one in Settings.</p>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="flex-1" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </CardContent>
      </Card>
      
      <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Adherence Over Time</CardTitle>
          <CardDescription>Doses taken vs. skipped over the last 30 days.</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] w-full pb-4 pl-2">
            <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={historicalAdherence}
                        margin={{
                            top: 10,
                            right: 10,
                            left: -20,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                        <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8}
                            fontSize={12}
                             tickFormatter={(value, index) => index % 5 === 0 ? value : ''}
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                        <ChartTooltip cursor={true} content={<ChartTooltipContent indicator="dot" />} />
                        <Area
                            dataKey="taken"
                            type="natural"
                            fill="hsl(var(--chart-1) / 0.8)"
                            stroke="hsl(var(--chart-1))"
                        />
                         <Area
                            dataKey="skipped"
                            type="natural"
                            fill="hsl(var(--chart-2) / 0.4)"
                            stroke="hsl(var(--chart-2))"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader>
          <CardTitle>Per-Medication Adherence (Overall)</CardTitle>
          <CardDescription>Overall adherence percentage for each medication.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {medicationDetails.length > 0 ? (
            medicationDetails.map(med => (
              <div key={med.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">{med.name}</span>
                  <span className="text-sm text-muted-foreground">{med.adherence}%</span>
                </div>
                <Progress value={med.adherence} className="h-2" />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground py-6">
              <Pill className="w-8 h-8 mb-2" />
              <p className="text-xs">No medications to track.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
        <CardHeader>
            <CardTitle>Medication Duration</CardTitle>
            <CardDescription>How long you've been taking each medication.</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] pr-0">
             <ChartContainer config={chartConfig} className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    {durationData.length > 0 ? (
                        <BarChart data={durationData} layout="vertical" margin={{ left: 10, right: 30 }}>
                             <XAxis type="number" dataKey="days" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                             <YAxis 
                                type="category" 
                                dataKey="name" 
                                width={80}
                                stroke="hsl(var(--muted-foreground))" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tick={{ dx: -10 }}
                             />
                            <RechartsTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="dot" />}
                            />
                            <Bar dataKey="days" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                            <CalendarDays className="w-8 h-8 mb-2" />
                            <p className="text-xs">No duration data available.</p>
                        </div>
                    )}
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
