"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageInput from "./ImageInput";
import imagePlaceHolder from "@/assets/avatar-placeholder.png";
import { useEffect, useState } from "react";
import { userSchema, UserSchemaValue } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import CustomFormField from "./forms/CustomFormFields";
import { useUpdateProfileMutation } from "@/app/mutation";
import { User } from "@prisma/client";
import { UserDetails } from "@/lib/types";
import { useSession } from "@/providers/SessionProvider";
import { areAllTrue, getPartialUpdatedData } from "@/lib/utils";

type Props = {
  onCloseModal: () => void;
  initialValues: Partial<UserDetails>;
};

export default function EditProfileModal({
  onCloseModal,
  initialValues,
}: Props) {
  const { user } = useSession();
  const [croppedImage, setCroppedImage] = useState<Blob | null>(null);

  const updateProfileMutation = useUpdateProfileMutation();

  const form = useForm<UserSchemaValue>({
    defaultValues: {
      displayName: initialValues.displayName,
      username: initialValues.username,
    },
    resolver: zodResolver(userSchema),
  });

  const handleSetImageToForm = ({
    blob,
    isDirtyForm = true,
  }: {
    blob: Blob;
    isDirtyForm?: boolean;
  }) => {
    form.setValue("avatarBlob", blob, { shouldDirty: isDirtyForm });
  };

  const handleSubmitForm = async (values: UserSchemaValue) => {
    // console.log("values", values);

    let changedFields = {};

    if (initialValues) {
      changedFields = getPartialUpdatedData(initialValues, values);
    }

    console.log("changedFields", changedFields);

    // updateProfileMutation.mutate(
    //   { ...initialValues, id: user?.id },
    //   {
    //     onSuccess: () => {
    //       console.log("success");
    //       onCloseModal();
    //     },
    //   }
    // );
  };

  useEffect(() => {
    const fetchImageBlob = async () => {
      if (initialValues.avatarUrl) {
        try {
          const response = await fetch(initialValues.avatarUrl);
          const blob = await response.blob();
          handleSetImageToForm({ blob, isDirtyForm: false });
          setCroppedImage(blob);
          //   setIsImagePlaceholder(true);
        } catch (error) {
          //   setIsImagePlaceholder(false);
          console.error("Error fetching the image:", error);
        }
      }
    };

    fetchImageBlob();
  }, [initialValues.avatarUrl]);

  return (
    <Dialog open onOpenChange={onCloseModal}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div>
          <div className="size-[10rem] relative">
            <ImageInput
              src={
                croppedImage
                  ? URL.createObjectURL(croppedImage)
                  : imagePlaceHolder
              }
              handleSetImageErrorMessage={(message: string) => {
                form.setError("avatarBlob", { message });
              }}
              onCropedImage={(blob) => {
                //   setIsImagePlaceholder(false);
                if (blob) {
                  handleSetImageToForm({ blob });
                }
                setCroppedImage(blob);
              }}
            />
          </div>
          {form.formState.errors.avatarBlob?.message && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.avatarBlob?.message}
            </p>
          )}
        </div>
        <form
          className="space-y-[1.5rem]"
          onSubmit={form.handleSubmit(handleSubmitForm)}
        >
          <CustomFormField
            control={form.control}
            id="user-username"
            type="text"
            placeholder="Username"
            name="username"
            label="Username"
            error={form.formState.errors.username?.message}
          />
          <CustomFormField
            control={form.control}
            id="user-displayname"
            type="text"
            placeholder="Display Name"
            name="displayName"
            label="Display Name"
            error={form.formState.errors.displayName?.message}
          />
          <DialogFooter>
            <Button
              disabled={updateProfileMutation.isPending}
              type="button"
              variant="destructive"
              onClick={onCloseModal}
            >
              Cancel
            </Button>
            <Button
              isLoading={updateProfileMutation.isPending}
              disabled={
                updateProfileMutation.isPending ||
                !areAllTrue(form.formState.dirtyFields)
              }
              type="submit"
            >
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
