import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import Image from "next/image";

const CSVReader = memo(({ isConnectable }: { isConnectable: boolean }) => {
  return (
    <>
      <div className="w-16 h-16 p-1.5 flex flex-col items-center justify-center gap-y-1 rounded-md border border-gray-300 bg-gray-100 overflow-hidden">
        <div className="text-[7px] font-medium text-center leading-none">
          CSV Reader
        </div>

        <div className="relative w-9 h-9 overflow-hidden rounded-sm shrink-0">
          <Image
            src="/nodes/csv_reader.png"
            alt="csv_reader"
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
    </>
  );
});

CSVReader.displayName = "CSVReader";

export default CSVReader;
