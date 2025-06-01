
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BarChart3, BellRing, History, Activity } from "lucide-react"; // Changed LayoutDashboard to BarChart3

const navItems = [
  { href: "/", label: "Market Overview", icon: BarChart3 }, // Changed label and icon
  { href: "/alerts", label: "Alerts", icon: BellRing },
  { href: "/performance", label: "Performance", icon: History },
  { href: "/live-analysis", label: "Live Analysis", icon: Activity },
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
