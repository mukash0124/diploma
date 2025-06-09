import React, { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReactFlow } from "@xyflow/react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useRouter } from "next/navigation";

const DBTableCreator = memo(
  ({
    isConnectable,
    id,
    data,
    workflowId,
  }: {
    isConnectable: boolean;
    id: string;
    workflowId: string;
    data: {
      tableName: string;
      columns: {
        columnName: string;
        columnType: string;
      }[];
    };
  }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          tableName: string;
          columns: {
            columnName: string;
            columnType: string;
          }[];
        }>
      ) => {
        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === id
              ? { ...node, data: { ...node.data, ...newData } }
              : node
          )
        );
      },
      [setNodes]
    );

    const router = useRouter();

    return (
      <>
        <Dialog>
          <ContextMenu>
            <ContextMenuTrigger>
              <Handle
                type="source"
                position={Position.Right}
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={isConnectable}
              />
              <Handle
                type="target"
                position={Position.Left}
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={isConnectable}
              />
              <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                <div className="text-[7px] font-medium text-center leading-none">
                  DB Table Creator
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/db_table_creator.png"
                    alt="db_table_creator"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <DialogTrigger asChild>
                <ContextMenuItem inset>Change Configuration</ContextMenuItem>
              </DialogTrigger>
              <ContextMenuItem
                inset
                onClick={() => {
                  router.push(`/results/${id}`);
                }}
              >
                Show results
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tableName" className="text-right">
                  tableName
                </Label>
                <Input
                  id="url"
                  className="col-span-3"
                  value={data.tableName || ""}
                  onChange={(evt) =>
                    updateNodeData(id, {
                      tableName: evt.target.value,
                      columns: data.columns,
                    })
                  }
                />
              </div>
              {(data.columns || []).map((value, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Input
                    placeholder={`Column ${index + 1} Name`}
                    className="col-span-1"
                    value={value.columnName}
                    onChange={(e) => {
                      const newItems = [...data.columns];
                      newItems[index] = {
                        columnName: e.target.value,
                        columnType: value.columnType,
                      };
                      updateNodeData(id, { columns: newItems });
                    }}
                  />
                  <Input
                    placeholder={`Column ${index + 1} Type`}
                    className="col-span-2"
                    value={value.columnType}
                    onChange={(e) => {
                      const newItems = [...data.columns];
                      newItems[index] = {
                        columnName: value.columnName,
                        columnType: e.target.value,
                      };
                      updateNodeData(id, { columns: newItems });
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const newItems = [...data.columns];
                      newItems.splice(index, 1);
                      updateNodeData(id, { columns: newItems });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                className="mt-2"
                onClick={() => {
                  const newItems = [
                    ...(data.columns || []),
                    {
                      columnName: "",
                      columnType: "",
                    },
                  ];
                  updateNodeData(id, { columns: newItems });
                }}
              >
                + Add Column
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

DBTableCreator.displayName = "DBTableCreator";

export default DBTableCreator;
