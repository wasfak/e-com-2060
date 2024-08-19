import { Product, ProductImage } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface ExtendedProduct extends Product {
  images: ProductImage[];
}

interface ProductProps {
  product: ExtendedProduct;
}

export default function StoreProductsDisplayer({ product }: ProductProps) {
  return (
    <div className="flex items-center justify-between gap-4 shadow-2xl rounded-xl p-4">
      <div className="">
        {" "}
        <Image
          src={product.images[0].url}
          alt="image"
          width={100}
          height={100}
        />
        <p>{product.name}</p>
      </div>
      <div className="flex items-center justify-center gap-x-8">
        {" "}
        <p>Stock: {product.stock}</p>
        <p>Sold: {product.unitsSold}</p>
      </div>
    </div>
  );
}
