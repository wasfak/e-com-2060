import { auth } from "@clerk/nextjs";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const user = await currentUser();

  return (
    <div>
      <p className="capitalize">welcome {user?.firstName}</p>
    </div>
  );
}
