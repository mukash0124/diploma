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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReactFlow } from "@xyflow/react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useRouter } from "next/navigation";

const MissingDataProccessing = memo(
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
      actions: Record<string, string>;
      fixValues: Record<string, string>;
    };
  }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          actions: Record<string, string>;
          fixValues: Record<string, string>;
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
                  Missing Data Proccessing
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/missing_value.png"
                    alt="missing_data_proccessing"
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
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {Object.entries(data.actions || {}).map(([key, value], index) => (
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
                      const newActions = { ...data.actions };
                      delete newActions[key];
                      newActions[newKey] = value;
                      updateNodeData(id, { actions: newActions });
                    }}
                  />
                  <Select
                    defaultValue={value}
                    onValueChange={(e: string) => {
                      const newActions = { ...data.actions };
                      newActions[key] = e;
                      updateNodeData(id, { actions: newActions });
                    }}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Fix Value">Fix Value</SelectItem>
                        <SelectItem value="Most Frequent Value">
                          Most Frequent Value
                        </SelectItem>
                        <SelectItem value="Next Value">Next Value</SelectItem>
                        <SelectItem value="Previous Value">
                          Previous Value
                        </SelectItem>
                        <SelectItem value="Remove Row">Remove Row</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      const newActions = { ...data.actions };
                      delete newActions[key];
                      updateNodeData(id, { actions: newActions });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                onClick={() => {
                  const newActions = { ...data.actions, "": "" };
                  updateNodeData(id, { actions: newActions });
                }}
              >
                + Add Action
              </Button>
              {Object.entries(data.fixValues || {}).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-5 items-center gap-4"
                  >
                    <Input
                      placeholder="Column Name"
                      value={key}
                      className="col-span-2"
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const newFixValues = { ...data.fixValues };
                        delete newFixValues[key];
                        newFixValues[newKey] = value;
                        updateNodeData(id, { fixValues: newFixValues });
                      }}
                    />
                    <Input
                      placeholder="Value"
                      className="col-span-2"
                      value={value}
                      onChange={(e) => {
                        const newFixValues = { ...data.fixValues };
                        newFixValues[key] = e.target.value;
                        updateNodeData(id, { fixValues: newFixValues });
                      }}
                    />
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        const newFixValues = { ...data.fixValues };
                        delete newFixValues[key];
                        updateNodeData(id, { fixValues: newFixValues });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}

              <Button
                onClick={() => {
                  const newFixValues = { ...data.fixValues, "": "" };
                  updateNodeData(id, { fixValues: newFixValues });
                }}
              >
                + Add Fix Value
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

MissingDataProccessing.displayName = "MissingDataProccessing";

export default MissingDataProccessing;
