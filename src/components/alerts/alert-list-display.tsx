
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AlertConfig } from "@/types";
import { BellOff, Edit3, Trash2, BellRing } from "lucide-react";

interface AlertListDisplayProps {
  alerts: AlertConfig[];
  onToggleAlert: (alertId: string) => void;
  onDeleteAlert: (alertId: string) => void;
  // onEditAlert: (alert: AlertConfig) => void; // Future: for editing
}

export function AlertListDisplay({ alerts, onToggleAlert, onDeleteAlert }: AlertListDisplayProps) {
  if (alerts.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BellOff className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">No Alerts Configured</h3>
            <p className="text-muted-foreground">Use the form above to create your first alert.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Configured Alerts</CardTitle>
        <CardDescription>Manage your existing market alerts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium">{alert.name}</TableCell>
                <TableCell>{alert.asset}</TableCell>
                <TableCell className="capitalize">
                  {alert.conditionType.replace('_', ' ')}
                </TableCell>
                <TableCell>{alert.value}</TableCell>
                <TableCell>
                  <Badge variant={alert.isActive ? "default" : "outline"} className={alert.isActive ? "bg-green-600 hover:bg-green-700" : ""}>
                    {alert.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => onToggleAlert(alert.id)} title={alert.isActive ? "Deactivate" : "Activate"}>
                    {alert.isActive ? <BellOff className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
                  </Button>
                  {/* <Button variant="ghost" size="icon" onClick={() => onEditAlert(alert)} title="Edit">
                    <Edit3 className="h-4 w-4" />
                  </Button> */}
                  <Button variant="ghost" size="icon" onClick={() => onDeleteAlert(alert.id)} title="Delete" className="text-destructive hover:text-destructive/80">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
