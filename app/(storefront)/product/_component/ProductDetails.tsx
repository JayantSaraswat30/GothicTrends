"use client";

import React, { useState } from 'react';
import { StarIcon } from "lucide-react";
import { ImageSlider } from "@/components/storefront/ImageSlider";
import { addItem } from "@/app/action";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingBagButton } from "@/components/SubmitButtons";

interface ProductDetailsProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    sizes: {
      id: string;
      name: string;
      stock: number;
    }[];
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async (formData: FormData) => {
    formData.append('quantity', quantity.toString());
    await addItem(formData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-6">
      <ImageSlider images={product.images} />
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {product.name}
        </h1>
        <p className="text-3xl mt-2 text-gray-900">${product.price}</p>
        <div className="mt-3 flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <StarIcon key={index} className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          ))}
        </div>
        <p className="text-base text-gray-700 mt-6">{product.description}</p>
        
        <form action={handleAddToCart}>
          <input type="hidden" name="productId" value={product.id} />
          <div className="mt-6">
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              Size
            </label>
            <Select name="sizeId">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map((size) => (
                  <SelectItem key={size.id} value={size.id}>
                    {size.name} {size.stock > 0 ? `(${size.stock} in stock)` : "(Out of stock)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-6 flex items-center">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mr-4">
              Quantity
            </label>
            <Button type="button" onClick={decrementQuantity} className="px-2 py-1">-</Button>
            <span className="mx-4">{quantity}</span>
            <Button type="button" onClick={incrementQuantity} className="px-2 py-1">+</Button>
          </div>
          <div className="mt-6">
            <ShoppingBagButton />
          </div>
        </form>
      </div>
    </div>
  );
}