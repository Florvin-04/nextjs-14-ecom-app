import imagePlaceHolder from "@/assets/avatar-placeholder.png";
import CropImageDialog from "@/components/custom/CropImageDialog";
import CustomFormField from "@/components/custom/forms/CustomFormFields";
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
  fileTypeChecker,
  readableFormatNumber,
  readableLargeNumber,
} from "@/lib/utils";
import {
  AddProductActionValue,
  addProductSchema,
  AddProductType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Resizer from "react-image-file-resizer";
import {
  useAddProductMutation,
  useUpdateProductMutation,
} from "../admin/products/mutation";
import { memo } from "react";

type Props = {
  onClose: () => void;
  transaction: "edit" | "add";
  productInitialValues?: AddProductActionValue & { id: string };
};

const categories = [
  { value: "men", displayName: "Men" },
  { value: "women", displayName: "Women" },
];

export default memo(function AddProductDialog({
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
      const changedFields = Object.keys(values).reduce((acc, key) => {
        const typedKey = key as keyof AddProductType;
        // console.log(values[typedKey] !== productInitialValues?.[typedKey]);

        if (values[typedKey] !== productInitialValues?.[typedKey]) {
          acc[typedKey] = values[typedKey];
        }
        return acc;
      }, {} as Partial<AddProductType>);

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
            <AddProductImage
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
});

type AddProductImageProps = {
  src: string | StaticImageData;
  onCropedImage: (blob: Blob | null) => void;
  handleSetImageErrorMessage: (message: string) => void;
};

function AddProductImage({
  onCropedImage,
  src,
  handleSetImageErrorMessage,
}: AddProductImageProps) {
  const [imageToCrop, setImageToCrop] = useState<File>();

  const handleSetFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const isValidFile = fileTypeChecker({
      file,
      extensionNames: ["jpg", "png", "webp"],
    });

    if (!isValidFile) {
      handleSetImageErrorMessage("Invalid file type");
      console.log("Invalid file type");
      return;
    }

    handleSetImageErrorMessage("");

    // console.log({ file });
    handleChangeImage(file);
  };

  const handleChangeImage = (image: File) => {
    if (!image) return;

    // This function resizes the image file to a maximum size of 1024x1024 pixels,
    // converts it to WEBP format with 100% quality, and sets the result as the image to crop.

    // The '0' parameter indicates no rotation is needed. The callback function sets the resized image URI as a File.
    Resizer.imageFileResizer(
      // The image file to be resized
      image,
      // Maximum width of the resized image
      1024,
      // Maximum height of the resized image
      1024,
      // The format to convert the image to
      "WEBP",
      // The quality of the resized image
      100,
      // The rotation angle in degrees (0 means no rotation)
      0,
      // Callback function to handle the resized image URI
      (uri) => setImageToCrop(uri as File),
      // The type of the output (in this case, a file)
      "file"
    );
  };

  const handleDropImage = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;

    // this return all files with status of true or false
    // const arrayOfFiles = Array.from(files);
    // const validFiles = arrayOfFiles.map((file) => {
    //   return {
    //     file,
    //     status: fileTypeChecker({
    //       file,
    //       extensionNames: ["jpg", "png", "webp"],
    //     }),
    //   };
    // });

    const isValidFile = fileTypeChecker({
      file: files[0],
      extensionNames: ["jpg", "png", "webp"],
    });

    if (!isValidFile) {
      console.log("Invalid file type");
      return;
    }

    handleChangeImage(files[0]);
  };

  return (
    <>
      <label className="absolute top-0 group size-full cursor-pointer rounded-[.5rem]">
        <Image
          className="size-full flex-none object-cover"
          src={src}
          alt="Product Preview"
          width={150}
          height={150}
        />
        <span
          className="absolute inset-0 flex justify-center items-center rounded-[.5rem] bg-black/10 opacity-30 transition-all duration-300 group-hover:opacity-50"
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={handleDropImage}
        >
          <Camera size={34} />
        </span>
        <input hidden value="" type="file" onChange={handleSetFile} />
      </label>

      {imageToCrop && (
        <CropImageDialog
          src={URL.createObjectURL(imageToCrop)}
          cropAspectRatio={1}
          onCropped={(blob) => {
            onCropedImage(blob);
          }}
          onClosed={() => {
            setImageToCrop(undefined);
          }}
        />
      )}
    </>
  );
}
