import React from "react";
import { useDnD } from "@/app/lib/dnd-context";
import Node from "@/app/lib/components/node";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function NodeGroup({ className }: { className?: string }) {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <ScrollArea className="h-[120px]">
      <div
        className={`p-4 border-bp-2 flex gap-4 items-center mt-1 border-2 rounded-md ${className}`}
      >
        <Node
          className="dndnode CSVReader"
          title="CSV Reader"
          src="/nodes/csv_file_icon.png"
          onDragStart={(event) => onDragStart(event, "csv_reader")}
        />
        <Node
          className="dndnode CSVWriter"
          title="CSV Writer"
          src="/nodes/csv_file_icon.png"
          type="destructive"
          onDragStart={(event) => onDragStart(event, "csv_writer")}
        />
        <Node
          className="dndnode RowFilter"
          title="Row Filter"
          src="/nodes/row_filter_icon.png"
          onDragStart={(event) => onDragStart(event, "row_filter")}
        />
        <Node
          className="dndnode ColumnFilter"
          title="Column Filter"
          src="/nodes/column_filter_icon.png"
          onDragStart={(event) => onDragStart(event, "column_filter")}
        />
        <Node
          className="dndnode GetRequest"
          title="GetRequest"
          type="destructive"
          src="/nodes/cloud_server_icon.png"
          onDragStart={(event) => onDragStart(event, "get_request")}
        />
        <Node
          className="dndnode PostRequest"
          title="PostRequest"
          type="destructive"
          src="/nodes/cloud_server_icon.png"
          onDragStart={(event) => onDragStart(event, "post_request")}
        />
        <Node
          className="dndnode DBConnector"
          title="DB Connector"
          type="destructive"
          src="/nodes/db_connector.png"
          onDragStart={(event) => onDragStart(event, "db_connector")}
        />
        <Node
          className="dndnode DBReader"
          title="DB Reader"
          type="default"
          src="/nodes/db_query_executor.png"
          onDragStart={(event) => onDragStart(event, "db_reader")}
        />
        <Node
          className="dndnode DBTableList"
          title="DB Table List"
          type="default"
          src="/nodes/db_query_executor.png"
          onDragStart={(event) => onDragStart(event, "db_table_list")}
        />
        <Node
          className="dndnode DuplicateRemover"
          title="Duplicate Remover"
          type="default"
          src="/nodes/column_filter_icon.png"
          onDragStart={(event) => onDragStart(event, "duplicate_remover")}
        />
        <Node
          className="dndnode PutRequest"
          title="Put Request"
          type="default"
          src="/nodes/column_filter_icon.png"
          onDragStart={(event) => onDragStart(event, "put_request")}
        />
        <Node
          className="dndnode ColumnRenamer"
          title="Column Renamer"
          type="default"
          src="/nodes/cloud_server_icon.png"
          onDragStart={(event) => onDragStart(event, "column_renamer")}
        />
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
