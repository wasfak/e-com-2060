import React from "react";
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/db/prisma";
import But from "@/components/But";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function StorePage() {
  const { userId } = await auth(); // Await auth as it is an async function.

  if (!userId) {
    return <div>Not Authorized</div>;
  }

  const products = await prisma.product.findMany({
    where: {
      archive: false,
      clerkId: userId,
    },
    select: {
      id: true,
      name: true,
      stock: true,
      unitsSold: true,
      images: {
        select: {
          url: true,
        },
      },
    },
  });

  // Get the main image for each product
  const productData = products.map((product) => ({
    id: product.id,
    name: product.name,
    stock: product.stock,
    unitsSold: product.unitsSold,
    image: product.images[0]?.url,
  }));

  if (productData.length === 0) {
    return (
      <div>
        <p>No Items</p>
        <But link="products/new" />
      </div>
    );
  }

  return (
    <div className="flex gap-y-4 items-start justify-start">
      <DataTable columns={columns} data={productData} />
    </div>
  );
}
