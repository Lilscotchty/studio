
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import { BarChart3, BellRing, History, Activity } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  fullLabel?: string; // For desktop tooltips
}

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: BarChart3, fullLabel: "Market Overview" },
  { href: "/alerts", label: "Alerts", icon: BellRing, fullLabel: "Alerts" },
  { href: "/performance", label: "History", icon: History, fullLabel: "Performance" },
  { href: "/live-analysis", label: "Live", icon: Activity, fullLabel: "Live Analysis" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
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
