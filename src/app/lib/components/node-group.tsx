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
            src="/nodes/csv_reader.png"
            onDragStart={(event) => onDragStart(event, "csv_reader")}
          />
          <Node
            className="dndnode CSVWriter"
            title="CSV Writer"
            src="/nodes/csv_writer.png"
            onDragStart={(event) => onDragStart(event, "csv_writer")}
          />
          <Node
            className="dndnode ExcelWriter"
            title="Excel Writer"
            src="/nodes/excel_writer.png"
            onDragStart={(event) => onDragStart(event, "excel_writer")}
          />
          <Node
            className="dndnode GetRequest"
            title="Get Request"
            src="/nodes/get_request.png"
            onDragStart={(event) => onDragStart(event, "get_request")}
          />
          <Node
            className="dndnode PostRequest"
            title="Post Request"
            src="/nodes/post_request.png"
            onDragStart={(event) => onDragStart(event, "post_request")}
          />
          <Node
            className="dndnode PutRequest"
            title="Put Request"
            src="/nodes/put_request.png"
            onDragStart={(event) => onDragStart(event, "put_request")}
          />
          <Node
            className="dndnode DeleteRequest"
            title="Delete Request"
            src="/nodes/delete_request.png"
            onDragStart={(event) => onDragStart(event, "delete_request")}
          />
          <Node
            className="dndnode PatchRequest"
            title="Patch Request"
            src="/nodes/patch_request.png"
            onDragStart={(event) => onDragStart(event, "patch_request")}
          />
          <Node
            className="dndnode DBConnector"
            title="DB Connector"
            src="/nodes/db_connector.png"
            onDragStart={(event) => onDragStart(event, "db_connector")}
          />
          <Node
            className="dndnode DBTableCreator"
            title="DB Table Creator"
            src="/nodes/db_table_creator.png"
            onDragStart={(event) => onDragStart(event, "db_table_creator")}
          />
          <Node
            className="dndnode DBTableRemover"
            title="DB Table Remover"
            src="/nodes/db_table_remover.png"
            onDragStart={(event) => onDragStart(event, "db_table_remover")}
          />
          <Node
            className="dndnode DBWriter"
            title="DB Writer"
            src="/nodes/db_writer.png"
            onDragStart={(event) => onDragStart(event, "db_writer")}
          />
          <Node
            className="dndnode DBMerge"
            title="DB Merge"
            src="/nodes/db_merge.png"
            onDragStart={(event) => onDragStart(event, "db_merge")}
          />
          <Node
            className="dndnode DBQueryReader"
            title="DB Query Reader"
            src="/nodes/db_query_reader.png"
            onDragStart={(event) => onDragStart(event, "db_query_reader")}
          />
          <Node
            className="dndnode DBReader"
            title="DB Reader"
            src="/nodes/db_reader.png"
            onDragStart={(event) => onDragStart(event, "db_reader")}
          />
          <Node
            className="dndnode DBRowFilter"
            title="DB Row Filter"
            src="/nodes/db_row_filter.png"
            onDragStart={(event) => onDragStart(event, "db_row_filter")}
          />
          <Node
            className="dndnode DBTableList"
            title="DB Table List"
            src="/nodes/db_table_list.png"
            onDragStart={(event) => onDragStart(event, "db_table_list")}
          />
          <Node
            className="dndnode DBTableSelector"
            title="DB Table Selector"
            src="/nodes/db_table_selector.png"
            onDragStart={(event) => onDragStart(event, "db_table_selector")}
          />
          <Node
            className="dndnode RowFilter"
            title="Row Filter"
            src="/nodes/row_filter.png"
            onDragStart={(event) => onDragStart(event, "row_filter")}
          />
          <Node
            className="dndnode ColumnFilter"
            title="Column Filter"
            src="/nodes/column_filter.png"
            onDragStart={(event) => onDragStart(event, "column_filter")}
          />
          <Node
            className="dndnode DuplicateRemover"
            title="Duplicate Remover"
            src="/nodes/duplicate_remover.png"
            onDragStart={(event) => onDragStart(event, "duplicate_remover")}
          />
          <Node
            className="dndnode ColumnRenamer"
            title="Column Renamer"
            src="/nodes/column_renamer.png"
            onDragStart={(event) => onDragStart(event, "column_renamer")}
          />
          <Node
            className="dndnode ColumnAggregator"
            title="Column Aggregator"
            src="/nodes/column_aggregator.png"
            onDragStart={(event) => onDragStart(event, "column_aggregator")}
          />
          <Node
            className="dndnode MissingDataProccessing"
            title="Missing Data Processing"
            src="/nodes/missing_value.png"
            onDragStart={(event) =>
              onDragStart(event, "missing_data_proccessing")
            }
          />
          <Node
            className="dndnode GroupBy"
            title="Group By"
            src="/nodes/group_by.png"
            onDragStart={(event) => onDragStart(event, "Group_By")}
          />
          <Node
            className="dndnode Sorter"
            title="Sorter"
            src="/nodes/sorter.png"
            onDragStart={(event) => onDragStart(event, "node_sorter")}
          />
          <Node
            className="dndnode Joiner"
            title="Joiner"
            src="/nodes/joiner.png"
            onDragStart={(event) => onDragStart(event, "node_join")}
          />
        </div>
        <ScrollBar orientation="horizontal"></ScrollBar>
      </ScrollArea>
    </>
  );
}
