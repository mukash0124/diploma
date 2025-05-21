import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
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

const DBMerge = memo(
  ({
    isConnectable,
    id,
    data,
  }: {
    isConnectable: boolean;
    id: string;
    data: {
      tableName: string;
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
                  DB Merge
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/db_merge.png"
                    alt="db_merge"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
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
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="statementQuery" className="text-right">
                  Name of the table to insert data
                </Label>
                <Input
                  id="statementQuery"
                  value={data.tableName || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      tableName: evt.target.value,
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

DBMerge.displayName = "DBMerge";

export default DBMerge;
