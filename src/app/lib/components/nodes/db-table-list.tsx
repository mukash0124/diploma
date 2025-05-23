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

const DBTableList = memo(
  ({ isConnectable, id }: { isConnectable: boolean; id: string }) => {
    const router = useRouter();

    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
              <div className="text-[7px] font-medium text-center leading-none">
                DB Table List
              </div>

              <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
                <Image
                  src="/nodes/db_table_list.png"
                  alt="db_table_list"
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
                router.push(`/results/${id}?workflowId=${workflowId}`);
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

DBTableList.displayName = "DBTableList";

export default DBTableList;
