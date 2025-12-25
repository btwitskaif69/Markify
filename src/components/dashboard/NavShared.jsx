import { Link, useLocation } from "react-router-dom";
import { Globe } from "lucide-react";
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export function NavShared() {
    const location = useLocation();
    const { user } = useAuth();

    if (!user) return null;

    const isActive = location.pathname === `/dashboard/${user.id}/shared`;

    return (
        <SidebarGroup>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link to={`/dashboard/${user.id}/shared`}>
                        <SidebarMenuButton
                            tooltip="Shared"
                            isActive={isActive}
                            className="data-[active=true]:bg-primary data-[active=true]:text-white mb-2"
                        >
                            <Globe className="h-4 w-4" />
                            <span>Shared</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
