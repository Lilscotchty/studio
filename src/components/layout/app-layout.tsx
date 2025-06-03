
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
import { BotIcon, PanelLeft, Settings2, LogOut } from "lucide-react";
import { BottomNavigation } from "./bottom-navigation"; 
import { useIsMobile } from "@/hooks/use-mobile"; 
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";


export function AppLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const { user, loading, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="hidden md:flex md:flex-col"> 
        <Sidebar collapsible="icon" variant="sidebar" side="left" className="h-full">
          <SidebarHeader className="h-16 flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <BotIcon className="h-8 w-8 text-accent" />
              <h1 className="text-xl font-headline font-semibold group-data-[collapsible=icon]:hidden">
                MarketVision <span className="text-primary">Pro</span>
              </h1>
            </div>
            <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
          </SidebarHeader>
          <SidebarContent className="flex-1 p-0">
            <SidebarNav />
          </SidebarContent>
          <SidebarFooter className="p-2 space-y-1">
              {user && !loading && (
                 <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center"
                    onClick={handleLogout}
                  >
                  <LogOut />
                  <span className="group-data-[collapsible=icon]:hidden">Logout</span>
              </Button>
              )}
              <Button variant="ghost" className="w-full justify-start gap-2 group-data-[collapsible=icon]:justify-center">
                  <Settings2 />
                  <span className="group-data-[collapsible=icon]:hidden">Settings</span>
              </Button>
          </SidebarFooter>
        </Sidebar>
      </div>
      
      <SidebarInset className="pb-16 md:pb-0"> 
        {isMobile && (
          <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
            <div className="flex items-center gap-2">
              <BotIcon className="h-7 w-7 text-accent" />
              <h1 className="text-lg font-headline font-semibold">
                MarketVision <span className="text-primary">Pro</span>
              </h1>
            </div>
          </header>
        )}
        <div className="p-3 md:p-4 lg:p-6"> 
          {children}
        </div>
      </SidebarInset>

      <BottomNavigation />
    </SidebarProvider>
  );
}
