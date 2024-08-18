"use server";

import prisma from "../db/prisma";

interface CreateCategoryInput {
  categories: string[];
  clerkId: string;
}

export async function createCategory({
  categories,
  clerkId,
}: CreateCategoryInput) {
  const categoryRecords = await Promise.all(
    categories.map(async (categoryName) => {
      let category = await prisma.category.findUnique({
        where: {
          clerkId_name: {
            clerkId,
            name: categoryName,
          },
        },
      });

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            slug: categoryName.toLowerCase(),
            clerkId,
          },
        });
      }

      return category;
    })
  );

  return categoryRecords;
}
