"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = {
  link: string;
};

export default function But({ link }: Props) {


  const router = useRouter();
  return <Button className="mb-2" onClick={() => router.push(link)}>Add Item</Button>;
}
