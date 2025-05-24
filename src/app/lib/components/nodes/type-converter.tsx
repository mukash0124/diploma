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

const TypeConverter = memo(
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
      columnTypes: Record<string, string>;
    };
  }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          columnTypes: Record<string, string>;
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
                  Type Converter
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/type_converter.png"
                    alt="type_converter"
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
                  router.push(`/results/${id}?workflowId=${workflowId}`);
                }}
              >
                Show results
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(data.columnTypes || {}).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 items-center gap-4"
                  >
                    <Input
                      placeholder="Column Name"
                      className="col-span-2"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const newHeaders = { ...data.columnTypes };
                        delete newHeaders[key];
                        newHeaders[newKey] = value;
                        updateNodeData(id, { columnTypes: newHeaders });
                      }}
                    />
                    <Input
                      placeholder="Type"
                      className="col-span-2"
                      value={value}
                      onChange={(e) => {
                        const newHeaders = { ...data.columnTypes };
                        newHeaders[key] = e.target.value;
                        updateNodeData(id, { columnTypes: newHeaders });
                      }}
                    />
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        const newHeaders = { ...data.columnTypes };
                        delete newHeaders[key];
                        updateNodeData(id, { columnTypes: newHeaders });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}

              <Button
                onClick={() => {
                  const newHeaders = { ...data.columnTypes, "": "" };
                  updateNodeData(id, { columnTypes: newHeaders });
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

TypeConverter.displayName = "TypeConverter";

export default TypeConverter;
