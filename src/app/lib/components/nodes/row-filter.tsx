import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Switch } from "@/components/ui/switch";
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
import { useReactFlow } from "@xyflow/react";

import { useRouter } from "next/navigation";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

const RowFilter = memo(
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
      column: string;
      operator: string;
      value: string;
      caseSensitive: boolean;
      excludeMatches: boolean;
    };
  }) => {
    const { updateNodeData } = useReactFlow();

    const router = useRouter();

    return (
      <>
        <Dialog>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                <div className="text-[7px] font-medium text-center leading-none">
                  Row Filter
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/row_filter.png"
                    alt="row_filter"
                    fill
                    className="object-cover"
                  />
                </div>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="column" className="text-right">
                  Column to filter out
                </Label>
                <Input
                  id="column"
                  value={data.column || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      column: evt.target.value,
                      operator: data.operator,
                      value: data.value,
                      caseSensitive: data.caseSensitive,
                      excludeMatches: data.excludeMatches,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="operator" className="text-right">
                  Operator
                </Label>
                <Input
                  id="operator"
                  value={data.operator || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      column: data.column,
                      operator: evt.target.value,
                      value: data.value,
                      caseSensitive: data.caseSensitive,
                      excludeMatches: data.excludeMatches,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value
                </Label>
                <Input
                  id="value"
                  value={data.value || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      column: data.column,
                      operator: data.operator,
                      value: evt.target.value,
                      caseSensitive: data.caseSensitive,
                      excludeMatches: data.excludeMatches,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="caseSensitive" className="text-right">
                  Case Sensitive
                </Label>
                <Switch
                  id="caseSensitive"
                  checked={data.caseSensitive || false}
                  onCheckedChange={(evt) =>
                    updateNodeData(id, {
                      column: data.column,
                      operator: data.operator,
                      value: data.value,
                      caseSensitive: evt,
                      excludeMatches: data.excludeMatches,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="excludeMatches" className="text-right">
                  Exclude Matches
                </Label>
                <Switch
                  id="excludeMatches"
                  checked={data.excludeMatches || false}
                  onCheckedChange={(evt) =>
                    updateNodeData(id, {
                      column: data.column,
                      operator: data.operator,
                      value: data.value,
                      caseSensitive: data.caseSensitive,
                      excludeMatches: evt,
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

RowFilter.displayName = "RowFilter";

export default RowFilter;
