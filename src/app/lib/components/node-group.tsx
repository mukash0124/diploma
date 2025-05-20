import React from "react";
import { useDnD } from "@/app/lib/dnd-context";
import Node from "@/app/lib/components/node";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function NodeGroup({ className }: { className?: string }) {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <>
      <ScrollArea>
        <div
          className={`whitespace-nowrap p-4 border-bp-2 flex min-w-max gap-4 items-center mt-1 border-2 rounded-md ${className}`}
        >
          <Node
            className="dndnode CSVReader"
            title="CSV Reader"
            type="destructive"
            src="/nodes/csv_file_icon.png"
            onDragStart={(event) => onDragStart(event, "csv_reader")}
          />
          <Node
            className="dndnode CSVWriter"
            title="CSV Writer"
            src="/nodes/csv_file_icon.png"
            type="default"
            onDragStart={(event) => onDragStart(event, "csv_writer")}
          />
          <Node
            className="dndnode ExcelWriter"
            title="Excel Writer"
            src="/nodes/excel_file_icon.png"
            type="default"
            onDragStart={(event) => onDragStart(event, "excel_writer")}
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
            type="default"
            src="/nodes/cloud_server_icon.png"
            onDragStart={(event) => onDragStart(event, "post_request")}
          />
          <Node
            className="dndnode PutRequest"
            title="Put Request"
            type="default"
            src="/nodes/cloud_server_icon.png"
            onDragStart={(event) => onDragStart(event, "put_request")}
          />
          <Node
            className="dndnode DeleteRequest"
            title="Delete Request"
            type="default"
            src="/nodes/cloud_server_icon.png"
            onDragStart={(event) => onDragStart(event, "delete_request")}
          />
          <Node
            className="dndnode PatchRequest"
            title="Patch Request"
            type="default"
            src="/nodes/cloud_server_icon.png"
            onDragStart={(event) => onDragStart(event, "patch_request")}
          />
          <Node
            className="dndnode DBConnector"
            title="DB Connector"
            type="destructive"
            src="/nodes/db_connector.png"
            onDragStart={(event) => onDragStart(event, "db_connector")}
          />
          <Node
            className="dndnode DBQueryReader"
            title="DB Query Reader"
            type="default"
            src="/nodes/db_query_executor.png"
            onDragStart={(event) => onDragStart(event, "db_query_reader")}
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
            className="dndnode DBTableSelector"
            title="DB Table Selector"
            type="default"
            src="/nodes/db_query_executor.png"
            onDragStart={(event) => onDragStart(event, "db_table_selector")}
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
            className="dndnode DuplicateRemover"
            title="Duplicate Remover"
            type="default"
            src="/nodes/column_filter_icon.png"
            onDragStart={(event) => onDragStart(event, "duplicate_remover")}
          />
          <Node
            className="dndnode ColumnRenamer"
            title="Column Renamer"
            type="default"
            src="/nodes/cloud_server_icon.png"
            onDragStart={(event) => onDragStart(event, "column_renamer")}
          />
          <Node
            className="dndnode ColumnAggregator"
            title="Column Aggregator"
            type="default"
            src="/nodes/column_aggregator.png"
            onDragStart={(event) => onDragStart(event, "column_aggregator")}
          />
          <Node
            className="dndnode GroupBy"
            title="Group By"
            type="default"
            src="/nodes/group_by.png"
            onDragStart={(event) => onDragStart(event, "Group_By")}
          />
          <Node
            className="dndnode Sorter"
            title="Sorter"
            type="default"
            src="/nodes/sorter.png"
            onDragStart={(event) => onDragStart(event, "node_sorter")}
          />
          <Node
            className="dndnode Joiner"
            title="Joiner"
            type="default"
            src="/nodes/joiner.png"
            onDragStart={(event) => onDragStart(event, "node_join")}
          />
        </div>
        <ScrollBar orientation="horizontal"></ScrollBar>
      </ScrollArea>
    </>
  );
}
