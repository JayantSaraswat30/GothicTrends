"use client";

import React, { useState } from 'react';
import { StarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { addItem } from "@/app/action";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ShoppingBagButton } from "@/components/SubmitButtons";

// ImageSlider Component
export function ImageSlider({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full">
      {/* Main Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-300 ease-in-out
              ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}
        
        {/* Navigation Buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4">
          <button
            onClick={previousImage}
            className="rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextImage}
            className="rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="mt-4 hidden md:flex gap-4 justify-center">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-16 w-16 rounded-lg overflow-hidden 
              ${index === currentIndex ? 'ring-2 ring-black' : 'ring-1 ring-gray-200'}`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>

      {/* Mobile Dots Navigation */}
      <div className="mt-4 flex md:hidden justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ProductDetails Component
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 py-4 md:py-8">
        {/* Image Section */}
        <div className="relative w-full md:sticky md:top-20">
          <ImageSlider images={product.images} />
        </div>

        {/* Product Details Section */}
        <div className="w-full space-y-6">
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
          
          <form action={handleAddToCart} className="space-y-6">
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
              <div className="flex items-center gap-3">
                <Button 
                  type="button" 
                  onClick={decrementQuantity} 
                  className="h-9 w-9 rounded-full"
                >
                  -
                </Button>
                <span className="w-12 text-center text-lg">{quantity}</span>
                <Button 
                  type="button" 
                  onClick={incrementQuantity} 
                  className="h-9 w-9 rounded-full"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="w-full">
              <ShoppingBagButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}