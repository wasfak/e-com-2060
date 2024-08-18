"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  link: string;
};

export default function But({ link }: Props) {
  console.log(link);

  const router = useRouter();
  return <Button onClick={() => router.push(link)}>Add Item</Button>;
}
