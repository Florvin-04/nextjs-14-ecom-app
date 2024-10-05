import { ProductData } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { createNewFileFromBlob } from "@/lib/utils";
import { AddProductType } from "@/lib/validation";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { handleAddProductAction } from "../../action";

export function useAddProductMutation() {
  const queryClient = useQueryClient();

  const { startUpload: startUploadProductImage } =
    useUploadThing("productImage");
  const mutation = useMutation({
    mutationFn: async (value: AddProductType & { imageBlob: Blob }) => {
      const { imageBlob, ...rest } = value;
      const convertedImage = createNewFileFromBlob({
        blob: imageBlob,
        fileName: "product-image.webp",
        type: "image/webp",
      });

      const uploadedImage = await startUploadProductImage([convertedImage]);

      // console.log({
      //   uploadedImage,
      //   value,
      //   asd: uploadedImage?.[0].serverData.fileUrl,
      // });

      return await handleAddProductAction({
        ...rest,
        imageUrl: uploadedImage?.[0].serverData.fileUrl || "",
      });
    },

    onSuccess: async (value) => {
      const queryFilter: QueryFilters = { queryKey: ["products-admin"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<ProductData>(queryFilter, (prevData) => {
        if (!prevData) {
          return;
        }

        return {
          products: [...prevData.products, value],
          total: prevData.total + 1,
        };
      });

      toast.success("Product Added Successfully", {
        description: `${value.name} added successfully`,
        action: {
          label: "Undo",
          onClick: () => console.log("View"),
        },
      });
    },

    onError: (error) => {
      toast.error("Something Went Wrong", {
        duration: Infinity,
        description: error.message,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
    },
  });

  return mutation;
}
