import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useEffect, useState } from "react";
import { DataTablePagination } from "./DataTablePagination";
import { useNavigate, useMatch } from "react-router-dom";
import { useAppContext } from "../context/appContext";
// rowType = 'conferences'/'speakers'/'sessions',etc
// filterColumn = the key of the column you want to filter
export function DataTable({
  columns,
  data,
  rowType,
  filterColumn,
  rowNavigate,
  setData,
  setNewComboBoxValue,
  clickable,
}) {
  const { setComboBoxValue, setSelectedTopics, selectedTopics } =
    useAppContext();
  // console.log("selected", selectedTopics);
  const matchedSessionPath = useMatch("/add-session");
  // console.log("topics", selectedTopics);
  const [sorting, setSorting] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  // to preserve selected topics state when you click back
  useEffect(() => {
    if (selectedTopics.length > 0 && matchedSessionPath) {
      const rowsToSelectObj = {};
      selectedTopics.forEach((topic) => {
        rowsToSelectObj[topic.tableRow] = true;
      });
      table.setRowSelection(selectedTopics);
    }
  }, []);
  // whenever something is selected, just update the selectedTopics state
  useEffect(() => {
    if (matchedSessionPath) {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const newSelectedTopics = selectedRows.map((s) => ({
        ...s.original,
        tableRow: s.index,
      }));
      setSelectedTopics(newSelectedTopics);
    }
  }, [table.getFilteredSelectedRowModel().rows.length]);
  // console.log("state", table.getState());
  // console.log("selected", table.getFilteredSelectedRowModel().rows);

  const navigate = useNavigate();
  const matchedConferencePath = useMatch("/");
  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder={`Filter ${rowType}...`}
          value={table.getColumn(filterColumn)?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn(filterColumn)?.setFilterValue(event.target.value)
          }
          className="max-w-sm ml-auto"
        />
      </div>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow
                    className="cursor-pointer"
                    onClick={() => {
                      // added clickable prop so that user doesnt suddenly get navigated when adding session
                      if (clickable) {
                        matchedConferencePath &&
                          setComboBoxValue(row.original.name);
                        setData(row.original);
                        rowNavigate(row.original.id);
                      }
                    }}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
