import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

import { useRouter } from "next/navigation";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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

const Joiner = memo(
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
      joinColumn: string;
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
                  Joiner
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/joiner.png"
                    alt="joiner"
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
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="joinColumn" className="text-right">
                  Column to join on
                </Label>
                <Input
                  id="joinColumn"
                  value={data.joinColumn || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      joinColumn: evt.target.value,
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

Joiner.displayName = "Joiner";

export default Joiner;
