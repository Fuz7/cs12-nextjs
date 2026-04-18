"use client";

import * as React from "react";
import {
  Users,
  Magnet,
  BarChart3,
  Briefcase,
  TrendingUpDown,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import Link from "next/link";
import websiteIcon from "@/resources/images/websiteIcon.svg";

interface NavItemBase {
  title: string;
  url: string;
}

interface NavItem extends NavItemBase {
  icon: React.ComponentType<{ className?: string }>;
}

interface SubItem {
  title: string;
  url: string;
}

interface ProductItem extends NavItem {
  isExpandable?: boolean;
  subItems?: SubItem[];
}

interface NavigationData {
  workspace: {
    name: string;
    type: string;
  };
  dashboard: NavItem;
  mainNav: NavItem[];
}

const navigationData: NavigationData = {
  workspace: {
    name: "ARAbian",
    type: "workspace",
  },
  dashboard: {
    title: "Performance Center",
    url: "/admin/dashboard",
    icon: BarChart3,
  },

  mainNav: [
    {
      title: "Customers",
      url: "/admin/dashboard/customers",
      icon: Users,
    },
    {
      title: "Leads",
      url: "/admin/dashboard/leads",
      icon: Magnet,
    },
    {
      title: "Estimate",
      url: "/admin/dashboard/estimates",
      icon: TrendingUpDown,
    },
    {
      title: "Jobs",
      url: "/admin/dashboard/jobs",
      icon: Briefcase,
    },
    {
      title: "Invoices",
      url: "/admin/dashboard/invoices",
      icon: Wallet,
    },
  ],
};

// Navigation Item Component
function NavItem({
  item,
  isActive = false,
  isSubItem = false,
  className = "",
}: {
  item: NavItem | SubItem;
  isActive?: boolean;
  isSubItem?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={item.url}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-gray-100 text-gray-900"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        isSubItem ? "pl-9" : "",
        className,
      )}
    >
      {!isSubItem && "icon" in item && item.icon && (
        <item.icon className="h-4 w-4" />
      )}
      <span>{item.title}</span>
    </Link>
  );
}

interface SubItem {
  title: string;
  url: string;
}

// Collapsible Section Component

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="border-r border-gray-200"
      style={
        {
          "--sidebar-width": "240px",
          "--header-height": "60px",
        } as React.CSSProperties
      }
      {...props}
    >
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-white border border-gray-100 shadow-sm overflow-hidden">
            <Image
              src={websiteIcon}
              alt="Arabian"
              width={24}
              height={24}
              className="h-6 w-6"
              priority
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-gray-900">
              {navigationData.workspace.name}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        {/* Main Navigation */}
        <div className="space-y-1 mt-4">
          <NavItem className="mt-3" item={navigationData.dashboard} isActive />
          <div className="flex flex-col gap-2 mt-10">
            {navigationData.mainNav.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </div>
        </div>
      </SidebarContent>
      <SidebarRail />
      {/* <SidebarFooter>
        <NavUser />
      </SidebarFooter> */}
    </Sidebar>
  );
}
