import { MoreHorizontal } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
// takes in rowType - 'conference'/'speaker'/'session',etc
export const RowActions = (rowType, deleteMutation) => {
  return {
    id: "actions",
    cell: ({ row }) => {
      // const rowId = row.original.id;
      const rowData = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                deleteMutation({ rowData });
              }}
            >
              {/* <DropdownMenuItem onClick={() => deleteMutation({ rowId })}> */}
              {`Delete ${rowType}`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{`Edit ${rowType}`}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  };
};
// ...
