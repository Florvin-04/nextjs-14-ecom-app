import { AddProductType } from "@/lib/validation";
import { useMutation } from "@tanstack/react-query";
import { handleAddProductAction } from "../../action";
import { toast } from "sonner";
import { createNewFileFromBlob } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

export function useAddProductMutation() {
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

      console.log({
        uploadedImage,
        value,
        asd: uploadedImage?.[0].serverData.fileUrl,
      });

      return await handleAddProductAction({
        ...rest,
        imageUrl: uploadedImage?.[0].serverData.fileUrl || "",
      });
    },

    onSuccess: (value) => {
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
