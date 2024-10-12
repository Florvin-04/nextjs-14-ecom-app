"use client";
import MoreButton from "@/app/(admin)/_components/MoreButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import React from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Payment = {
//   id: string;
//   amount: number;
//   status: "pending" | "processing" | "success" | "failed";
//   email: string;
// };

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex justify-center items-center bg-white">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex justify-start items-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 50,
  },
  {
    accessorKey: "imagesUrl",
    header: "",
    cell: ({ row }) => {
      return (
        <div className="flex-shrink-0 h-10 w-10">
          <Image
            className="size-10"
            src={row.original.imagesUrl}
            width={100}
            height={100}
            alt={row.original.name}
          />
        </div>
      );
    },
    size: 50,
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 100,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return (
        <div
          className="min-w-0 w-full truncate"
          //   onClick={() => {
          //     row.getToggleSelectedHandler();
          //   }}
        >
          <p className=" min-w-0 truncate w-full">{row.original.description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <div>
          {new Date(row.original.updatedAt).toLocaleDateString("us-en", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
  },

  //   {
  //     accessorKey: "status",
  //     header: "Status",
  //   },
  //   {
  //     accessorKey: "email",
  //     header: "Email",
  //     cell: ({ row }) => {
  //       return (
  //         <div className=" min-w-0 w-full truncate max-w-full">
  //           <p className="truncate min-w-0">{row.original.email}</p>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     accessorKey: "amount",
  //     header: () => <div className="text-right">Amount</div>,
  //     cell: ({ row }) => {
  //       const amount = parseFloat(row.getValue("amount"));
  //       const formatted = new Intl.NumberFormat("en-US", {
  //         style: "currency",
  //         currency: "USD",
  //       }).format(amount);

  //       return <div className="text-right font-medium">{formatted}</div>;
  //     },
  //   },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <>
          <div className="flex justify-center">
            <MoreButton {...row.original} />
          </div>
        </>
      );
    },
    size: 50,
  },
];
