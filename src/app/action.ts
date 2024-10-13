"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { userSchema } from "@/lib/validation";
import { User } from "@prisma/client";

export const handleUpdateProfileAction = async (updatedData: Partial<User>) => {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { avatarBlob, ...restUpdatedData } = userSchema
    .partial()
    .parse(updatedData);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      ...restUpdatedData,
      ...(updatedData.avatarUrl && { avatarUrl: updatedData.avatarUrl }),
    },
  });

  return updatedUser;
};
