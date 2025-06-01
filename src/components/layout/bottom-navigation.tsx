
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./sidebar-nav"; // Import shared nav items
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-card shadow-sm md:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-4 font-medium">
        {navItems.map((item) => {
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
