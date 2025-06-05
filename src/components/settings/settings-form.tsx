
"use client";

import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { User, Moon, Sun, Bell, ShieldAlert, Trash2, LogOut } from 'lucide-react'; // Added LogOut

export function SettingsForm() {
  const { user, loading: authLoading, logout } = useAuth(); // Added logout
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handlePasswordChange = () => {
    toast({
      title: 'Password Change',
      description: "For password changes, please use the 'Forgot Password' option on the login page or manage via your Firebase console. Direct in-app password change is not yet implemented.",
      duration: 7000,
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      // Router will redirect via AuthContext
    } catch (error) {
      toast({
        title: 'Logout Failed',
        description: 'Could not log you out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAccount = () => {
    toast({
      title: 'Account Deletion Requested',
      description: 'This is a mock action. In a real application, this would initiate the account deletion process.',
      variant: 'destructive',
      duration: 7000,
    });
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Loading Settings...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-20 animate-pulse bg-muted rounded-md"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Profile Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <User className="text-primary" /> Profile Management
          </CardTitle>
          <CardDescription>Manage your account details and session.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <p id="email" className="text-sm text-muted-foreground mt-1">
              {user ? user.email : 'Not logged in'}
            </p>
          </div>
          <Separator />
          <div>
            <Label>Password</Label>
            <Button variant="outline" onClick={handlePasswordChange} className="mt-2 w-full sm:w-auto">
              Change Password
            </Button>
          </div>
          <Separator />
          <div>
            <Label>Session</Label>
            <Button variant="outline" onClick={handleLogout} className="mt-2 w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
             <p className="text-xs text-muted-foreground mt-1">
              End your current session.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferences Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            {theme === 'dark' ? <Moon className="text-primary" /> : <Sun className="text-primary" />}
            Appearance Preferences
          </CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 py-2">
            <Label htmlFor="theme-toggle" className="flex flex-col space-y-1">
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Switch between light and dark themes.
              </span>
            </Label>
            <Switch
              id="theme-toggle"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              aria-label="Toggle theme"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences Section (Mock) */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Bell className="text-primary" /> Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you receive notifications (mock settings).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 py-2">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
               <span className="font-normal leading-snug text-muted-foreground">
                Receive updates via email for critical alerts.
              </span>
            </Label>
            <Switch id="email-notifications" defaultChecked disabled />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2 py-2">
            <Label htmlFor="in-app-notifications" className="flex flex-col space-y-1">
              <span>In-App Push Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get real-time push notifications within the app.
              </span>
            </Label>
            <Switch id="in-app-notifications" defaultChecked disabled />
          </div>
           <div className="mt-4 p-3 bg-muted/50 border border-dashed border-border rounded-md text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <ShieldAlert className="h-4 w-4" /> More notification settings coming soon!
              </p>
            </div>
        </CardContent>
      </Card>

      {/* Danger Zone Section */}
      <Card className="shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2 text-destructive">
            <ShieldAlert className="text-destructive" /> Danger Zone
          </CardTitle>
          <CardDescription>Manage critical account actions.</CardDescription>
        </CardHeader>
        <CardContent>
           <div>
            <Label className="text-destructive font-semibold">Delete Account</Label>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-2 w-full sm:w-auto">
                  <Trash2 className="mr-2 h-4 w-4" /> Permanently Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-xs text-muted-foreground mt-1">
              Permanently remove your account and all associated data. This action is irreversible.
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
