import { fileTypeChecker } from "@/lib/utils";
import { Camera } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { ChangeEvent, useState } from "react";
import Resizer from "react-image-file-resizer";
import CropImageDialog from "./CropImageDialog";

type Props = {
  onCropedImage: (blob: Blob | null) => void;
  src: string | StaticImageData;
  handleSetImageErrorMessage: (message: string) => void;
};

export default function ImageInput({
  onCropedImage,
  src,
  handleSetImageErrorMessage,
}: Props) {
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
