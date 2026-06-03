import { Link, useRouterState } from "@tanstack/react-router";
import {
  ShoppingCart,
  FileText,
  Briefcase,
  Users,
  UserCheck,
  LogIn,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import logoMark from "@/assets/logos/logo-mark-soleil.svg";

const salesItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Commandes clients", url: "/commandes", icon: ShoppingCart },
  { title: "Fiches de poste", url: "/fiches-poste", icon: FileText },
];

const rhItems = [
  { title: "Recrutements", url: "/recrutements", icon: Briefcase },
  { title: "Pipeline talents", url: "/pipeline", icon: Users },
  { title: "Collaborateurs", url: "/collaborateurs", icon: UserCheck },
  { title: "Suivi entrées", url: "/entrees", icon: LogIn },
  { title: "Suivi sorties", url: "/sorties", icon: LogOut },
];

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });
  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-2 py-3">
          <img src={logoMark} alt="Mon Ambassadeur" className="h-8 w-8 shrink-0" />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-sidebar-foreground">
              Mon Ambassadeur
            </span>
            <span className="text-xs text-sidebar-foreground/60">SIRH</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {salesItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>RH</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {rhItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          v0.1 · Démo équipe
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
