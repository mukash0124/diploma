import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";

const CSVWriter = memo(
  ({
    isConnectable,
    id,
    workflowId,
  }: {
    isConnectable: boolean;
    id: string;
    workflowId: string;
  }) => {
    const router = useRouter();
    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
              <div className="text-[7px] font-medium text-center leading-none">
                CSV Writer
              </div>

              <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                <Image
                  src="/nodes/csv_writer.png"
                  alt="csv_writer"
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
          </ContextMenuTrigger>
          <ContextMenuContent className="w-64">
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
      </>
    );
  }
);

CSVWriter.displayName = "CSVWriter";

export default CSVWriter;
