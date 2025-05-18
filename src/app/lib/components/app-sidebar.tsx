"use client";

import * as React from "react";
import { BookOpen, Command, Settings2, SquareTerminal } from "lucide-react";

import { NavMain } from "@/app/lib/components/nav-main";
import { NavUser } from "@/app/lib/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { getUser } from "@/app/lib/dal";
import { getSession } from "@/app/lib/session";
import { cache, MouseEventHandler } from "react";
import { redirect } from "next/navigation";
import { toast } from "sonner";

const getWorkflows: () => Promise<
  | [{ id: string; title: string; ownerId: string; structure: object }]
  | null
  | undefined
> = cache(async () => {
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }

  try {
    const response = await fetch(
      `http://localhost:8080/api/workflows/${user.userId}`,
      {
        method: "GET",
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${session}`,
        },
      }
    );

    if (!response.ok) {
      toast("Error!", {
        description: "Failed to fetch workflows, error: " + response.statusText,
      });
      return null;
    }

    return await response.json();
  } catch (error) {
    toast("Error!", {
      description: `Failed to fetch workflows, error: ${error}`,
    });
    return null;
  }
});

export function AppSidebar({
  action,
}: {
  action: (title: string) => MouseEventHandler<HTMLButtonElement>;
}) {
  const [user, setUser] = React.useState<
    { userId: string; email: string; username: string } | null | undefined
  >(null);

  const [workflows, setWorkflows] = React.useState<
    | [{ id: string; title: string; ownerId: string; structure: object }]
    | null
    | undefined
  >(null);

  React.useEffect(() => {
    getWorkflows().then((data) => {
      setWorkflows(data);
    });
  }, []);

  React.useEffect(() => {
    getUser().then((data) => {
      setUser(data);
    });
  }, []);

  const items = workflows?.map((workflow) => {
    return {
      title: workflow.title,
      url: `/workflows/${workflow.id}`,
    };
  });

  const data = {
    user: {
      name: user?.username,
      email: user?.email,
    },
    navMain: [
      {
        title: "Workflows",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: items,
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Workflows</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} action={action} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
