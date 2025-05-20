import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useRouter } from "next/navigation";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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

const DBTableSelector = memo(
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
              <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="text-center text-gray-700 text-[10px]">
                  DB Table Selector
                </div>
                <Button size="icon">
                  <Image
                    src="/nodes/db_query_executor.png"
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
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tableName" className="text-right">
                  Name of the table
                </Label>
                <Input
                  id="tableName"
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

DBTableSelector.displayName = "DBTableSelector";

export default DBTableSelector;
