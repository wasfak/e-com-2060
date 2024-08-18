"use server";

import { auth } from "@clerk/nextjs";
import prisma from "../db/prisma";
import { revalidatePath } from "next/cache";

interface ProductCreateValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  discount?: boolean;
  discountType?: "percent" | "fixed";
  discountValue?: number;
  archive?: boolean;
  categories?: string[];
  images: { url: string }[];
}

export const createProductAction = async (values: ProductCreateValues) => {
  const { userId } = auth();

  if (!userId) {
    return "Error";
  }
  try {
    let discountedPrice: number | null = null;

    if (values.discount && values.discountType && values.discountValue) {
      if (values.discountType === "percent") {
        discountedPrice =
          values.price - values.price * (values.discountValue / 100);
      } else if (values.discountType === "fixed") {
        discountedPrice = values.price - values.discountValue;
      }

      // Ensure discounted price does not go below 0
      if (discountedPrice !== null && discountedPrice < 0) {
        discountedPrice = 0;
      }
    }

    const newProduct = await prisma.product.create({
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        discount: values.discount,
        archive: values.archive,
        discountType: values.discountType,
        discountValue: values.discountValue,
        discountedPrice: discountedPrice, // Store the calculated discounted price or null
        categories: "Men",
        clerkId: userId,
        images: {
          create: values.images.map((image) => ({
            url: image.url,
          })),
        },
      },
    });

    revalidatePath("/dashboard/products");
    return { success: true };
  } catch (error: any) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
};
