import { validateRequest } from "@/auth";
import { replaceUploadThingUrl } from "@/lib/constant";

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const inputUploadthingSchema = z.object({
  userId: z.string().optional(),
  description: z.string().optional(),
});

const f = createUploadthing();

const userValidateMiddleware = async (
  input: z.infer<typeof inputUploadthingSchema>
) => {
  const { user } = await validateRequest();

  if (!user) throw new UploadThingError("Unathorized");

  return { user, input };
};

export const fileRouter = {
  productImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
  })
    .input(inputUploadthingSchema)
    .middleware(({ input }) => {
      return userValidateMiddleware(input);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log({ file, input: metadata.input });
      const newFileUrl = file.url.replace("/f/", `${replaceUploadThingUrl}`);
      console.log("Upload complete for userId:", metadata.user.username);

      console.log("file url", newFileUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { fileUrl: newFileUrl };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
