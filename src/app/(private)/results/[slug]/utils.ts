import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import * as XLSX from "xlsx";

export function convertToCSV(data: any[]): Blob {
  if (!data || data.length === 0) return new Blob();

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((field) => JSON.stringify(row[field] ?? "")).join(",")
    ),
  ];

  return new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
}

export function convertToExcel(data: any[], sheetName = "Sheet1"): Blob {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function downloadFile(
  blob: Blob,
  filename: string,
  router: AppRouterInstance,
  workflowId: string
) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  setTimeout(() => {
    router.push("/workflows/" + workflowId);
  }, 300);
}
