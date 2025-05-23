"use client";

import React, { useRef, useCallback } from "react";

import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Background,
  getIncomers,
  getOutgoers,
  ReactFlowInstance,
  DefaultEdgeOptions,
  MarkerType,
} from "@xyflow/react";

import { useRouter } from "next/navigation";

import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";

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

import { v4 as uuidv4 } from "uuid";

import { getUser } from "@/app/lib/dal";

import "./style.css";

import NodeGroup from "@/app/lib/components/node-group";
import { DnDProvider, useDnD } from "@/app/lib/dnd-context";
import RowFilter from "@/app/lib/components/nodes/row-filter";
import CSVReader from "@/app/lib/components/nodes/csv-reader";
import CSVWriter from "@/app/lib/components/nodes/csv-writer";
import ColumnFilter from "@/app/lib/components/nodes/column-filter";
import GetRequest from "@/app/lib/components/nodes/get-request";
import DBConnector from "@/app/lib/components/nodes/db-connector";
import DuplicateRemover from "@/app/lib/components/nodes/duplicate-remover";

import { getSession } from "@/app/lib/session";
import { toast } from "sonner";
import PostRequest from "@/app/lib/components/nodes/post-request";
import ColumnRenamer from "@/app/lib/components/nodes/column-renamer";
import DBQueryReader from "@/app/lib/components/nodes/db-query-reader";
import DBTableList from "@/app/lib/components/nodes/db-table-list";
import ExcelWriter from "@/app/lib/components/nodes/excel-writer";
import DeleteRequest from "@/app/lib/components/nodes/delete-request";
import PatchRequest from "@/app/lib/components/nodes/patch-request";
import DBTableSelector from "@/app/lib/components/nodes/db-table-selector";
import DBReader from "@/app/lib/components/nodes/db-reader";
import ColumnAggregator from "@/app/lib/components/nodes/column-aggregator";
import GroupBy from "@/app/lib/components/nodes/group-by";
import Sorter from "@/app/lib/components/nodes/sorter";
import Joiner from "@/app/lib/components/nodes/joiner";
import DBTableCreator from "@/app/lib/components/nodes/db-table-creator";
import DBTableRemover from "@/app/lib/components/nodes/db-table-remover";
import DBWriter from "@/app/lib/components/nodes/db-writer";
import DBMerge from "@/app/lib/components/nodes/db-merge";
import DBRowFilter from "@/app/lib/components/nodes/db-row-filter";
import MissingDataProccessing from "@/app/lib/components/nodes/missing-data-processing";
import StringCleaning from "@/app/lib/components/nodes/string-cleaning";

const proOptions = { hideAttribution: true };

const nodeTypes = {
  get_request: GetRequest,
  column_filter: ColumnFilter,
  row_filter: RowFilter,
  csv_reader: CSVReader,
  csv_writer: CSVWriter,
  db_connector: DBConnector,
  db_query_reader: DBQueryReader,
  db_reader: DBReader,
  duplicate_remover: DuplicateRemover,
  post_request: PostRequest,
  column_renamer: ColumnRenamer,
  db_table_list: DBTableList,
  db_table_selector: DBTableSelector,
  excel_writer: ExcelWriter,
  delete_request: DeleteRequest,
  patch_request: PatchRequest,
  column_aggregator: ColumnAggregator,
  Group_By: GroupBy,
  node_sorter: Sorter,
  node_join: Joiner,
  db_table_creator: DBTableCreator,
  db_table_remover: DBTableRemover,
  db_writer: DBWriter,
  db_merge: DBMerge,
  db_row_filter: DBRowFilter,
  missing_data_proccessing: MissingDataProccessing,
  string_cleaning: StringCleaning,
};

let reactFlow: ReactFlowInstance;

const getId = () => uuidv4();

