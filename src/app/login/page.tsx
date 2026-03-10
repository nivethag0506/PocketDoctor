
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, LogIn, UserPlus } from 'lucide-react';
import type { UserRole, AppUser } from '@/lib/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast";

type LoginPageProps = {
  allUsers?: AppUser[];
  onLogin: (userId: string) => void;
};

export default function LoginPage({ allUsers = [], onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSpecialization, setRegSpecialization] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('doctor');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user.');
      return;
    }
    if (password !== '123') {
      setError('Incorrect password. Hint: it is 123.');
      return;
    }
    setError('');
    onLogin(selectedUserId);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName,
          email: regEmail,
          specialization: regSpecialization,
          role: regRole
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast({
        title: "Registration Successful",
        description: "You can now log in with your new account.",
      });

      // Force a page reload to refresh the user list from the server
      window.location.reload();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const usersForRole = useMemo(() => {
    return allUsers.filter(u => u.role === selectedRole);
  }, [allUsers, selectedRole]);

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setSelectedUserId('');
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Pill className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold font-headline">Pocket Doctor</h1>
          </div>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Manage your health journey.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Registration</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Sign in as</Label>
                  <Select value={selectedRole} onValueChange={(value: UserRole) => handleRoleChange(value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="patient">Patient</SelectItem>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="caretaker">Caretaker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user">User</Label>
                  <Select value={selectedUserId} onValueChange={setSelectedUserId} disabled={!selectedRole || usersForRole.length === 0}>
                    <SelectTrigger id="user">
                      <SelectValue placeholder={usersForRole.length === 0 ? "No users found" : "Select a user"} />
                    </SelectTrigger>
                    <SelectContent>
                      {usersForRole.map(user => (
                        <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {usersForRole.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">No users found. Register a new account to get started.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <Button type="submit" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </form>
              <div className="text-center text-xs text-muted-foreground mt-4">
                <p>Password is `123` for all users.</p>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-role">I am a...</Label>
                  <Select value={regRole} onValueChange={(val: UserRole) => setRegRole(val)}>
                    <SelectTrigger id="reg-role">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="doctor">Doctor</SelectItem>
                      <SelectItem value="caretaker">Caretaker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-name">Full Name</Label>
                  <Input id="reg-name" placeholder="John Doe" value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" type="email" placeholder="john@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
                {regRole === 'doctor' && (
                  <div className="space-y-2">
                    <Label htmlFor="reg-spec">Specialization</Label>
                    <Input id="reg-spec" placeholder="Cardiology, General Practice..." value={regSpecialization} onChange={e => setRegSpecialization(e.target.value)} required />
                  </div>
                )}
                {error && <p className="text-sm text-destructive text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? "Creating Account..." : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
