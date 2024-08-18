"use server";

import { auth } from "@clerk/nextjs";
import prisma from "../db/prisma";
import { revalidatePath } from "next/cache";

export const deleteProduct = async (id: string) => {
  const { userId } = auth();
  if (!userId) {
    return "Error: Not Authorized";
  }

  try {
    // First, ensure that the product exists and belongs to the authenticated user
    const product = await prisma.product.findFirst({
      where: {
        id: id,
        clerkId: userId,
      },
      include: {
        images: true, // Include the images to delete them later
      },
    });

    if (!product) {
      return "Error: Product not found or unauthorized";
    }

    // Delete the related images first
    await prisma.productImage.deleteMany({
      where: {
        productId: id,
      },
    });

    // Delete the product itself
    await prisma.product.delete({
      where: {
        id: id,
      },
    });

    revalidatePath("/dashboard/products");
    return "Product and its images deleted successfully";
  } catch (error) {
    console.error("Error deleting product:", error);
    return "Error deleting product";
  }
};
