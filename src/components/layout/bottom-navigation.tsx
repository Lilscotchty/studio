
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems, type NavItem } from "./sidebar-nav"; // Import shared nav items and type
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "../ui/skeleton";

export function BottomNavigation() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Filter navItems based on auth state for bottom navigation
  // Prioritize core features for logged-in users if space is an issue.
  // For now, apply same logic as sidebar.
  const displayedNavItems = navItems.filter(item => {
    if (loading) return false; 
    if (item.authRequired && !user) return false;
    if (item.guestOnly && user) return false;
    return true;
  }).slice(0, 4); // Max 4 items for bottom nav simplicity


  if (loading) {
     return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-card shadow-sm md:hidden">
        <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="group inline-flex flex-col items-center justify-center px-3 pt-2 pb-1 text-center">
              <Skeleton className="mb-1 h-5 w-5 rounded-sm" />
              <Skeleton className="h-3 w-10 rounded-sm" />
            </div>
          ))}
        </div>
      </nav>
    );
  }


  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-card shadow-sm md:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
        {displayedNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group inline-flex flex-col items-center justify-center px-3 pt-2 pb-1 text-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "mb-1 h-5 w-5 group-hover:text-sidebar-accent-foreground",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
