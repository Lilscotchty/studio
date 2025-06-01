
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, BellRing, History, UploadCloud } from "lucide-react"; // Added UploadCloud for consistency if needed

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/alerts", label: "Alerts", icon: BellRing },
  { href: "/performance", label: "Performance", icon: History },
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
