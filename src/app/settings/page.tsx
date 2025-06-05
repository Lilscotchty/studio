
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl flex items-center justify-center">
          <Settings className="mr-3 h-10 w-10 text-accent"/>
          Settings
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Manage your account preferences, application settings, and more.
        </p>
      </header>
      <main className="text-center">
        <p className="text-muted-foreground">Application settings and user preferences will be managed here.</p>
        {/* Placeholder for settings form or options */}
      </main>
    </div>
  );
}
