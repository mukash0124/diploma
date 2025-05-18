"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { cache } from "react";

import { useRouter } from "next/navigation";

import { AppSidebar } from "@/app/lib/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { getSession } from "@/app/lib/session";
import { toast } from "sonner";
import { getUser } from "@/app/lib/dal";

const getWorkflow: (id: string | string[] | undefined) => Promise<
  | {
      id: string;
      title: string;
      structure: object;
      ownerId: string;
      createdAt: string;
      updatedAt: string | null;
    }
  | null
  | undefined
> = cache(async (id) => {
  if (!id) {
    toast("Error!", {
      description: "Invalid workflow ID.",
    });
    return null;
  }
  const session = await getSession();
  if (!session) {
    redirect("/signin");
  }

  toast("Loading...", {
    description: "Fetching workflow...",
  });

  try {
    const response = await fetch(
      `http://localhost:8080/api/workflows/single/${id}`,
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
        description: "Failed to fetch workflow, error: " + response.statusText,
      });
      return null;
    }

    return response.json();
  } catch (error) {
    toast("Error!", {
      description: `Failed to fetch workflow, error: ${error}`,
    });
    return null;
  }
});

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  const [title, setTitle] = React.useState<string | undefined>("");

  React.useEffect(() => {
    if (slug) {
      getWorkflow(slug).then((data) => {
        setTitle(data?.title);
      });
    }
  }, [slug]);

  const router = useRouter();

  async function addWorkflow(title: string) {
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
      structure: {
        nodes: [],
        edges: [],
      },
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

      if (!response.ok) {
        toast("Error!", {
          description:
            "Failed to create workflow, error: " + response.statusText,
        });
      }
      toast("Success!", {
        description: "Workflow created successfully.",
      });

      const data = await response.json();
      console.log(data);
      router.push(`/workflows/${data.id}`);
    } catch (error) {
      toast("Error!", {
        description: `Failed to create workflow, error: ${error}`,
      });
    }
  }

  const getResult: (id: string | string[] | undefined) => Promise<
    | {
        nodeId: string;
        workflowId: string;
        result: object;
        createdAt: string;
        updatedAt: string | null;
      }
    | null
    | undefined
  > = cache(async (id) => {
    if (!id) {
      toast("Error!", {
        description: "Invalid result ID.",
      });
      return null;
    }
    const session = await getSession();
    if (!session) {
      router.push("/signin");
    }

    toast("Loading...", {
      description: "Fetching result...",
    });

    try {
      const response = await fetch(
        `http://localhost:8080/api/results/single/${id}`,
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
          description: "Failed to fetch result, error: " + response.statusText,
        });
        return null;
      }

      return response.json();
    } catch (error) {
      toast("Error!", {
        description: `Failed to fetch result, error: ${error}`,
      });
      return null;
    }
  });

  const [results, setResults] = React.useState<any[] | undefined>(undefined);

  React.useEffect(() => {
    if (slug) {
      getResult(slug).then((data) => {
        setResults(data?.result?.list);
      });
    }
  }, [slug, getResult]);

  const headers = results?.[0] ? Object.keys(results[0] ?? {}) : [];
  console.log("Headers:", headers);
  console.log("Results:", results);

  return (
    <SidebarProvider>
      <AppSidebar action={(title: string) => () => addWorkflow(title)} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-2 rounded-md">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Results</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{slug}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results?.map((item, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>{String(item[header])}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
