"use client"

import * as React from "react"
import {
  IconArrowUpRight,
  IconBook,
  IconDashboard,
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
import { DEFAULT_VALUES, MENU_ITEMS } from "@/constants/app"
import { UserRole } from "@/types/enums/auth.enum"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, borrowedBooks } = useAuth();

  const data = {
    user: {
      name: (user?.name || user?.role || "User")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      email: user?.email ?? '',
    },
    navMain: user?.role === UserRole.ADMIN ?
      [
        {
          title: MENU_ITEMS[0].title,
          url: MENU_ITEMS[0].url,
          icon: IconDashboard,
        },
        {
          title: MENU_ITEMS[2].title,
          url: MENU_ITEMS[2].url,
          icon: IconArrowUpRight,
        },

      ]
      : [
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
               <IconBook className="!size-5" />
                <span className="text-base font-semibold">Shelf Wise</span>
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
        {user?.role === UserRole.USER && <InfoCard limit={DEFAULT_VALUES.BORROW_BOOKS_LIMIT} used={borrowedBooks.length} className="mx-2 mb-3 mt-2 py-3" />}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
