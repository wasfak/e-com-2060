"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
// This type defines the shape of our data.
export type Products = {
  id: string;
  name: string;
  image: string;
  stock: number;
  unitsSold: number;
};

export const columns: ColumnDef<Products>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original.image}
        alt={row.original.name}
        className="w-16 h-16 rounded"
        width={50}
        height={50}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="p-0"
        >
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "unitsSold",
    header: ({ column }) => {
      return (
        <div className="flex items-start justify-items-start ">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0"
          >
            Units Sold
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
