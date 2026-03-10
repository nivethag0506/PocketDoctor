
"use client";

import { useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Patient } from "@/lib/types";
import { format, addDays } from 'date-fns';
import { useSharedState } from "../AppLayout";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useMemo } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format" }),
  caretakerId: z.string().optional(),
});

type AddPatientDialogProps = {
  children: React.ReactNode;
  onAddPatient: (patient: Omit<Patient, "id" | "fallback" | "patientCode" | "role" | "medications" | "emergencyContacts" | "medicalHistory" | "avatar" | "caretakerId"> & { caretakerId?: string }) => void;
};

export function AddPatientDialog({ children, onAddPatient }: AddPatientDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, allUsers } = useSharedState();
  const { toast } = useToast();

  const availableCaretakers = useMemo(() => {
    return allUsers.filter(u => u.role === 'caretaker' && !u.patientId);
  }, [allUsers]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      appointmentDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      caretakerId: "none",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (user?.role !== 'doctor') {
        toast({
            title: "Error",
            description: "Only doctors can add new patients.",
            variant: "destructive"
        })
        return;
    }
    
    onAddPatient({ 
        name: values.name, 
        email: values.email,
        doctorId: user.id,
        appointments: {
            next: values.appointmentDate
        },
        caretakerId: values.caretakerId === 'none' ? undefined : values.caretakerId,
    });

    toast({
        title: "Patient Added Successfully",
        description: `${values.name} can now log in using the password '123'.`
    })

    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Enter the patient's details to create a new profile. They will be assigned to you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
             <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>First Appointment Date</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                  control={form.control}
                  name="caretakerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assign Caretaker (Optional)</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an available caretaker" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {availableCaretakers.map(caretaker => (
                                <SelectItem key={caretaker.id} value={caretaker.id}>{caretaker.name}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            <DialogFooter>
              <Button type="submit">Add Patient</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
