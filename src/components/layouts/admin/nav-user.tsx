"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Loader } from "@/components/ui/loader";
import LogoutButton from "@/components/auth/logout-button";
import { useAuth } from "@/hooks/auth";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user } = useAuth();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {!user ? (
                <Loader variant="pulse" className="h-8 w-8" />
              ) : (
                <>
                  <Avatar className="h-8 w-8 rounded-lg grayscale">
                    {user?.avatarUrl ? (
                      <AvatarImage
                        src={user.avatarUrl}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {user?.firstName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {user ? `${user.firstName} ${user.lastName}` : "User"}
                    </span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                </>
              )}
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                {!user ? (
                  <Loader variant="pulse" className="h-8 w-8" />
                ) : (
                  <>
                    <Avatar className="h-8 w-8 rounded-lg">
                      {user?.avatarUrl ? (
                        <AvatarImage
                          src={user.avatarUrl}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                      ) : (
                        <AvatarFallback className="rounded-lg">
                          {user?.firstName?.charAt(0) ||
                            user?.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {user ? `${user.firstName} ${user.lastName}` : "User"}
                      </span>
                      <span className="text-muted-foreground truncate text-xs">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard/profile"
                  className="flex w-full items-center"
                >
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard/billing"
                  className="flex w-full items-center"
                >
                  <IconCreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/admin/dashboard/notifications"
                  className="flex w-full items-center"
                >
                  <IconNotification className="mr-2 h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <LogoutButton
              variant="ghost"
              className="w-full justify-start px-2 py-1.5 h-auto text-sm"
            >
              <IconLogout className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </LogoutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
