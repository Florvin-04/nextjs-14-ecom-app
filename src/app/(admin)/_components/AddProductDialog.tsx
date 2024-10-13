import imagePlaceHolder from "@/assets/avatar-placeholder.png";
import CustomFormField from "@/components/custom/forms/CustomFormFields";
import ImageInput from "@/components/custom/ImageInput";
import SelectOptionItems from "@/components/custom/SelectItems";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getPartialUpdatedData,
  readableFormatNumber,
  readableLargeNumber,
} from "@/lib/utils";
import {
  AddProductActionValue,
  addProductSchema,
  AddProductType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../admin/products/mutation";

type Props = {
  onClose: () => void;
  transaction: "edit" | "add";
  productInitialValues?: AddProductActionValue & { id: string };
};

const categories = [
  { value: "men", displayName: "Men" },
  { value: "women", displayName: "Women" },
];

export default function AddProductDialog({
  onClose,
  transaction,
  productInitialValues,
}: Props) {
  const { imageUrl, ...restInitalValues } = productInitialValues || {};
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);
  const [isImagePlaceholder, setIsImagePlaceholder] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState("");

  const mutation = useAddProductMutation();
  const updateMutation = useUpdateProductMutation();

  const form = useForm<AddProductType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      ...restInitalValues,

      // ...(transaction === "edit" && restInitalValues),
    },
  });

  const handleSetImageErrorMessage = (message: string) => {
    setImageErrorMessage(message);
  };

  const handleSubmitForm = async (values: AddProductType) => {
    if (!croppedImage) return;

    if (transaction === "add") {
      mutation.mutate(
        {
          ...values,
          imageBlob: croppedImage,
        },
        {
          onSuccess: () => {
            onClose();
            setCroppedImage(null);
          },
        }
      );
    }

    if (transaction === "edit") {
      // const changedFields = Object.keys(values).reduce((acc, key) => {
      //   const typedKey = key as keyof AddProductType;
      //   // console.log(values[typedKey] !== productInitialValues?.[typedKey]);

      //   if (values[typedKey] !== productInitialValues?.[typedKey]) {
      //     acc[typedKey] = values[typedKey];
      //   }
      //   return acc;
      // }, {} as Partial<AddProductType>);

      let changedFields = {};

      if (productInitialValues) {
        changedFields = getPartialUpdatedData(productInitialValues, values);
      }

      // console.log("Changed fields:", changedFields);

      updateMutation.mutate(
        {
          ...changedFields,
          ...(!isImagePlaceholder && { imageBlob: croppedImage }),
          id: productInitialValues?.id || "",
        },
        {
          onSuccess: () => {
            onClose();
            setCroppedImage(null);
          },
        }
      );
    }
  };

  useEffect(() => {
    const fetchImageBlob = async () => {
      if (imageUrl) {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          setCroppedImage(blob);
          setIsImagePlaceholder(true);
        } catch (error) {
          setIsImagePlaceholder(false);
          console.error("Error fetching the image:", error);
        }
      }
    };

    fetchImageBlob();
  }, [imageUrl]);

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-h-[90svh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>
            {transaction === "add" ? "Add" : "Edit"} Product
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="size-[10rem] relative">
            <ImageInput
              src={
                croppedImage
                  ? URL.createObjectURL(croppedImage)
                  : imagePlaceHolder
                // : user.avatarUrl || avatarPlaceHolder
              }
              handleSetImageErrorMessage={handleSetImageErrorMessage}
              onCropedImage={(blob) => {
                setIsImagePlaceholder(false);
                setCroppedImage(blob);
              }}
            />
          </div>
          {imageErrorMessage && (
            <p className="text-red-500 text-sm">{imageErrorMessage}</p>
          )}
        </div>

        <form
          onSubmit={form.handleSubmit(handleSubmitForm)}
          className="px-3 py-2 space-y-3"
        >
          <CustomFormField
            control={form.control}
            id="product-name"
            type="text"
            placeholder="Product Name"
            name="name"
            label="Product Name"
            error={form.formState.errors.name?.message}
          />

          <CustomFormField
            control={form.control}
            id="product-description"
            type="textarea"
            placeholder="Product Description"
            name="description"
            label="Product Description"
            error={form.formState.errors.description?.message}
          />

          <CustomFormField
            control={form.control}
            id="product-category"
            type="select"
            placeholder="Product Category"
            name="category"
            label="Product Category"
            error={form.formState.errors.category?.message}
          >
            <SelectOptionItems items={categories} />
          </CustomFormField>

          <div className="grid grid-cols-2 gap-4">
            <div className="">
              <CustomFormField
                control={form.control}
                id="product-price"
                type="number"
                placeholder="Product Price"
                name="price"
                label="Product Price"
                error={form.formState.errors.price?.message}
              />
              {form.watch("price") && (
                <div className="overflow-x-auto py-[.5rem]">
                  <p className="text-muted-foreground text-sm">
                    {readableFormatNumber(form.watch("price"))}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {readableLargeNumber(form.watch("price"))}
                  </p>
                </div>
              )}
            </div>

            <div>
              <CustomFormField
                control={form.control}
                id="product-stock"
                type="number"
                placeholder="Product Stock"
                name="stock"
                label="Product Stock"
                error={form.formState.errors.stock?.message}
              />
              {form.watch("stock") && (
                <div className="overflow-x-auto py-[.5rem]">
                  <p className="text-muted-foreground text-sm">
                    {readableFormatNumber(form.watch("stock"))}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {readableLargeNumber(form.watch("stock"))}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* <div className="mt-3">
            <Button className="w-full">Submit</Button>
          </div> */}

          <DialogFooter>
            <Button
              isLoading={mutation.isPending || updateMutation.isPending}
              disabled={
                mutation.isPending ||
                updateMutation.isPending ||
                (!form.formState.isDirty && isImagePlaceholder)
              }
              onClick={() => {
                if (!croppedImage) {
                  setImageErrorMessage("Image is required");
                }
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
