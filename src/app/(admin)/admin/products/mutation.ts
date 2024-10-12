import { ProductData } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { createNewFileFromBlob } from "@/lib/utils";
import { AddProductType, UpdateProductValue } from "@/lib/validation";
import {
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  handleAddProductAction,
  handleUpdateProductAction,
} from "../../action";

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

      const uploadedImage = await startUploadProductImage([convertedImage], {
        description: "desc from uploadthing client pass",
      });

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
          products: [value, ...prevData.products],
          total: prevData.total + 1,
          page: prevData.page,
          limit: prevData.limit,
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

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  const { startUpload: startUploadProductImage } =
    useUploadThing("productImage");

  const mutation = useMutation({
    mutationFn: async (value: Partial<UpdateProductValue> & { id: string }) => {
      const { imageBlob, ...rest } = value;

      let imageUrl;

      // const convertedImage = createNewFileFromBlob({
      //   blob: imageBlob!,
      //   fileName: "product-image.webp",
      //   type: "image/webp",
      // });

      if (imageBlob) {
        const convertedImage = createNewFileFromBlob({
          blob: imageBlob!,
          fileName: "product-image.webp",
          type: "image/webp",
        });

        imageUrl = await startUploadProductImage([convertedImage], {});
      }

      // console.log({ convertedImage });

      // const inputParameters = {
      //   userId: "your-user-id", // Optional
      //   description: "Image description here", // Optional
      // };

      // const uploadedImage = await startUploadProductImage(
      //   [convertedImage],
      //   inputParameters
      // );

      // console.log({
      //   uploadedImage,
      //   value,
      //   asd: uploadedImage?.[0].serverData.fileUrl,
      // });

      return await handleUpdateProductAction({
        ...rest,
        imageUrl: imageUrl?.[0].serverData.fileUrl || "",
        id: value.id,
      });
    },

    onSuccess: async (value) => {
      const { id: updateId, ...restIpdatedValue } = value;
      const queryFilter: QueryFilters = { queryKey: ["products-admin"] };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<ProductData>(queryFilter, (prevData) => {
        if (!prevData) {
          return;
        }

        return {
          total: prevData.total,
          page: prevData.page,
          limit: prevData.limit,

          products: prevData.products.map((product) => {
            const { id: productId } = product;
            if (updateId === productId) {
              return {
                ...product,
                ...restIpdatedValue,
              };
            }
            return product;
          }),
        };
      });

      // toast.success("Product Added Successfully", {
      //   description: `${value.name} added successfully`,
      //   action: {
      //     label: "Undo",
      //     onClick: () => console.log("View"),
      //   },
      // });
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
