import { useRef } from "react";
import { Cropper, ReactCropperElement } from "react-cropper";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogHeader,
} from "../ui/dialog";
import { Button } from "../ui/button";
import "cropperjs/dist/cropper.css";

type Props = {
  src: string;
  cropAspectRatio: number;
  onCropped: (blob: Blob | null) => void;
  onClosed: () => void;
};

export default function CropImageDialog({
  cropAspectRatio,
  onClosed,
  onCropped,
  src,
}: Props) {
  const cropperRef = useRef<ReactCropperElement>(null);

  // This function is called when the user clicks the "Crop" button.
  // It retrieves the Cropper instance from the ref and checks if it exists.
  const crop = () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return; // If the cropper instance is not found, exit the function.
    // This line gets the cropped canvas and converts it to a blob.
    // The blob is then passed to the onCropped callback function.
    // The second argument "image/webp" specifies the MIME type of the blob.
    cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), "image/webp");
    // This line calls the onClosed callback function to close the dialog.
    onClosed();
  };

  return (
    <Dialog open onOpenChange={onClosed}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70svh] overflow-y-auto">
          <Cropper
            src={src}
            aspectRatio={cropAspectRatio}
            guides={false}
            zoomable={false}
            ref={cropperRef}
            className="mx-auto size-fit"
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClosed}>
            Cancel
          </Button>
          <Button onClick={crop}>Crop</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
