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
import { Label } from "@/components/ui/label";

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

const ColumnAggregator = memo(
  ({
    isConnectable,
    id,
    data,
  }: {
    isConnectable: boolean;
    id: string;
    data: {
      columns: string[];
      function: string;
      outputColumnName: string;
    };
  }) => {
    const { setNodes } = useReactFlow();
    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          columns: string[];
          function: string;
          outputColumnName: string;
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
                  Column Aggregator
                </div>
                <Button size="icon">
                  <Image
                    src="/nodes/column_aggregator.png"
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
              {(data.columns || []).map((value, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Input
                    placeholder={`Column ${index + 1}`}
                    className="col-span-3"
                    value={value}
                    onChange={(e) => {
                      const newItems = [...data.columns];
                      newItems[index] = e.target.value;
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
                  const newItems = [...(data.columns || []), ""];
                  updateNodeData(id, { columns: newItems });
                }}
              >
                + Add Column
              </Button>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="outputColumnName"
                  className="text-right col-span-2"
                >
                  Function
                </Label>
                <Select
                  defaultValue={data.function || ""}
                  onValueChange={(value) => {
                    updateNodeData(id, {
                      columns: data.columns,
                      function: value,
                      outputColumnName: data.outputColumnName,
                    });
                  }}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue placeholder="Select a Function" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="SUM">SUM</SelectItem>
                      <SelectItem value="AVG">AVG</SelectItem>
                      <SelectItem value="MIN">MIN</SelectItem>
                      <SelectItem value="MAX">MAX</SelectItem>
                      <SelectItem value="COUNT">COUNT</SelectItem>
                      <SelectItem value="CONCAT">CONCAT</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="outputColumnName"
                  className="text-right col-span-2"
                >
                  Output Column Name
                </Label>
                <Input
                  id="outputColumnName"
                  value={data.outputColumnName || ""}
                  className="col-span-2"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      columns: data.columns,
                      function: data.function,
                      outputColumnName: evt.target.value,
                    })
                  }
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

ColumnAggregator.displayName = "ColumnAggregator";

export default ColumnAggregator;
