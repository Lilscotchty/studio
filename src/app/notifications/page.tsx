
"use client";

import React from "react";
import { useNotificationCenter } from "@/contexts/notification-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, ServerCog, BellRing, FileText } from "lucide-react";
import type { AppNotification, NotificationType } from "@/types";
import { cn } from "@/lib/utils";

const NotificationIcon = ({ type, iconName }: { type: NotificationType, iconName?: string }) => {
  if (iconName) {
    const IconComponent = {
        BellRing, Info, AlertTriangle, ServerCog, Sparkles: FileText, // Using FileText for Sparkles as an example
        // Add other mappings from iconName to Lucide components here
    }[iconName as keyof typeof import('lucide-react')]; // Type assertion
    if (IconComponent) return <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />;
  }

  switch (type) {
    case 'alert_trigger':
      return <BellRing className="h-5 w-5 mr-3 text-accent flex-shrink-0" />;
    case 'site_message':
      return <Info className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />;
    case 'system_update':
      return <ServerCog className="h-5 w-5 mr-3 text-orange-500 flex-shrink-0" />;
    case 'info':
      return <Info className="h-5 w-5 mr-3 text-sky-500 flex-shrink-0" />;
    default:
      return <Bell className="h-5 w-5 mr-3 text-muted-foreground flex-shrink-0" />;
  }
};


export default function NotificationsPage() {
  const { 
    notifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAllNotifications,
    unreadCount 
  } = useNotificationCenter();

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
      
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-xl">Your Notifications</CardTitle>
            <CardDescription>
              {notifications.length > 0 
                ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}.`
                : "No notifications yet."}
            </CardDescription>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <CheckCheck className="mr-2 h-4 w-4" /> Mark All Read
              </Button>
              <Button variant="destructive" size="sm" onClick={clearAllNotifications}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear All
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">You have no notifications at the moment.</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 rounded-lg border flex items-start space-x-3 transition-colors",
                      notification.read ? "bg-card hover:bg-muted/50" : "bg-primary/5 hover:bg-primary/10 border-primary/30"
                    )}
                  >
                    <NotificationIcon type={notification.type} iconName={notification.iconName} />
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h3 className={cn(
                          "font-semibold text-sm",
                          !notification.read && "text-foreground"
                        )}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(parseISO(notification.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className={cn(
                        "text-xs mt-1",
                        notification.read ? "text-muted-foreground" : "text-foreground/80"
                      )}>
                        {notification.message}
                      </p>
                       {notification.relatedLink && (
                        <a 
                            href={notification.relatedLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-accent hover:underline mt-1 inline-block"
                        >
                            View Details
                        </a>
                       )}
                       <div className="mt-3 flex gap-2">
                        {!notification.read && (
                           <Button variant="ghost" size="xs" onClick={() => markAsRead(notification.id)} className="text-xs h-auto py-0.5 px-1.5">
                            Mark as Read
                          </Button>
                        )}
                         <Button variant="ghost" size="xs" onClick={() => deleteNotification(notification.id)} className="text-xs h-auto py-0.5 px-1.5 text-destructive hover:text-destructive hover:bg-destructive/10">
                            Delete
                          </Button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
