/* eslint-disable @typescript-eslint/no-unused-vars */
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ProductData } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();

    if (!user || !user.role.ADMIN) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const page = req.nextUrl.searchParams.get("page") || "1";
    const limit = req.nextUrl.searchParams.get("limit") || "5";
    const search = req.nextUrl.searchParams.get("search") || "";

    const searchQuery = search.split(" ").join(" & ");

    // const products = await prisma.product.findMany({
    //   take: 5,
    // });

    // const productsCount = await prisma.product.count();

    // ********************************

    //* transaction for better performance. This will run in a single query if one fails, the other will fail too

    // ********************************

    const searchIncludes: Prisma.ProductWhereInput[] = [
      {
        name: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: searchQuery,
          mode: "insensitive",
        },
      },
    ];

    const [products, productsCount] = await prisma.$transaction([
      prisma.product.findMany({
        where: {
          OR: searchIncludes,
        },
        take: Number(limit),
        skip: (Number(page) - 1) * Number(limit),
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.product.count({
        where: {
          OR: searchIncludes,
        },
      }),
    ]);

    const data: ProductData = {
      products,
      total: productsCount,
      page: Number(page),
      limit: 5,
    };

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
