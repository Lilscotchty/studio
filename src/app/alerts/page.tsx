
"use client";

import React, { useState, useEffect } from "react";
import { AlertConfigForm } from "@/components/alerts/alert-config-form";
import { AlertListDisplay } from "@/components/alerts/alert-list-display";
import type { AlertConfig } from "@/types";
import { useToast } from "@/hooks/use-toast";

const IS_BROWSER = typeof window !== 'undefined';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertConfig[]>(() => {
    if (!IS_BROWSER) return [];
    const savedAlerts = localStorage.getItem("marketVisionAlerts");
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });
  const { toast } = useToast();

  useEffect(() => {
    if (IS_BROWSER) {
      localStorage.setItem("marketVisionAlerts", JSON.stringify(alerts));
    }
  }, [alerts]);

  const handleAddAlert = (newAlert: AlertConfig) => {
    setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
  };

  const handleToggleAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setAlerts((prevAlerts) =>
        prevAlerts.map((a) =>
          a.id === alertId ? { ...a, isActive: !a.isActive } : a
        )
      );
      toast({
        title: `Alert "${alert.name}" ${!alert.isActive ? "Activated" : "Deactivated"}`,
        description: `This alert will ${!alert.isActive ? "now send" : "no longer send"} notifications.`,
      });
    }
  };

  const handleDeleteAlert = (alertId: string) => {
    const alertToDelete = alerts.find(a => a.id === alertId);
    if (alertToDelete) {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== alertId));
      toast({
        title: "Alert Deleted",
        description: `The alert "${alertToDelete.name}" has been successfully removed.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl font-headline font-bold tracking-tight sm:text-5xl">
          Alert <span className="text-accent">System</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Stay informed about market changes and prediction updates with customizable alerts.
        </p>
      </header>

      <section>
        <AlertConfigForm onAddAlert={handleAddAlert} />
      </section>

      <section>
        <AlertListDisplay
          alerts={alerts}
          onToggleAlert={handleToggleAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      </section>
    </div>
  );
}
