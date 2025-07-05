import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconUsers,
  IconLayersSubtract,
} from "@tabler/icons-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./NavMain";
// import { NavSecondary } from "./NavSecondary";
import { NavUser } from "./NavUser";
import { useAuthStore } from "@/store/authStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";
import { useEffect, useState } from "react";
import { useCompanyContext } from "@/store/companyContextStore";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: IconLayersSubtract,
    },
    {
      title: "Clients",
      url: "/clients",
      icon: IconListDetails,
    },
    {
      title: "Consignee",
      url: "/consignees",
      icon: IconChartBar,
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: IconSettings,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: IconSearch,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { selectedCompanyId, setSelectedCompanyId } = useCompanyContext();
  const user = useAuthStore((state) => state.user);
  const { companies } = useCompanies();

  useEffect(() => {
    if (!selectedCompanyId && user?.company?._id) {
      setSelectedCompanyId(user.company._id);
    }
  }, [user, selectedCompanyId, setSelectedCompanyId]);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          {user?.role === "admin" ? (
            <SidebarMenuItem>
              <Select
                value={selectedCompanyId ?? ""}
                onValueChange={(value) => setSelectedCompanyId(value)}
              >
                <SelectTrigger id="company-select" className="w-full">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company._id} value={company._id}>
                      {company.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">
                  {user?.company?.companyName ?? "Paras Invoice"}
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
