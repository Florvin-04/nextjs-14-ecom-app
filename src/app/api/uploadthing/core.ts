import { validateRequest } from "@/auth";
import { replaceUploadThingUrl } from "@/lib/constant";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const userValidateMiddleware = async () => {
  const { user } = await validateRequest();

  if (!user) throw new UploadThingError("Unathorized");

  return { user };
};

export const fileRouter = {
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .middleware(userValidateMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      const newFileUrl = file.url.replace("/f/", `${replaceUploadThingUrl}`);
      console.log("Upload complete for userId:", metadata.user.username);

      console.log("file url", newFileUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileUrl: newFileUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
