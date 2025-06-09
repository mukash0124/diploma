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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";
import { useReactFlow } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ExcelReader = memo(
  ({
    isConnectable,
    id,
    workflowId,
    data,
  }: {
    isConnectable: boolean;
    id: string;
    workflowId: string;
    data: {
      file: File;
      sheetName: string;
      sheetPosition: number;
    };
  }) => {
    const router = useRouter();
    const { updateNodeData } = useReactFlow();
    return (
      <>
        <Dialog>
          <ContextMenu>
            <ContextMenuTrigger>
              <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
                <div className="text-[7px] font-medium text-center leading-none">
                  Excel Reader
                </div>

                <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                  <Image
                    src="/nodes/excel_reader.png"
                    alt="excel_reader"
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit node configuration</DialogTitle>
              <DialogDescription>
                Enter details of the request to be sent to the server.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="file" className="text-right col-span-1">
                  Excel File
                </Label>
                <Input
                  id="file"
                  className="col-span-2"
                  type="file"
                  onChange={(evt) => {
                    const file = evt.target.files?.[0];
                    if (file) {
                      updateNodeData(id, {
                        ...data,
                        file: file,
                      });
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="sheetName" className="text-right">
                  Name of the sheet
                </Label>
                <Input
                  id="sheetName"
                  value={data.sheetName || ""}
                  className="col-span-2"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      file: data.file,
                      sheetPosition: data.sheetPosition,
                      sheetName: evt.target.value,
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="sheetPosition" className="text-right">
                  Position of the sheet
                </Label>
                <Input
                  id="sheetPosition"
                  value={data.sheetPosition || ""}
                  className="col-span-2"
                  onChange={(evt) =>
                    updateNodeData(id, {
                      file: data.file,
                      sheetName: data.sheetName,
                      sheetPosition: Number(evt.target.value),
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

ExcelReader.displayName = "ExcelReader";

export default ExcelReader;
