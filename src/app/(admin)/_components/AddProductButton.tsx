"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddProductDialog from "./AddProductDialog";

export default function AddProductButton() {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <>
      <Button onClick={() => setOpenDialog(true)}>Add Product</Button>
      {openDialog && (
        <AddProductDialog
          transaction="add"
          onClose={() => setOpenDialog(false)}
        />
      )}
    </>
  );
}
