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

const DBTableList = memo(
  ({ isConnectable, id }: { isConnectable: boolean; id: string }) => {
    const router = useRouter();

    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg">
              <div className="text-center text-gray-700 text-[10px]">
                DB Table List
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
      </>
    );
  }
);

DBTableList.displayName = "DBTableList";

export default DBTableList;
