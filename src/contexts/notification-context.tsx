
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { AppNotification, NotificationType } from '@/types';
import { useToast } from '@/hooks/use-toast';

const IS_BROWSER = typeof window !== 'undefined';
const NOTIFICATIONS_STORAGE_KEY = 'finSightAppNotifications';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notificationData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const sampleSiteNotifications: Omit<AppNotification, 'id' | 'timestamp' | 'read'>[] = [
  {
    title: "Welcome to FinSight AI!",
    message: "Explore our AI-powered chart analysis and market insights. Let us know if you have any feedback.",
    type: "info",
    iconName: "Sparkles",
  },
  {
    title: "System Update Scheduled",
    message: "We'll be performing scheduled maintenance on Sunday at 2 AM UTC. Services may be briefly unavailable.",
    type: "system_update",
    iconName: "ServerCog",
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!IS_BROWSER) return;
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    let initialNotifications: AppNotification[] = [];
    if (storedNotifications) {
      try {
        initialNotifications = JSON.parse(storedNotifications);
      } catch (e) {
        console.error("Failed to parse stored notifications:", e);
      }
    }

    // Add sample notifications only if storage is empty (first time user or cleared storage)
    if (initialNotifications.length === 0) {
      const samplesWithDefaults: AppNotification[] = sampleSiteNotifications.map(n => ({
        ...n,
        id: generateId(),
        timestamp: new Date().toISOString(),
        read: false,
      }));
      initialNotifications = samplesWithDefaults;
    }
    setNotifications(initialNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }, []);

  useEffect(() => {
    if (IS_BROWSER) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = useCallback((notificationData: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notificationData,
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    
    // Show a toast for new notifications, especially alert triggers
    if (notificationData.type === 'alert_trigger') {
        toast({
            title: `🔔 ${notificationData.title}`,
            description: notificationData.message.substring(0, 100) + (notificationData.message.length > 100 ? "..." : ""),
            duration: 5000,
        });
    } else if (notificationData.type !== 'info') { // Don't toast for initial welcome 'info'
         toast({
            title: `ℹ️ ${notificationData.title}`,
            description: notificationData.message.substring(0, 100) + (notificationData.message.length > 100 ? "..." : ""),
            duration: 5000,
        });
    }
  }, [toast]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCenter() { // Renamed hook to avoid conflict
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationCenter must be used within a NotificationProvider');
  }
  return context;
}
