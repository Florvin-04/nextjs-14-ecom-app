"use client";

import React, { memo } from "react";
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
import AddProductDialog from "./AddProductDialog";

export default memo(function MoreButton(props: Product) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            onClick={(e) => e.stopPropagation()}
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteDialog(true);
            }}
          >
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer "
            onClick={(e) => {
              e.stopPropagation();
              setShowEditDialog(true);
            }}
          >
            Edit
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

      {showEditDialog && (
        <AddProductDialog
          transaction="edit"
          onClose={() => setShowEditDialog(false)}
          productInitialValues={{
            category: props.category,
            description: props.description,
            name: props.name,
            price: props.price.toString(),
            stock: props.stock.toString(),
            imageUrl: props.imagesUrl,
            id: props.id,
          }}
        />
      )}
    </>
  );
});
