import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useReactFlow } from "@xyflow/react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GroupBy = memo(
  ({
    isConnectable,
    id,
    data,
  }: {
    isConnectable: boolean;
    id: string;
    data: {
      groupByColumns: string[];
      aggregationMapping: Record<string, string>;
    };
  }) => {
    const { setNodes } = useReactFlow();
    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          groupByColumns: string[];
          aggregationMapping: Record<string, string>;
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
              <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="text-center text-gray-700 text-[10px]">
                  Group By
                </div>
                <Button size="icon">
                  <Image
                    src="/nodes/group_by.png"
                    alt=""
                    width={16}
                    height={16}
                  />
                </Button>
              </div>
              <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
              />
              <Handle
                type="target"
                position={Position.Left}
                isConnectable={isConnectable}
              />
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <DialogTrigger asChild>
                <ContextMenuItem inset>
                  Change Configuration
                  <ContextMenuShortcut>[⌘</ContextMenuShortcut>
                </ContextMenuItem>
              </DialogTrigger>
              <ContextMenuItem
                inset
                onClick={() => {
                  router.push(`/results/${id}`);
                }}
              >
                Show results
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
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
              {(data.groupByColumns || []).map((value, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Input
                    placeholder={`Column ${index + 1}`}
                    className="col-span-3"
                    value={value}
                    onChange={(e) => {
                      const newItems = [...data.groupByColumns];
                      newItems[index] = e.target.value;
                      updateNodeData(id, { groupByColumns: newItems });
                    }}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      const newItems = [...data.groupByColumns];
                      newItems.splice(index, 1);
                      updateNodeData(id, { groupByColumns: newItems });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                className="mt-2"
                onClick={() => {
                  const newItems = [...(data.groupByColumns || []), ""];
                  updateNodeData(id, { groupByColumns: newItems });
                }}
              >
                + Add Column
              </Button>
              {Object.entries(data.aggregationMapping || {}).map(
                ([key, value], index) => (
                  <div
                    key={index}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Input
                      placeholder="Column Name"
                      className="col-span-2"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const newHeaders = { ...data.aggregationMapping };
                        delete newHeaders[key];
                        newHeaders[newKey] = value;
                        updateNodeData(id, { aggregationMapping: newHeaders });
                      }}
                    />
                    <Select
                      defaultValue={value}
                      onValueChange={(e) => {
                        const newAggregationMap = {
                          ...data.aggregationMapping,
                        };
                        newAggregationMap[key] = e;
                        updateNodeData(id, {
                          aggregationMapping: newAggregationMap,
                        });
                      }}
                    >
                      <SelectTrigger className="col-span-1">
                        <SelectValue placeholder="Select a Function" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="SUM">SUM</SelectItem>
                          <SelectItem value="AVG">AVG</SelectItem>
                          <SelectItem value="MIN">MIN</SelectItem>
                          <SelectItem value="MAX">MAX</SelectItem>
                          <SelectItem value="STDDEV">STDDEV</SelectItem>
                          <SelectItem value="CONCAT">CONCAT</SelectItem>
                          <SelectItem value="MODE">MODE</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <Button
                      variant={"destructive"}
                      className="col-span-1"
                      onClick={() => {
                        const newAggregationMap = {
                          ...data.aggregationMapping,
                        };
                        delete newAggregationMap[key];
                        updateNodeData(id, {
                          aggregationMapping: newAggregationMap,
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )
              )}

              <Button
                onClick={() => {
                  const newAggregationMap = {
                    ...data.aggregationMapping,
                    "": "",
                  };
                  updateNodeData(id, { aggregationMapping: newAggregationMap });
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

GroupBy.displayName = "GroupBy";

export default GroupBy;
