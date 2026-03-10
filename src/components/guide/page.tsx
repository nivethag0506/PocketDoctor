

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { getMedicationGuide, MedicationGuideOutput } from '@/ai/flows/medication-guide';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { LifeBuoy, ThumbsUp, ThumbsDown, Clock, AlertTriangle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AddMedicationDialog } from '@/components/medication/AddMedicationDialog';
import { useSharedState } from '@/components/AppLayout';
import { MedicationList } from '@/components/medication/MedicationList';

const formSchema = z.object({
  medicationName: z.string().min(2, { message: 'Medication name must be at least 2 characters.' }),
});

export default function GuidePage() {
  const [guide, setGuide] = useState<MedicationGuideOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { patientData, addMedication, updateDoseStatus, deleteMedication } = useSharedState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      medicationName: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setGuide(null);
    try {
      const result = await getMedicationGuide({ medicationName: values.medicationName });
      setGuide(result);
    } catch (err) {
      setError('Sorry, I could not retrieve information for that medication. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Medication Guide</h1>
          <p className="text-muted-foreground">
            Enter a medication name to get automated suggestions and add it to your schedule.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Look up a Medication</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-4">
                <FormField
                  control={form.control}
                  name="medicationName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Lisinopril" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <AddMedicationDialog 
                    onAddMedication={addMedication}
                  >
                   <Button type="button" variant="outline">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Manually
                    </Button>
                  </AddMedicationDialog>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Get Guide'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && <GuideSkeleton />}
        {error && <Alert variant="destructive"><AlertTriangle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
        
        {guide && (
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl font-headline">Guide for {guide.medicationName}</CardTitle>
                 <AddMedicationDialog 
                    onAddMedication={addMedication}
                    initialData={{
                      name: guide.medicationName,
                      dosage: guide.suggestedDosage,
                      frequency: guide.suggestedFrequency
                    }}
                  >
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add to My Schedule
                    </Button>
                  </AddMedicationDialog>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                 <InfoCard icon={Clock} title="Best Time to Take" content={guide.timing} />
                 <InfoCard icon={LifeBuoy} title="Food" content={guide.food} />
                 <InfoCard icon={Clock} title="Duration" content={guide.duration} />
              </div>
               <div className="grid md:grid-cols-2 gap-6">
                <ListCard icon={ThumbsUp} title="Advantages" items={guide.advantages} iconClassName="text-green-600" />
                <ListCard icon={ThumbsDown} title="Disadvantages / Side Effects" items={guide.disadvantages} iconClassName="text-red-600" />
               </div>
               <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800/40 dark:text-yellow-300">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
                  <AlertTitle>Disclaimer</AlertTitle>
                  <AlertDescription>
                    {guide.disclaimer}
                  </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight font-headline">
              My Medication Schedule
            </h2>
            <div className="mt-4">
               {patientData && (
                <MedicationList 
                    medications={patientData.medications} 
                    onUpdateDose={updateDoseStatus} 
                    onDeleteMedication={deleteMedication} 
                  />
               )}
            </div>
        </div>

      </div>
  );
}

const InfoCard = ({ icon: Icon, title, content }: { icon: React.ElementType, title: string, content: string }) => (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
        <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
        <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-muted-foreground">{content}</p>
        </div>
    </div>
);

const ListCard = ({ icon: Icon, title, items, iconClassName }: { icon: React.ElementType, title: string, items: string[], iconClassName?: string }) => (
     <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
        <Icon className={cn("h-6 w-6 flex-shrink-0 mt-1", iconClassName)} />
        <div>
            <h3 className="font-semibold">{title}</h3>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
                {items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
        </div>
    </div>
);

const GuideSkeleton = () => (
  <Card className="mt-6">
    <CardHeader>
       <div className="flex flex-row items-center justify-between">
         <Skeleton className="h-8 w-1/3" />
         <Skeleton className="h-10 w-48" />
       </div>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
      <Skeleton className="h-16 w-full" />
    </CardContent>
  </Card>
);

