"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import DeleteProductModal from "./DeleteProductModal";
import { Product } from "@prisma/client";

export default function MoreButton(props: Product) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
            onClick={() => {
              setShowDeleteDialog(true);
            }}
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuItem>View payment details</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showDeleteDialog && (
        <DeleteProductModal
          name={props.name}
          id={props.id}
          closeModal={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
}
