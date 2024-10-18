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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start lg:gap-x-24 py-4 md:py-6">
        {/* Image Slider Section */}
        <div className="w-full max-w-2xl mx-auto">
          <ImageSlider images={product.images} />
        </div>

        {/* Product Details Section */}
        <div className="w-full max-w-xl mx-auto md:max-w-none space-y-4 md:space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 break-words">
              {product.name}
            </h1>
            <p className="text-2xl sm:text-3xl text-gray-900">${product.price}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon 
                  key={index} 
                  className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 fill-yellow-500" 
                />
              ))}
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-700">{product.description}</p>
          
          <form action={handleAddToCart} className="space-y-4 md:space-y-6">
            <input type="hidden" name="productId" value={product.id} />
            
            {/* Size Selection */}
            <div className="space-y-2">
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

            {/* Quantity Selection */}
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                Quantity
              </label>
              <div className="flex items-center">
                <Button 
                  type="button" 
                  onClick={decrementQuantity} 
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button 
                  type="button" 
                  onClick={incrementQuantity} 
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="w-full sm:max-w-md">
              <ShoppingBagButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}