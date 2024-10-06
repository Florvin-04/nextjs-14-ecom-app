import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useCreateUrlWithParams } from "@/hooks/ueCreateUrlWithParams";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  currentPage: number;
  totalPageCount: number;
  siblingCount: number;
  totalPageToDisplay: number;
};

export default function PaginationNumber({
  currentPage,
  siblingCount,
  totalPageCount,
  totalPageToDisplay,
}: Props) {
  if (totalPageToDisplay >= totalPageCount) {
    return Array.from({ length: totalPageCount }, (_, index) => (
      <PaginationButton
        key={index}
        currentPage={currentPage}
        page={index + 1}
      />
    ));
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(
    currentPage + siblingCount,
    totalPageCount
  );

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPageCount - 2;

  const generatePaginationButtons = (start: number, end: number) =>
    Array.from({ length: end - start + 1 }, (_, index) => (
      <PaginationButton
        key={start + index}
        currentPage={currentPage}
        page={start + index}
      />
    ));

  const generatePagination = () => {
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      return [
        ...generatePaginationButtons(1, leftItemCount),
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
        <PaginationButton
          key={totalPageCount}
          currentPage={currentPage}
          page={totalPageCount}
        />,
      ];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      return [
        <PaginationButton key={1} currentPage={currentPage} page={1} />,
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
        ...generatePaginationButtons(
          totalPageCount - rightItemCount + 1,
          totalPageCount
        ),
      ];
    }

    if (showLeftDots && showRightDots) {
      return [
        <PaginationButton key={1} currentPage={currentPage} page={1} />,
        <PaginationItem key="ellipsis-start">
          <PaginationEllipsis />
        </PaginationItem>,
        ...generatePaginationButtons(leftSiblingIndex, rightSiblingIndex),
        <PaginationItem key="ellipsis-end">
          <PaginationEllipsis />
        </PaginationItem>,
        <PaginationButton
          key={totalPageCount}
          currentPage={currentPage}
          page={totalPageCount}
        />,
      ];
    }
  };

  return generatePagination();
}

type PageNumberProps = {
  currentPage: number;
  page: number;
};

function PaginationButton({ currentPage, page }: PageNumberProps) {
  const { createUrlWithParams } = useCreateUrlWithParams();

  return (
    <Button
      className={cn(
        "transition-colors duration-100"
        // currentPage === page && "bg-red-500"
      )}
      variant="ghost"
      size="icon"
      asChild
      key={1}
      onClick={() => {
        createUrlWithParams({
          name: "page",
          value: `${page}`,
        });
      }}
    >
      <PaginationItem className="relative isolate z-20 focus:bg-transparent hover:bg-transparent">
        {currentPage === page && (
          <motion.div className="bg-red-500 flex justify-center items-center  absolute top-0 left-0 w-full h-full text-white">
            {page}
          </motion.div>
        )}
        <PaginationLink
          className={cn(
            "focus:bg-transparent hover:bg-transparent",
            // currentPage === page && "text-transparent"
          )}
        >
          {page}
        </PaginationLink>
      </PaginationItem>
    </Button>
  );
}
