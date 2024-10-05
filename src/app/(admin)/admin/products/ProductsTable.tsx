"use client";

import { columns } from "@/components/custom/table/columns";
import { DataTable } from "@/components/custom/table/data-table";
import { ProductData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function ProductsTable() {
  const { data, isLoading, isError } = useQuery<ProductData>({
    queryKey: ["products-admin", "1"],
    queryFn: async () => {
      const response = await axios.get<ProductData>(
        "/api/products/admin/products"
      ); // Fetch the data
      return response.data; // Return the data directly
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  if (!data) return <div>No data</div>;

  return (
    <div>
      <DataTable columns={columns} data={data.products} />
    </div>
  );
}
