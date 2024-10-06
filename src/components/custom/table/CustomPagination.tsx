import {
  PaginationContent,
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import PaginationNumber from "./PaginationNumber";
import { useCreateUrlWithParams } from "@/hooks/ueCreateUrlWithParams";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  page: string;
  totalPageCount: number;
  pageLimit: number;
  totalItems: number;
};

export default function CustomPagination({
  page,
  totalPageCount,
  pageLimit,
  totalItems,
}: Props) {
  const { createUrlWithParams } = useCreateUrlWithParams();
  return (
    <Pagination>
      <PaginationContent>
        <Button
          className={cn(
            "",
            Number(page) <= 1 && "pointer-events-none opacity-50"
          )}
          variant="ghost"
          asChild
          // key={newIndex}

          onClick={() => {
            createUrlWithParams({
              name: "page",
              value: `${Number(page) - 1}`,
            });
          }}
        >
          <PaginationItem>
            <PaginationPrevious />
          </PaginationItem>
        </Button>

        <PaginationNumber
          currentPage={Number(page)}
          totalPageCount={totalPageCount}
          siblingCount={1}
          totalPageToDisplay={7}
        />
        <Button
          className={cn(
            "",
            Number(page) >= Math.ceil(totalItems / pageLimit) &&
              "pointer-events-none opacity-50"
          )}
          variant="ghost"
          asChild
          // key={newIndex}

          onClick={() => {
            createUrlWithParams({
              name: "page",
              value: `${Number(page) + 1}`,
            });
          }}
        >
          <PaginationItem>
            <PaginationNext />
          </PaginationItem>
        </Button>
      </PaginationContent>
    </Pagination>
  );
}
