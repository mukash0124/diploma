"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cross } from "lucide-react";
import { getSession } from "@/app/lib/session";
import { getUser } from "@/app/lib/dal";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";

export default function WorkflowsPage() {
  const router = useRouter();

  async function getWorkflows(): Promise<
    | [{ id: string; title: string; ownerId: string; structure: object }]
    | null
    | undefined
  > {
    const session = await getSession();

    const user = await getUser();

    try {
      const response = await fetch(
        `http://localhost:8080/api/workflows/${user?.userId}`,
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
          description: (
            <span style={{ color: "black" }}>
              Failed to fetch workflows, error: {response.statusText}
            </span>
          ),
        });
        return null;
      }

      return await response.json();
    } catch (error) {
      toast("Error!", {
        description: (
          <span style={{ color: "black" }}>
            Failed to fetch workflows, error: {String(error)}
          </span>
        ),
      });
      return null;
    }
  }

  async function addWorkflow(title: string, structure: object) {
    const session = await getSession();
    if (!session) {
      return;
    }

    const user = await getUser();
    if (!user) {
      return;
    }

    const workflow = {
      title: title,
      ownerId: user.userId,
      structure: structure,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/workflows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(workflow),
      });

      const res = await response.json();

      if (!response.ok) {
        toast("Error!", {
          description: (
            <span style={{ color: "black" }}>{response.statusText}</span>
          ),
        });
      } else {
        toast("Success!", {
          description: (
            <span style={{ color: "black" }}>{response.statusText}</span>
          ),
        });
      }

      router.push(`/workflows/${res.id}`);
    } catch (error: unknown) {
      const errorMessage = String(error);
      toast("Error!", {
        description: <span style={{ color: "black" }}>{errorMessage}</span>,
      });
    }
  }

  const [title, setTitle] = useState<string>("Workflow");
  const [structure, setStructure] = useState<object>({});

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

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <div className="flex flex-col">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Workflows</CardTitle>
              <CardDescription>
                Choose one of your workflows to work on or create new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <ul className="gap-y-2">
                  {workflows?.map((workflow) => (
                    <ListItem
                      key={workflow.id}
                      id={workflow.id}
                      title={workflow.title}
                    ></ListItem>
                  ))}
                </ul>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full mt-8">
                      <Cross />
                      Add Workflow
                    </Button>
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
                        onClick={() => addWorkflow(title, structure)}
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ComponentRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ id, title, ...props }, ref) => {
  return (
    <li>
      <a
        ref={ref}
        className="block my-1 space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        {...props}
        href={`/workflows/${id}`}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
      </a>
    </li>
  );
});
ListItem.displayName = "ListItem";
