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
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";

const GetRequest = memo(
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
      queryParams: Record<string, string>;
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
          queryParams: Record<string, string>;
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
                type="source"
                position={Position.Right}
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={isConnectable}
              />
              <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg">
                <div className="text-center text-gray-700 text-[10px]">
                  Get Request
                  <Button size="icon" variant="destructive">
                    <Image
                      src="/nodes/cloud_server_icon.png"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>
              </div>
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

GetRequest.displayName = "GetRequest";

export default GetRequest;
