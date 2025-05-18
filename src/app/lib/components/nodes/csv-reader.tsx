import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const CSVReader = memo(({ isConnectable }: { isConnectable: boolean }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center w-20 h-20 bg-gray-100 border border-gray-300 rounded-lg">
        <div className="text-center text-gray-700 text-[10px]">CSV Reader</div>
        <Button size="icon">
          <Image src="/nodes/csv_file_icon.png" alt="" width={16} height={16} />
        </Button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});

CSVReader.displayName = "CSVReader";

export default CSVReader;
