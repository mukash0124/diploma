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

import { Checkbox } from "@/components/ui/checkbox";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { useRouter } from "next/navigation";

const StringCleaning = memo(
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
      columnActions: Record<string, string[]>;
      globalActions: string[];
      customCharsToRemove: string[];
    };
  }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          columnActions: Record<string, string[]>;
          globalActions: string[];
          customCharsToRemove: string[];
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
                  String Cleaning
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/string_cleaner.png"
                    alt="string_cleaner"
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
              {Object.entries(data.columnActions || {}).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-8 items-center gap-4"
                  >
                    <Input
                      placeholder="Column Name"
                      className="col-span-3"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const newActions = { ...data.columnActions };
                        delete newActions[key];
                        newActions[newKey] = value;
                        updateNodeData(id, { columnActions: newActions });
                      }}
                    />
                    <div className="col-span-1 space-x-4">
                      <Checkbox
                        checked={value.includes("Trim")}
                        onCheckedChange={(e) => {
                          const newActions = { ...data.columnActions };
                          if (e) {
                            newActions[key].push("Trim");
                          } else {
                            newActions[key].splice(
                              newActions[key].indexOf("Trim"),
                              1
                            );
                          }
                          updateNodeData(id, { columnActions: newActions });
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Trim
                      </label>
                    </div>
                    <div className="col-span-3 space-x-4">
                      <Checkbox
                        checked={value.includes("Remove Custom Chars")}
                        onCheckedChange={(e) => {
                          const newActions = { ...data.columnActions };
                          if (e) {
                            newActions[key].push("Remove Custom Chars");
                          } else {
                            newActions[key].splice(
                              newActions[key].indexOf("Remove Custom Chars"),
                              1
                            );
                          }
                          updateNodeData(id, { columnActions: newActions });
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remove Custom Chars
                      </label>
                    </div>
                    <Button
                      variant={"destructive"}
                      onClick={() => {
                        const newActions = { ...data.columnActions };
                        delete newActions[key];
                        updateNodeData(id, { columnActions: newActions });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}

              <Button
                onClick={() => {
                  const newActions = { ...data.columnActions, "": [] };
                  updateNodeData(id, { columnActions: newActions });
                }}
              >
                + Add Action
              </Button>
              <div className="space-x-4">
                <Checkbox
                  checked={data.globalActions?.includes("Trim") || false}
                  onCheckedChange={(e) => {
                    const globalActions = [...(data.globalActions || [])];
                    if (e) {
                      globalActions.push("Trim");
                    } else {
                      globalActions.splice(globalActions.indexOf("Trim"), 1);
                    }
                    updateNodeData(id, { globalActions: globalActions });
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Trim
                </label>
              </div>
              <div className="space-x-4">
                <Checkbox
                  checked={
                    data.globalActions?.includes("Remove Custom Chars") || false
                  }
                  onCheckedChange={(e) => {
                    const globalActions = [...(data.globalActions || [])];
                    if (e) {
                      globalActions.push("Remove Custom Chars");
                    } else {
                      globalActions.splice(
                        globalActions.indexOf("Remove Custom Chars"),
                        1
                      );
                    }
                    updateNodeData(id, { globalActions: globalActions });
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remove Custom Chars
                </label>
              </div>

              {(data.customCharsToRemove || []).map((value, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Input
                    placeholder={`Column ${index + 1}`}
                    className="col-span-3"
                    value={value}
                    onChange={(e) => {
                      const newItems = [...data.customCharsToRemove];
                      newItems[index] = e.target.value;
                      updateNodeData(id, { customCharsToRemove: newItems });
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const newItems = [...data.customCharsToRemove];
                      newItems.splice(index, 1);
                      updateNodeData(id, { customCharsToRemove: newItems });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                className="mt-2"
                onClick={() => {
                  const newItems = [...(data.customCharsToRemove || []), ""];
                  updateNodeData(id, { customCharsToRemove: newItems });
                }}
              >
                + Add Custom Char
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

StringCleaning.displayName = "StringCleaning";

export default StringCleaning;
