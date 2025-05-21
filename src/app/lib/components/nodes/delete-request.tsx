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
import { Label } from "@/components/ui/label";
import { useReactFlow } from "@xyflow/react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";

const DeleteRequest = memo(
  ({
    isConnectable,
    id,
    data,
  }: {
    isConnectable: boolean;
    id: string;
    data: {
      url: string;
      headers: Record<string, string>;
      timeout: number;
    };
  }) => {
    const { setNodes } = useReactFlow();

    const updateNodeData = useCallback(
      (
        id: string,
        newData: Partial<{
          url: string;
          headers: Record<string, string>;
          timeout: number;
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
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={isConnectable}
              />
              <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                <div className="text-[7px] font-medium text-center leading-none">
                  Delete Request
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/delete_request.png"
                    alt="delete_request"
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  className="col-span-3"
                  value={data.url || ""}
                  onChange={(evt) =>
                    updateNodeData(id, {
                      url: evt.target.value,
                      headers: data.headers,
                      timeout: Number(data.timeout),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timeout" className="text-right">
                  Timeout
                </Label>
                <Input
                  id="timeout"
                  className="col-span-3"
                  value={data.timeout || ""}
                  onChange={(evt) =>
                    updateNodeData(id, {
                      url: data.url,
                      headers: data.headers,
                      timeout: Number(evt.target.value),
                    })
                  }
                />
              </div>
              {Object.entries(data.headers || {}).map(([key, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Input
                    placeholder="Header Name"
                    value={key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const newHeaders = { ...data.headers };
                      delete newHeaders[key];
                      newHeaders[newKey] = value;
                      updateNodeData(id, { headers: newHeaders });
                    }}
                  />
                  <Input
                    placeholder="Header Value"
                    className="col-span-2"
                    value={value}
                    onChange={(e) => {
                      const newHeaders = { ...data.headers };
                      newHeaders[key] = e.target.value;
                      updateNodeData(id, { headers: newHeaders });
                    }}
                  />
                  <Button
                    variant={"destructive"}
                    onClick={() => {
                      const newHeaders = { ...data.headers };
                      delete newHeaders[key];
                      updateNodeData(id, { headers: newHeaders });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                onClick={() => {
                  const newHeaders = { ...data.headers, "": "" };
                  updateNodeData(id, { headers: newHeaders });
                }}
              >
                + Add Header
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

DeleteRequest.displayName = "DeleteRequest";

export default DeleteRequest;
