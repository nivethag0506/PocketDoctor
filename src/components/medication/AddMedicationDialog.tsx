
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Medication } from "@/lib/types";
import { add, format, formatISO } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  dosage: z.string().min(1, { message: "Dosage is required." }),
  frequency: z.string().min(1, { message: "Frequency is required." }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  interval: z.coerce.number().min(1, { message: "Interval must be at least 1 hour." }),
}).refine(data => {
    if (!data.startTime || !data.endTime) return true;
    return data.startTime <= data.endTime;
}, {
  message: "End time must be after or same as start time.",
  path: ["endTime"],
});

type AddMedicationDialogProps = {
  children: React.ReactNode;
  onAddMedication: (medication: Omit<Medication, "id" | "doses">) => void;
  initialData?: {
    name: string;
    dosage: string;
    frequency: string;
  }
};

export function AddMedicationDialog({ children, onAddMedication, initialData }: AddMedicationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      dosage: initialData?.dosage || "",
      frequency: initialData?.frequency || "",
      startDate: format(new Date(), 'yyyy-MM-dd'),
      startTime: "08:00",
      endTime: "20:00",
      interval: 12,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        dosage: initialData.dosage,
        frequency: initialData.frequency,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        startTime: "08:00",
        endTime: "20:00",
        interval: 12,
      });
    }
     if (!isOpen) {
      form.reset({
        name: initialData?.name || "",
        dosage: initialData?.dosage || "",
        frequency: initialData?.frequency || "",
        startDate: format(new Date(), 'yyyy-MM-dd'),
        startTime: "08:00",
        endTime: "20:00",
        interval: 12,
      });
    }
  }, [initialData, form, isOpen]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const { startTime, endTime, interval } = values;
    
    const timings: string[] = [];
    const today = new Date();
    const [startHour, startMinute] = startTime.split(':').map(Number);
    let currentTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);

    const [endHour, endMinute] = endTime.split(':').map(Number);
    const finalTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);

    if (currentTime <= finalTime) {
      while (currentTime <= finalTime) {
          timings.push(format(currentTime, 'HH:mm'));
          if (interval <= 0) break; 
          currentTime = add(currentTime, { hours: interval });
      }
    }

    onAddMedication({ 
        name: values.name, 
        dosage: values.dosage,
        frequency: values.frequency,
        startDate: new Date(values.startDate).toISOString(),
        timings: timings.length > 0 ? timings : [startTime]
    });
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
          <DialogDescription>
            Confirm or edit the details for your new medication below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
             <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Paracetamol" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dosage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             </div>
             <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Twice a day" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="space-y-2">
                <FormLabel>Daily Schedule</FormLabel>
                <FormDescription>
                    Set the start time, end time, and interval for your doses.
                </FormDescription>
                <div className="grid grid-cols-2 gap-4 pt-2">
                     <FormField
                        control={form.control}
                        name="startTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs">Start Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="endTime"
                        render={({ field }) => (
                            <FormItem>
                                 <FormLabel className="text-xs">End Time</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                </div>
            </div>
             <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Interval between doses (in hours)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 8" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />

            <DialogFooter>
              <Button type="submit">Save Medication</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
