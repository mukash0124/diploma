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

const DBConnector = memo(
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
      databaseType: string;
      url: string;
      username: string;
      password: string;
      driver: string;
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
                  DB Connector
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/db_connector.png"
                    alt="db_connector"
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
                <Label htmlFor="databaseType" className="text-right">
                  Database Type
                </Label>
                <Input
                  id="databaseType"
                  value={data.databaseType || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      databaseType: evt.target.value,
                      url: data.url,
                      username: data.username,
                      password: data.password,
                      driver: data.driver,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">
                  URL
                </Label>
                <Input
                  id="url"
                  value={data.url || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      databaseType: data.databaseType,
                      url: evt.target.value,
                      username: data.username,
                      password: data.password,
                      driver: data.driver,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={data.username || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      databaseType: data.databaseType,
                      url: data.url,
                      username: evt.target.value,
                      password: data.password,
                      driver: data.driver,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  value={data.password || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      databaseType: data.databaseType,
                      url: data.url,
                      username: data.username,
                      password: evt.target.value,
                      driver: data.driver,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver" className="text-right">
                  Driver
                </Label>
                <Input
                  id="driver"
                  value={data.driver || ""}
                  className="col-span-3"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      databaseType: data.databaseType,
                      url: data.url,
                      username: data.username,
                      password: data.password,
                      driver: evt.target.value,
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

DBConnector.displayName = "DBConnector";

export default DBConnector;
