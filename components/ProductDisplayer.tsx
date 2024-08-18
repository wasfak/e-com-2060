"use client";
import { Product, ProductImage } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { CiEdit } from "react-icons/ci";
import { FaTrashArrowUp } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteProduct } from "@/lib/actions/deleteProduct";
import DeleteAlertDialog from "./DeleteAlertDialog";
import { useRouter } from "next/navigation";

interface ExtendedProduct extends Product {
  images: ProductImage[];
}

interface ProductProps {
  product: ExtendedProduct;
}

export default function ProductDisplayer({ product }: ProductProps) {
  const [position, setPosition] = React.useState("bottom");
  const hasDiscount = product.discount && product.discountedPrice !== null;
  const [image, setImage] = useState(product.images[0]?.url);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleDeleteItem = async () => {
    try {
      await deleteProduct(product.id);
      toast.success("Item has been deleted");
      setOpen(false); // Close the dialog after deletion
    } catch (error) {
      toast.error("Failed to delete the item");
      console.error(error);
    }
  };

  return (
    <div className="relative w-[350px] h-full border border-gray-200 shadow-lg p-6 flex flex-col items-center gap-y-4 rounded-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
      {/* On Sale Badge */}
      {hasDiscount && (
        <>
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            On Sale
          </span>
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discountType === "percent"
              ? `${product.discountValue}% OFF`
              : `-$${product.discountValue}`}
          </span>
        </>
      )}

      <div className="flex justify-center items-center w-full h-[250px] mt-2">
        <Image
          src={image}
          alt={product.name}
          className="rounded-md object-cover"
          width={180}
          height={180}
        />
      </div>
      <div className="flex items-start justify-between gap-x-4 cursor-pointer">
        {product.images.map((image, index) => (
          <div key={index}>
            <Image
              src={image.url}
              alt={product.name}
              className="w-20 h-20 rounded-full border-2 border-gray-300"
              width={80}
              height={80}
              onClick={() => {
                setImage(image.url);
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-y-2 w-full text-center">
        <h2 className="text-2xl font-bold text-gray-800 capitalize">
          {product.name}
        </h2>

        {/* Display price with discount if available */}
        <div className="flex items-center justify-between gap-x-2">
          {hasDiscount ? (
            <>
              <span className="text-lg font-semibold text-gray-500 line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-2xl font-bold text-green-600">
                ${product.discountedPrice!.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-2xl font-bold text-gray-800">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <p
            className={`text-lg text-gray-600 ${
              product.stock <= 30 ? "text-red-900" : ""
            }`}
          >
            Stock: {product.stock}
          </p>
          <p className="text-lg text-gray-600">
            Units Sold: {product.unitsSold}
          </p>
        </div>

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem
                  value="edit"
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/dashboard/products/edit/${product.id}`)
                  }
                >
                  <CiEdit className="w-5 h-5 mr-2" />
                  Edit
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem
                  value="delete"
                  onClick={() => setOpen(true)}
                  className="cursor-pointer"
                >
                  <FaTrashArrowUp className="w-5 h-5 mr-2 text-[#FF0000]" />
                  <span className="text-[#FF0000]">Delete</span>
                </DropdownMenuRadioItem>

                <DropdownMenuRadioItem
                  value="view"
                  onClick={() => router.push("/")}
                  className="cursor-pointer"
                >
                  <FaRegEye className="w-5 h-5 mr-2 " />
                  View
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteAlertDialog
            handleDeleteItem={handleDeleteItem}
            open={open}
            setOpen={setOpen} // Pass setOpen to control the dialog from the child component
          />
        </div>
      </div>
    </div>
  );
}
