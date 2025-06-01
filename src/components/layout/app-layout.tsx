
"use client";

import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Button } from "@/components/ui/button";
import { BotIcon, PanelLeft, Settings2 } from "lucide-react";
import { BottomNavigation } from "./bottom-navigation"; // Import new component
import { useIsMobile } from "@/hooks/use-mobile"; // To control sidebar trigger visibility

export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider defaultOpen>
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex md:flex-col"> {/* Wrapper to ensure flex context for sidebar */}
        <Sidebar collapsible="icon" variant="sidebar" side="left" className="h-full">
          <SidebarHeader className="h-16 flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <BotIcon className="h-8 w-8 text-accent" />
              <h1 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">
                MarketVision
              </h1>
            </div>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </SidebarHeader>
          <SidebarContent className="flex-1 p-0">
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-2">
              <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center">
                  <Settings2 />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Button>
          </SidebarFooter>
        </Sidebar>
      </div>
      
      {/* Main content area */}
      <SidebarInset className="pb-16 md:pb-0"> {/* Add padding-bottom for mobile to not overlap with BottomNavigation */}
        {/* Optional: Mobile Header with Hamburger for a drawer if preferred later */}
        {isMobile && (
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
             {/* For mobile, SidebarTrigger could be used here if we implement a drawer menu */}
             {/* <SidebarTrigger asChild className="md:hidden">
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SidebarTrigger> */}
            <div className="flex items-center gap-2">
              <BotIcon className="h-7 w-7 text-accent" />
              <h1 className="text-lg font-headline font-semibold">
                MarketVision
              </h1>
            </div>
          </header>
        )}
        <div className="p-0 md:p-4 lg:p-6"> {/* Removed redundant padding, rely on page level padding */}
          {children}
        </div>
      </SidebarInset>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </SidebarProvider>
  );
}
