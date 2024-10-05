import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { handleDeleteProductAction } from "./action";
import { ProductData } from "@/lib/types";

export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: handleDeleteProductAction,
    onSuccess: async (deletedProduct) => {
      const queryFilter: QueryFilters = { queryKey: ["products-admin"] };
      queryClient.invalidateQueries(queryFilter);

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<ProductData>(queryFilter, (prevData) => {
        if (!prevData) {
          return;
        }

        return {
          products: prevData.products.filter(
            (product) => product.id !== deletedProduct.id
          ),
          total: prevData.total - 1,
        };
      });
    },
  });

  return mutation;
};
