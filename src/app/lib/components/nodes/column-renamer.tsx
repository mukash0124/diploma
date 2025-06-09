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
import { useReactFlow } from "@xyflow/react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";

const ColumnRenamer = memo(
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
      renameMap: Record<string, string>;
    };
  }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          renameMap: Record<string, string>;
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
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
              />
              <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
              />
              <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                <div className="text-[7px] font-medium text-center leading-none">
                  Column Renamer
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/column_renamer.png"
                    alt="column_renamer"
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(data.renameMap || {}).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Input
                      placeholder="Old Name"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const newHeaders = { ...data.renameMap };
                        delete newHeaders[key];
                        newHeaders[newKey] = value;
                        updateNodeData(id, { renameMap: newHeaders });
                      }}
                    />
                    <Input
                      placeholder="New Name"
                      className="col-span-2"
                      value={value}
                      onChange={(e) => {
                        const newHeaders = { ...data.renameMap };
                        newHeaders[key] = e.target.value;
                        updateNodeData(id, { renameMap: newHeaders });
                      }}
                    />
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        const newHeaders = { ...data.renameMap };
                        delete newHeaders[key];
                        updateNodeData(id, { renameMap: newHeaders });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}

              <Button
                onClick={() => {
                  const newHeaders = { ...data.renameMap, "": "" };
                  updateNodeData(id, { renameMap: newHeaders });
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

ColumnRenamer.displayName = "ColumnRenamer";

export default ColumnRenamer;
