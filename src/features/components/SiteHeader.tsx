import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./ModeToggle";
import { useAuthStore } from "@/store/authStore";
import { useLocation } from "react-router-dom";

export function SiteHeader() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const pathTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/invoice/new": "Create Invoice",
    "/invoices": "Invoices",
    "/clients": "Clients",
    "/consignees": "Consignees",
    "/users": "User Management",
  };

  const currentTitle = pathTitles[location.pathname] || "Dashboard";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {user?.role === "admin" ? `Admin ${currentTitle}` : currentTitle}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
