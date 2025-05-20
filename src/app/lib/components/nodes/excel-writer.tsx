import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";

const ExcelWriter = memo(
  ({ isConnectable, id }: { isConnectable: boolean; id: string }) => {
    const router = useRouter();
    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg">
              <div className="text-center text-gray-700 text-[10px]">
                Excel Writer
              </div>
              <Button size="icon" variant={"default"}>
                <Image
                  src="/nodes/excel_file_icon.png"
                  alt=""
                  width={16}
                  height={16}
                />
              </Button>
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

ExcelWriter.displayName = "ExcelWriter";

export default ExcelWriter;
