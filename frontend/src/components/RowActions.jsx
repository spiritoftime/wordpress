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
export const RowActions = (rowType) => {
  return {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
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
