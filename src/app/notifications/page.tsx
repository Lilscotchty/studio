
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl flex items-center justify-center">
          <Bell className="mr-3 h-10 w-10 text-accent"/>
          Notification <span className="text-accent">Center</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          View your recent notifications and manage your notification preferences here.
        </p>
      </header>
      <main className="text-center">
        <p className="text-muted-foreground">Notification content will be displayed here.</p>
        {/* Placeholder for notification list or settings */}
      </main>
    </div>
  );
}
