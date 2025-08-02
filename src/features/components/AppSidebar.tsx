import {
  IconChartBar,
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompanies } from "@/hooks/useCompanies";
import { useEffect } from "react";
import { useCompanyContext } from "@/store/companyContextStore";

// Update the navMain data to include route patterns for active matching
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Invoice Dashboard",
      url: "/invoices/dashboard",
      icon: IconDashboard,
      matchPattern: "/invoices/dashboard/*", // Fixed pattern
    },
    {
      title: "Clients",
      url: "/clients",
      icon: IconListDetails,
      matchPattern: "/clients/*", // Fixed pattern
    },
    {
      title: "Consignee",
      url: "/consignees",
      icon: IconChartBar,
      matchPattern: "/consignees/*", // Fixed pattern
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

  const companyObj =
    typeof user?.company === "string"
      ? companies.find((c) => c._id === user.company)
      : user?.company;

  useEffect(() => {
    if (!selectedCompanyId && companyObj?._id) {
      setSelectedCompanyId(companyObj._id);
    }
  }, [companyObj, selectedCompanyId, setSelectedCompanyId]);

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
                  {companyObj?.companyName ?? "Paras Invoice"}
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
