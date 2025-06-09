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

const DBReader = memo(
  ({ isConnectable, id }: { isConnectable: boolean; id: string }) => {
    const router = useRouter();
    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
              <div className="text-[7px] font-medium text-center leading-none">
                DB Reader
              </div>

              <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                <Image
                  src="/nodes/db_reader.png"
                  alt="db_reader"
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

DBReader.displayName = "DBReader";

export default DBReader;
