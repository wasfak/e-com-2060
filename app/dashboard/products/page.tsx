import But from "@/components/But";
import ProductDisplayer from "@/components/ProductDisplayer";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import React from "react";

export default async function ProductsPage() {
  const { userId } = auth();
  if (!userId) {
    return <div>Not Authorized</div>;
  }
  const products = await prisma.product.findMany({
    where: {
      archive: false,
      clerkId: userId,
    },
    include: {
      images: true,
    },
  });
  if (products.length === 0) {
    return (
      <div>
        <p>No Items</p>
        <But link="products/new" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {products.map((product) => (
        <ProductDisplayer key={product.id} product={product} />
      ))}
    </div>
  );
}
