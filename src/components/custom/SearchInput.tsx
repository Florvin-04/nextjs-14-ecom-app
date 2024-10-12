"use client";

import useDebounce from "@/hooks/useDebounce";
import { Input } from "../ui/input";
import { ChangeEvent } from "react";
import { useCreateUrlWithParams } from "@/hooks/ueCreateUrlWithParams";

type Props = {
  disableParams?: boolean;
  result?: ({ value }: { value: string }) => void;
};

export default function SearchInput({ disableParams = false, result }: Props) {
  const { createUrlWithParams } = useCreateUrlWithParams();

  const onChangeWithDebounce = useDebounce(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!disableParams) {
        createUrlWithParams({ name: "search", value: e.target.value });
      }
      result && result({ value: e.target.value });
    },
    500
  );

  return (
    <Input placeholder="Search" type="text" onChange={onChangeWithDebounce} />
  );
}
