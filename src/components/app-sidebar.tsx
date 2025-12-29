"use client"

import * as React from "react"
import {
  IconDashboard,
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FieldSeparator } from "./ui/field"
import InfoCard from "@/app/(protected)/dashboard/components/info-card"
import { useAuth } from "@/hooks/useAuth"
import { MENU_ITEMS } from "@/constants/app"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: MENU_ITEMS[0].title,
      url: MENU_ITEMS[0].url,
      icon: IconDashboard,
    },
    {
      title: MENU_ITEMS[1].title,
      url: MENU_ITEMS[1].url,
      icon: IconListDetails,
    },

  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { borrowedBooks } = useAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div>
          <FieldSeparator></FieldSeparator>
        </div>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <InfoCard limit={2} used={borrowedBooks.length} className="mx-2 mb-3 mt-2 py-3" />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
