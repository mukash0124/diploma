"use client";
import { ChevronRight, Cross, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MouseEventHandler, useState } from "react";
import { toast } from "sonner";
import { getSession } from "../session";
import { exportFile } from "../utils";

function deleteWorkflow(id: string | string[] | undefined) {
  if (!id) {
    toast("Error!", {
      description: "Invalid workflow ID.",
    });
  }
  (async () => {
    const session = await getSession();

    try {
      const response = await fetch(
        `http://localhost:8080/api/workflows/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${session}`,
          },
        }
      );

      if (!response.ok) {
        toast("Error!", {
          description: (
            <span style={{ color: "black" }}>
              Failed to delete workflow, error: {response.statusText}
            </span>
          ),
        });
      } else {
        toast("Success!", {
          description: (
            <span style={{ color: "black" }}>
              Workflow was successfully deleted
            </span>
          ),
        });
      }
    } catch (error) {
      toast("Error!", {
        description: (
          <span style={{ color: "black" }}>
            Failed to delete workflow, error: {String(error)}
          </span>
        ),
      });
    }
  })();
}

function exportWorkflow(title: string, structure: object) {
  exportFile(structure, title);
}

export function NavMain({
  items,
  action,
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    items?: {
      id: string;
      title: string;
      url: string;
      structure: object;
    }[];
  }[];
  action: (
    title: string,
    structure: object
  ) => MouseEventHandler<HTMLButtonElement>;
}) {
  const [title, setTitle] = useState<string>("Workflow");
  const [structure, setStructure] = useState<object>({});

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
              <>
                <CollapsibleTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:rotate-90">
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </SidebarMenuAction>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <ContextMenu key={subItem.title}>
                        <ContextMenuTrigger>
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton key={subItem.title} asChild>
                              <a href={subItem.url}>
                                <span>{subItem.title}</span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-64">
                          <ContextMenuItem
                            inset
                            onClick={() => deleteWorkflow(subItem.id)}
                          >
                            Delete Workflow
                          </ContextMenuItem>
                          <ContextMenuItem
                            inset
                            onClick={() =>
                              exportWorkflow(subItem.title, subItem.structure)
                            }
                          >
                            Export Workflow
                          </ContextMenuItem>
                        </ContextMenuContent>
                      </ContextMenu>
                    ))}
                    {item.title == "Workflows" && (
                      <SidebarMenuSubItem key="Add Workflow">
                        <Dialog>
                          <DialogTrigger asChild>
                            <SidebarMenuSubButton asChild>
                              <a href="#">
                                <Cross />
                                <span>Add Workflow</span>
                              </a>
                            </SidebarMenuSubButton>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                              <DialogTitle>Create new workflow</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-6 items-center gap-4">
                                <Label
                                  htmlFor="columns"
                                  className="text-right col-span-2"
                                >
                                  Title of the workflow
                                </Label>
                                <Input
                                  id="columns"
                                  className="col-span-4"
                                  onChange={(evt) => setTitle(evt.target.value)}
                                />
                              </div>
                              <div className="grid grid-cols-6 items-center gap-4">
                                <Label
                                  htmlFor="structure_file"
                                  className="text-right col-span-2"
                                >
                                  Structure File
                                </Label>
                                <Input
                                  id="structure_file"
                                  className="col-span-4"
                                  type="file"
                                  onChange={(evt) => {
                                    const file = evt.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (e) => {
                                        try {
                                          const structure = JSON.parse(
                                            String(e.target?.result)
                                          );
                                          setStructure(structure);
                                        } catch {
                                          toast("Error!", {
                                            description: "Invalid JSON file.",
                                          });
                                        }
                                      };
                                      reader.readAsText(file);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="submit"
                                onClick={action(title, structure)}
                              >
                                Create
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
