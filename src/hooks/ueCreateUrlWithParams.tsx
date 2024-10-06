import { useRouter, useSearchParams } from "next/navigation";

export const useCreateUrlWithParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const createUrlWithParams = ({
    name,
    value,
  }: {
    name: string;
    value: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim() === "") {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.push(`?${params.toString()}`);
  };

  return {
    createUrlWithParams,
  };
};
