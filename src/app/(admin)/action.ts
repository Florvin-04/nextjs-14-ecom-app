"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { AddProductActionValue } from "@/lib/validation";

export const handleAddProductAction = async (values: AddProductActionValue) => {
  const { user } = await validateRequest();

  if (!user || !user.role.ADMIN) throw new Error("Unauthorized");

  const { category, description, name, price, stock, imageUrl } = values;

  const product = await prisma.product.create({
    data: {
      category,
      description,
      imagesUrl: imageUrl,
      name,
      price: Number(price),
      stock: Number(stock),
    },
  });

  return product;
};

export const handleDeleteProductAction = async (id: string) => {
  const { user } = await validateRequest();

  if (!user || !user.role.ADMIN) throw new Error("Unauthorized");

  const product = await prisma.product.delete({
    where: { id },
  });

  return product;
};
