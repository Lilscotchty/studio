
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BellRing, History, Activity } from "lucide-react"; // Changed UploadCloud to Activity for live analysis

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/alerts", label: "Alerts", icon: BellRing },
  { href: "/performance", label: "Performance", icon: History },
  { href: "/live-analysis", label: "Live Analysis", icon: Activity }, // New navigation item
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
              tooltip={{ children: item.label, side: "right", align: "center" }}
            >
              <item.icon />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
