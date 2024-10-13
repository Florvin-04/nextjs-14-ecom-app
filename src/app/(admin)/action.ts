"use server";

import { validateRequest } from "@/auth";
import { replaceUploadThingUrl } from "@/lib/constant";
import prisma from "@/lib/prisma";
import {
  AddProductActionValue,
  addProductSchema,
  UpdateProductValue,
} from "@/lib/validation";
import { UTApi } from "uploadthing/server";

export const handleAddProductAction = async (values: AddProductActionValue) => {
  const { user } = await validateRequest();

  if (!user || !user.role.ADMIN) throw new Error("Unauthorized");

  const { category, description, name, price, stock } =
    addProductSchema.parse(values);

  const product = await prisma.product.create({
    data: {
      category,
      description,
      imagesUrl: values.imageUrl,
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

export const handleUpdateProductAction = async (
  values: Partial<UpdateProductValue> & { id: string }
) => {
  const { user } = await validateRequest();

  if (!user || !user.role.ADMIN) throw new Error("Unauthorized");

  console.log("values action", values);

  // const { startUpload: startUploadProductImage } =
  //   useUploadThing("productImage");

  const {
    price: updatedPrice,
    stock: updatedStock,
    ...restUpdatedParesedData
  } = addProductSchema.partial().parse(values);

  const product = await prisma.product.findUnique({
    where: {
      id: values.id,
    },
  });

  const productImage = product?.imagesUrl;

  // const url =
  //   "https://utfs.io/a/typjct709h/z7ItsVnX7pnihMkXpvecXgoCIbLWsi1duU0Tt8EkfHJBMRwa";
  // result z7ItsVnX7pnihMkXpvecXgoCIbLWsi1duU0Tt8EkfHJBMRwa

  const imageUploadthigKey = productImage?.split(replaceUploadThingUrl)[1];

  if (imageUploadthigKey && values.imageUrl) {
    await new UTApi().deleteFiles(imageUploadthigKey);
  }

  const updatedProduct = await prisma.product.update({
    where: { id: values.id },
    data: {
      ...restUpdatedParesedData,

      ...(values.imageUrl && { imagesUrl: values.imageUrl }),

      ...(updatedPrice && {
        price: Number(updatedPrice),
      }),

      ...(updatedStock && {
        stock: Number(updatedStock),
      }),
    },
  });

  return updatedProduct;
};
