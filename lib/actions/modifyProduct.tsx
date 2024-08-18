"use server";
import prisma from "../db/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

interface UpdateProductValues {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount?: boolean;
  discountType?: "percent" | "fixed";
  discountValue?: number;
  archive?: boolean;
  images: { url: string }[];
}

export const updateProductAction = async (values: UpdateProductValues) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Ensure the product belongs to the logged-in user
    const product = await prisma.product.findFirst({
      where: {
        id: values.id,
        clerkId: userId,
      },
    });

    if (!product) {
      throw new Error(
        "Product not found or you do not have permission to edit it."
      );
    }

    // Update the product with the new values
    const updatedProduct = await prisma.product.update({
      where: { id: values.id },
      data: {
        name: values.name,
        description: values.description,
        price: values.price,
        stock: values.stock,
        discount: values.discount,
        discountType: values.discountType,
        discountValue: values.discountValue,
        archive: values.archive,
        images: {
          deleteMany: {}, // Delete old images
          create: values.images.map((image) => ({ url: image.url })), // Add new images
        },
      },
    });
    revalidatePath("/dashboard/products");
    return { success: true, product: updatedProduct };
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
};