const DnDFlow = ({
  workflow,
}: {
  workflow:
    | { id: string; title: string; ownerId: string; structure: object }
    | null
    | undefined;
}) => {
  const reactFlowWrapper = useRef(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const edgeOptions: DefaultEdgeOptions = {
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    style: {
      stroke: "#000",
    },
  };

  reactFlow = useReactFlow();

  React.useEffect(() => {
    setNodes(workflow?.structure.nodes || []);
    setEdges(workflow?.structure.edges || []);
  }, [workflow, setEdges, setNodes]);

  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: getId(),
        workflowId: workflow?.id,
        data: {},
        type,
        position,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, screenToFlowPosition, workflow]
  );

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="dndflow pt-1">
      <div
        className="reactflow-wrapper border-2 rounded-md"
        ref={reactFlowWrapper}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragStart={(event) => onDragStart(event, "input")}
          onDragOver={onDragOver}
          proOptions={proOptions}
          defaultEdgeOptions={edgeOptions}
          defaultMarkerColor="#000"
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default function WorkflowPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = React.useState<string | undefined>(undefined);
  const router = useRouter();
  React.useEffect(() => {
    params.then((resolvedParams) => {
      setSlug(resolvedParams.slug);
    });
  }, [params]);

  const getWorkflow = useCallback(
    async (
      id: string | string[] | undefined
    ): Promise<
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
    > => {
      if (!id) {
        toast("Error!", {
          description: "Invalid workflow ID.",
        });
        return null;
      }
      const session = await getSession();

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
          router.push("/workflows");
          return null;
        }
        return response.json();
      } catch {
        router.push("/workflows");
        return null;
      }
    },
    [router]
  );

  const [title, setTitle] = React.useState<string | undefined>("");
  const [workflow, setWorkflow] = React.useState<
    | { id: string; title: string; ownerId: string; structure: object }
    | null
    | undefined
  >(null);

  React.useEffect(() => {
    if (slug) {
      getWorkflow(slug).then((data) => {
        setTitle(data?.title);
        setWorkflow(data);
      });
    }
  }, [slug, getWorkflow]);

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast("Error!", {
        description: <span style={{ color: "black" }}>{errorMessage}</span>,
      });
    }
  }

  const handleSaveWorkflow: React.MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.preventDefault();

    const reactFlowData = reactFlow.toObject();

    try {
      const session = await getSession();

      const user = await getUser();
      if (!user) {
        toast("Error!", {
          description: "User not found. Please log in again.",
        });
        return;
      }

      const workflow = {
        ownerId: user.userId,
        title: title,
        structure: reactFlowData,
      };

      const response = await fetch(
        `http://localhost:8080/api/workflows/${slug}`,
        {
          method: "PUT",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify(workflow),
        }
      );

      const res = await response.text();

      if (response.ok) {
        toast("Success!", {
          description: (
            <span style={{ color: "black" }}>
              Workflow {title} saved successfully.
            </span>
          ),
        });
      } else {
        toast("Error!", {
          description: <span style={{ color: "black" }}>{res}</span>,
        });
      }
    } catch {
      toast("Error!");
    }
  };

  const handleSubmitWorkflow = () => {
    const reactFlowData = reactFlow.toObject();

    const nodes = reactFlowData.nodes.map((node) => {
      const incomers = getIncomers(
        node,
        reactFlowData.nodes,
        reactFlowData.edges
      ).map((incomer) => incomer.id);
      const outgoers = getOutgoers(
        node,
        reactFlowData.nodes,
        reactFlowData.edges
      ).map((outgoer) => outgoer.id);
      return {
        node_id: node.id,
        type: node.type,
        x_axis: node.position.x,
        y_axis: node.position.y,
        inputs: incomers,
        outputs: outgoers,
        fields: node.data || {},
      };
    });

    const workflow = {
      workflowId: slug,
      nodes: nodes,
    };

    console.log("Workflow to be executed:", workflow);

    (async () => {
      try {
        const session = await getSession();

        const response = await fetch(
          "http://localhost:8080/api/workflow-executor/execute",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
              Authorization: `Bearer ${session}`,
            },
            body: JSON.stringify(workflow),
          }
        );

        const res = await response.text();

        if (response.ok) {
          toast("Success!", {
            description: <span style={{ color: "black" }}>{res}</span>,
          });
        } else {
          toast("Error!", {
            description: <span style={{ color: "black" }}>{res}</span>,
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        toast("Error!", {
          description: <span style={{ color: "black" }}>{errorMessage}</span>,
        });
      }
    })();
  };

  return (
    <SidebarProvider>
      <AppSidebar action={(title: string) => () => addWorkflow(title)} />
      <SidebarInset className="w-full max-w-full overflow-x-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-2 rounded-md w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Workflows</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Button onClick={handleSubmitWorkflow}>Execute Workflow</Button>
            <Button onClick={handleSaveWorkflow}>Save Workflow</Button>
          </div>
        </header>
        <ReactFlowProvider>
          <NodeGroup />
          <DnDProvider>
            <DnDFlow workflow={workflow} />
          </DnDProvider>
        </ReactFlowProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
