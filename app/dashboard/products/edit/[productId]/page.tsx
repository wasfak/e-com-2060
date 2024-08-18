import EditProductForm from "@/components/EditProduct";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import React from "react";

interface EditProductPageProps {
  params: {
    productId: string;
  };
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { userId } = auth();
  if (!userId) {
    return <h1>Error: Unauthorized</h1>;
  }

  const product = await prisma.product.findFirst({
    where: {
      clerkId: userId,
      id: params.productId, // Access the productId from params
    },
    include: {
      images: true, // Include related images if needed
    },
  });

  if (!product) {
    return <h1>Product Not Found</h1>;
  }

  // Map the product data to match the structure expected by the form
  const productData = {
    id:product.id,
    name: product.name,
    description: product.description ?? "",
    price: product.price,
    stock: product.stock,
    archive: product.archive,
    images: product.images.map((img) => ({ url: img.url })),
    discount: product.discount,
    discountType: product.discountType as "percent" | "fixed",
    discountValue: product.discountValue ?? undefined,
  };

  return (
    <div>
      <h1>Edit Product: {product.name}</h1>

      <EditProductForm product={productData} />
    </div>
  );
}
