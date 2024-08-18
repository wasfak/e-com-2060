"use client";
import { Product, ProductImage } from "@prisma/client";
import Image from "next/image";
import React, { useState } from "react";

interface ExtendedProduct extends Product {
  images: ProductImage[];
}

interface ProductProps {
  product: ExtendedProduct;
}

export default function ProductDisplayer({ product }: ProductProps) {
  const hasDiscount = product.discount && product.discountedPrice !== null;
  const [image, setImage] = useState(product.images[0]?.url);

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
          src={image} // Fallback if no image is available
          alt={product.name}
          className="rounded-md object-cover"
          width={200}
          height={200}
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
          {" "}
          <p className="text-lg text-gray-600">Stock: {product.stock}</p>
          <p className="text-lg text-gray-600">
            Units Sold: {product.unitsSold}
          </p>
        </div>
      </div>
    </div>
  );
}
