"use client";

import {  LogOut,  ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import LogoutButton from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import { useAuth } from "@/hooks/auth";

export function SiteHeader({ pageTitle }: { pageTitle: string }) {
  const { user } = useAuth();

  // Only show loading state if we don't have user data yet
  const showLoading = !user;
  return (
    <header className="flex h-16 shrink-0 items-center border-b bg-white px-4">
      <div className="flex w-full items-center">
        <SidebarTrigger className="-ml-2 mr-2" />
        <Separator orientation="vertical" className="h-6 mx-2" />
        <h1 className="text-base font-medium">{pageTitle}</h1>

        <div className="ml-auto flex items-center gap-2">
          {/* <Button variant="ghost" size="icon" className="h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 h-8 px-2"
              >
                {showLoading ? (
                  <Loader variant="pulse" className="h-6 w-6" />
                ) : (
                  <Avatar className="h-6 w-6">
                    {user?.avatarUrl ? (
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={user?.firstName || "User"}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.firstName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                )}
                <ChevronDown className="h-3 w-3 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {showLoading ? (
                <div className="flex justify-center py-4">
                  <Loader variant="pulse" />
                </div>
              ) : (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user ? user.name : "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/profile"
                        className="flex cursor-pointer items-center"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/settings"
                        className="flex cursor-pointer items-center"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator /> */}
                  <LogoutButton
                    variant="ghost"
                    className="w-full justify-start px-2 py-1.5 h-auto text-sm"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </LogoutButton>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
