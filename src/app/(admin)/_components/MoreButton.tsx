"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import DeleteProductModal from "./DeleteProductModal";

export default function MoreButton(props: Product) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
            onClick={() => {
              setShowDeleteDialog(true);
            }}
          >
            Delete
          </DropdownMenuItem>
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
