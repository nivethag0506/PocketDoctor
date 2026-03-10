

"use client";

import { useState } from "react";
import type { EmergencyContact } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Phone, User, LoaderCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSharedState } from "../AppLayout";


export function EmergencyContacts() {
    const { patientData, addContact, removeContact } = useSharedState();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [contactName, setContactName] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const { toast } = useToast();

    if (!patientData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>
                        These contacts can be used to share your adherence reports.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-10">
                        <LoaderCircle className="mx-auto h-12 w-12 animate-spin" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    const contacts = patientData.emergencyContacts;

    const handleAddContact = () => {
        if (!contactName.trim() || !contactPhone.trim()) {
            toast({
                title: "Missing Information",
                description: "Please enter both name and phone number.",
                variant: "destructive"
            });
            return;
        }

        const nameParts = contactName.trim().split(' ');
        const initials = (nameParts[0]?.[0] || '') + (nameParts[1]?.[0] || '');

        const newContact: EmergencyContact = {
            id: `contact-${Date.now()}`,
            name: contactName.trim(),
            phone: contactPhone.trim(),
            initials: initials.toUpperCase() || contactName[0]?.toUpperCase() || 'EC'
        };

        addContact(newContact);
        toast({
            title: "Contact Added",
            description: `${newContact.name} has been added to your emergency contacts.`,
        });
        setContactName('');
        setContactPhone('');
        setIsDialogOpen(false);
    }

    const handleRemoveContact = (contactId: string) => {
        removeContact(contactId);
        toast({
            title: "Contact Removed",
            description: `The contact has been removed from your emergency contacts.`,
            variant: "destructive"
        })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>
                        These contacts can be used to share your adherence reports.
                    </CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Contact
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Emergency Contact</DialogTitle>
                            <DialogDescription>
                                Enter the contact details manually.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact-name">Name</Label>
                                <Input
                                    id="contact-name"
                                    placeholder="e.g., Mom, Dr. Smith"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact-phone">Phone Number</Label>
                                <Input
                                    id="contact-phone"
                                    type="tel"
                                    placeholder="e.g., 9876543210"
                                    value={contactPhone}
                                    onChange={(e) => setContactPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleAddContact}>Add Contact</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {contacts.length > 0 ? (
                    <div className="space-y-4">
                        {contacts.map(contact => (
                            <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback className="bg-primary text-primary-foreground">{contact.initials}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{contact.name}</p>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Phone className="w-3 h-3" />
                                            {contact.phone}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => handleRemoveContact(contact.id)}>Remove</Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-10">
                        <User className="mx-auto h-12 w-12" />
                        <p className="mt-4">No emergency contacts added yet.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


