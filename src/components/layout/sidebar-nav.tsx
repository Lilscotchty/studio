
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import { BarChart3, BellRing, History, Activity, LogIn, UserPlus, Bell, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  fullLabel?: string; 
  authRequired?: boolean;
  guestOnly?: boolean;
  mobileLocation?: 'header'; // Used for mobile header placement
}

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: BarChart3, fullLabel: "Market Overview" },
  { href: "/alerts", label: "Alerts", icon: BellRing, fullLabel: "Alerts System", authRequired: true },
  { href: "/performance", label: "History", icon: History, fullLabel: "Performance History", authRequired: true },
  { href: "/live-analysis", label: "Live", icon: Activity, fullLabel: "Live Analysis", authRequired: true },
  { href: "/notifications", label: "Notify", icon: Bell, fullLabel: "Notifications", authRequired: true, mobileLocation: 'header' }, 
  { href: "/settings", label: "Settings", icon: Settings, fullLabel: "Settings", authRequired: true, mobileLocation: 'header' }, 
  { href: "/login", label: "Login", icon: LogIn, fullLabel: "Login", guestOnly: true },
  { href: "/signup", label: "Sign Up", icon: UserPlus, fullLabel: "Sign Up", guestOnly: true },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Filter items:
  // 1. Based on auth state
  // 2. Exclude items designated for header placement (Notifications, Settings) from the main sidebar list
  const sidebarSpecificNavItems = navItems.filter(item => {
    if (loading) return false; 
    if (item.authRequired && !user) return false;
    if (item.guestOnly && user) return false;
    // Exclude items that are now shown in the desktop header from this main sidebar navigation list
    if (item.href === "/notifications" || item.href === "/settings") return false;
    return true;
  });

  if (loading && sidebarSpecificNavItems.length === 0) { // Adjust skeleton for fewer items if some are always in header
    return (
      <SidebarMenu>
        {[...Array(4)].map((_, index) => ( 
          <SidebarMenuItem key={index}>
            <div className="flex items-center gap-2 p-2 h-8 w-full">
              <Skeleton className="h-4 w-4 rounded-sm" />
              <Skeleton className="h-4 w-20 rounded-sm group-data-[collapsible=icon]:hidden" />
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {sidebarSpecificNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={{ children: item.fullLabel || item.label, side: "right", align: "center" }}
            >
              <item.icon />
              <span>{item.fullLabel || item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
