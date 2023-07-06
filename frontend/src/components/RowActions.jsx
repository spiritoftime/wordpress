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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useState } from "react";
// takes in rowType - 'conference'/'speaker'/'session',etc
export const RowActions = (rowType, deleteMutation) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  return {
    id: "actions",
    cell: ({ row }) => {
      // const rowId = row.original.id;
      const rowData = row.original;
      return (
        <>
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
                onClick={(e) => e.stopPropagation()} // prevent the row from being clicked too
                onSelect={() => setShowDeleteAlert(true)}
              >
                {`Delete ${rowType}`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{`Edit ${rowType}`}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {`Are you sure you want to delete this ${rowType}?`}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation({ rowId });
                  }}
                  className="bg-red-600 focus:ring-red-600"
                >
                  <span>Delete</span>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      );
    },
  };
};
// ...
