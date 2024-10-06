"use client";

import { columns } from "@/components/custom/table/columns";
import CustomPagination from "@/components/custom/table/CustomPagination";
import { DataTable } from "@/components/custom/table/data-table";
import { Input } from "@/components/ui/input";
import { useCreateUrlWithParams } from "@/hooks/ueCreateUrlWithParams";
import useDebounce from "@/hooks/useDebounce";
import { ProductData } from "@/lib/types";
// import useBearStore from "@/zustand/store/bear";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

const PAGE_LIMIT = 5;

export default function ProductsTable() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";

  const { createUrlWithParams } = useCreateUrlWithParams();

  const { data, isLoading, isError } = useQuery<ProductData, Error>({
    queryKey: ["products-admin", { page: page, limit: PAGE_LIMIT }],
    queryFn: async (): Promise<ProductData> => {
      const response = await axios.get<ProductData>(
        "/api/products/admin/products",
        {
          params: {
            page: page,
            limit: PAGE_LIMIT,
          },
        }
      ); // Fetch the data
      return response.data; // Return the data directly
    },
    placeholderData: keepPreviousData,
  });

  const debounceHandler = useDebounce((e: ChangeEvent<HTMLInputElement>) => {
    createUrlWithParams({ name: "search", value: e.target.value });
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  if (!data) return <div>No data</div>;

  const totalPageCount = Math.ceil(data.total / PAGE_LIMIT);

  return (
    <div className="">
      <DataTable columns={columns} data={data.products} />
      <Input type="text" onChange={debounceHandler} />
      <div>
        <CustomPagination
          page={page}
          totalPageCount={totalPageCount}
          pageLimit={PAGE_LIMIT}
          totalItems={data.total}
        />
      </div>
    </div>
  );
}
