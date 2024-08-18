import But from "@/components/But";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import React from "react";

export default async function CategoriesPage() {
  const { userId } = auth();

  if (!userId) {
    return <h1>No NO</h1>;
  }

  const categories = await prisma.category.findMany({
    where: {
      clerkId: userId,
    },
  });

  if (categories.length === 0) {
    return (
      <h1>
        <But link="dashboard/categories/new" />
      </h1>
    );
  }

  return (
    <div>
      {categories.map((cate) => (
        <p key={cate.id}>{cate.name}</p>
      ))}
    </div>
  );
}
