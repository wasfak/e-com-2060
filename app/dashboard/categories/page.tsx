import But from "@/components/But";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import React from "react";

export default async function CategoriesPage() {
  const { userId } = auth();

  if (!userId) {
    return <h1>No NO</h1>;
  }



  return (
    <div>
      <h1>Categories</h1>
    </div>
  );
}
