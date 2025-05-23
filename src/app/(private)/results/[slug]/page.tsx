"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import React from "react";

import { useRouter, useSearchParams } from "next/navigation";

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
import { convertToCSV, downloadFile, convertToExcel } from "./utils";

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

  const router = useRouter();
  const searchParams = useSearchParams();

  async function getResult(id: string | string[] | undefined): Promise<
    | {
        nodeId: string;
        workflowId: string;
        type: string;
        result: object;
        createdAt: string;
        updatedAt: string | null;
      }
    | null
    | undefined
  > {
    if (!id) {
      toast("Error!", {
        description: "Invalid result ID.",
      });
      return null;
    }
    const session = await getSession();

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
        router.push(`/workflows/${searchParams.get("workflowId")}`);
        return null;
      }

      return response.json();
    } catch (error) {
      toast("Error!", {
        description: `Failed to fetch result, error: ${error}`,
      });
      return null;
    }
  }

  async function addWorkflow(title: string) {
    const session = await getSession();

    const user = await getUser();

    const workflow = {
      title: title,
      ownerId: user?.userId,
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

      const res = await response.text();

      if (!response.ok) {
        toast("Error!", {
          description: <span style={{ color: "black" }}>{res}</span>,
        });
      } else {
        toast("Success!", {
          description: <span style={{ color: "black" }}>{res}</span>,
        });
      }

      const data = await response.json();

      router.push(`/workflows/${data.id}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast("Error!", {
        description: <span style={{ color: "black" }}>{errorMessage}</span>,
      });
    }
  }

  const [results, setResults] = React.useState<
    | {
        nodeId: string;
        workflowId: string;
        type: string;
        result: object;
        createdAt: string;
        updatedAt: string | null;
      }
    | undefined
  >(undefined);
  const [loading, setLoading] = React.useState<boolean>(true);
  const hasRunRef = React.useRef(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getResult(slug);
      setResults(data ?? undefined);
      setLoading(false);
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  React.useEffect(() => {
    if (!loading && results && !hasRunRef.current) {
      hasRunRef.current = true;
      switch (results.type) {
        case "csv_writer":
          const blob = convertToCSV(results.result.list);
          downloadFile(
            blob,
            `${results.workflowId}_${results.nodeId}.csv`,
            router,
            results.workflowId
          );
          break;
        case "excel_writer":
          const excelBlob = convertToExcel(results.result.list);
          downloadFile(
            excelBlob,
            `${results.workflowId}_${results.nodeId}.xlsx`,
            router,
            results.workflowId
          );
          break;
        default:
          break;
      }
    }
  }, [loading, results, router]);

  const headers = React.useMemo(() => {
    return results?.result.list?.[0] ? Object.keys(results.result.list[0]) : [];
  }, [results]);

  return (
    <SidebarProvider>
      <AppSidebar action={(title: string) => () => addWorkflow(title)} />
      <SidebarInset className="w-full max-w-full overflow-hidden">
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
        <ScrollArea>
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
                {results?.result.list?.map((item, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((header) => (
                      <TableCell key={header}>{String(item[header])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal"></ScrollBar>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  );
}
