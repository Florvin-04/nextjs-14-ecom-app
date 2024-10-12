"use client";

import SearchInput from "@/components/custom/SearchInput";
import { columns } from "@/components/custom/table/columns";
import CustomPagination from "@/components/custom/table/CustomPagination";
import { DataTable } from "@/components/custom/table/data-table";
import { ProductData } from "@/lib/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import AddProductButton from "../../_components/AddProductButton";

const PAGE_LIMIT = 5;

export default function ProductsTable() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const search = searchParams.get("search") || "";

  const { data, isLoading, isError } = useQuery<ProductData, Error>({
    queryKey: [
      "products-admin",
      { page: page, limit: PAGE_LIMIT, search: search },
    ],
    queryFn: async (): Promise<ProductData> => {
      const response = await axios.get<ProductData>(
        "/api/products/admin/products",
        {
          params: {
            page: page,
            limit: PAGE_LIMIT,
            search: search,
          },
        }
      ); // Fetch the data
      return response.data; // Return the data directly
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  if (!data) return <div>No data</div>;

  const totalPageCount = Math.ceil(data.total / PAGE_LIMIT);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product List</h1>
        <AddProductButton />
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-2">
          <SearchInput />
        </div>
        <div>
          <DataTable columns={columns} data={data.products} />
          <div>
            <CustomPagination
              page={page}
              totalPageCount={totalPageCount}
              pageLimit={PAGE_LIMIT}
              totalItems={data.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
