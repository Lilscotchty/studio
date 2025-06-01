
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
}

export const navItems: NavItem[] = [
  { href: "/", label: "Overview", icon: BarChart3 }, // Shortened label for mobile
  { href: "/alerts", label: "Alerts", icon: BellRing },
  { href: "/performance", label: "History", icon: History }, // Shortened label
  { href: "/live-analysis", label: "Live", icon: Activity }, // Shortened label
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
              tooltip={{ children: item.label === "Overview" ? "Market Overview" : item.label === "History" ? "Performance" : item.label === "Live" ? "Live Analysis" : item.label, side: "right", align: "center" }}
            >
              <item.icon />
              {/* Display full labels for sidebar, which has more space */}
              <span>{item.label === "Overview" ? "Market Overview" : item.label === "History" ? "Performance" : item.label === "Live" ? "Live Analysis" : item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
