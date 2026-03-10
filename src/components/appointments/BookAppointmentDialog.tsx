
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSharedState } from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";

export function BookAppointmentDialog({ children }: { children: React.ReactNode }) {
    const [date, setDate] = useState<Date>();
    const [open, setOpen] = useState(false);
    const { setNextAppointment } = useSharedState();
    const { toast } = useToast();

    const handleSave = () => {
        if (!date) return;

        // Format as YYYY-MM-DD for simplicity as per current 'next' string format 
        // We could add time later, but sticking to existing data structure
        const formattedDate = format(date, "yyyy-MM-dd");

        setNextAppointment(formattedDate);
        setOpen(false);

        toast({
            title: "Appointment Scheduled",
            description: `Your appointment is set for ${formattedDate}.`,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Schedule Appointment</DialogTitle>
                    <DialogDescription>
                        Pick a date for your next visit.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col space-y-2">
                        <Label>Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                    disabled={(date) => date < new Date()}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSave} disabled={!date}>Schedule</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
