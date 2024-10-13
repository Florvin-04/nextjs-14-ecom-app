import { useMutation } from "@tanstack/react-query";

import { UserSchemaValue } from "@/lib/validation";
import { handleUpdateProfileAction } from "./action";
import { toast } from "sonner";
import { createNewFileFromBlob } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useUploadThing } from "@/lib/uploadthing";

export function useUpdateProfileMutation() {
  const router = useRouter();

  const { startUpload: startUploadAvatar } = useUploadThing("userAvatar");

  const mutation = useMutation({
    mutationFn: async (
      updatedData: Partial<UserSchemaValue> & { id: string }
    ) => {
      const { avatarBlob, ...restUpdatedData } = updatedData;

      console.log("restUpdatedData", updatedData);

      let avatarUrl = "";

      if (avatarBlob) {
        const convertedImage = createNewFileFromBlob({
          blob: avatarBlob,
          fileName: `${updatedData.id.slice(-5)}_Avatar_image.webp`,
          type: "image/webp",
        });

        console.log("convertedImage", convertedImage);

        const uploadedAvatar = await startUploadAvatar([convertedImage], {});

        avatarUrl = uploadedAvatar?.[0].serverData.fileUrl || "";
      }

      console.log("avatarUrl", avatarUrl);

      return await handleUpdateProfileAction({ ...restUpdatedData, avatarUrl });
    },

    onSuccess: async () => {
      router.refresh();
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
