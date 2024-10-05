/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { ProductData } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user || !user.role.ADMIN) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const products = await prisma.product.findMany();

    const data: ProductData = {
      products,
      total: products.length,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
