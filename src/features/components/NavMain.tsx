import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink, useMatch, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItemProps {
  item: {
    title: string;
    url: string;
    icon?: Icon;
    matchPattern?: string;
  };
}

const NavItem = ({ item }: NavItemProps) => {
  const navigate = useNavigate();
  const matchPattern = item.matchPattern || item.url;
  const isActive = useMatch({
    path: matchPattern,
    end: !matchPattern.includes("*"),
  });

  const handleClick = (e: React.MouseEvent) => {
    if (isActive) {
      e.preventDefault();
      navigate(item.url, { replace: true });
    }
  };

  return (
    <NavLink
      to={item.url}
      onClick={handleClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "text-muted-foreground hover:bg-muted"
      )}
    >
      {item.icon && <item.icon />}
      <span>{item.title}</span>
    </NavLink>
  );
};

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    matchPattern?: string;
  }[];
}) {
  const navigate = useNavigate();
  const isCreateInvoiceActive = useMatch("/invoice/new");

  const handleCreateInvoiceClick = (e: React.MouseEvent) => {
    if (isCreateInvoiceActive) {
      e.preventDefault();
      navigate("/invoice/new", { replace: true });
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <NavLink
              to="/invoice/new"
              onClick={handleCreateInvoiceClick}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isCreateInvoiceActive
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <IconCirclePlusFilled />
              <span>Create Invoice</span>
            </NavLink>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavItem item={item} />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
