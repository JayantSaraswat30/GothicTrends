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
      {/* Mobile-first image container */}
      <div className="relative w-full pb-[100%] md:pb-0 md:h-[600px] overflow-hidden bg-gray-100">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-300
              ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <img
              src={image}
              alt={`Product image ${index + 1}`}
              className="absolute inset-0 w-full h-full object-contain"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}

        {/* Navigation arrows - Hidden on very small screens */}
        <div className="absolute inset-x-0 top-1/2 z-20 hidden sm:flex items-center justify-between px-4 -translate-y-1/2">
          <button
            onClick={previousImage}
            className="rounded-full bg-white/80 p-2 shadow-lg hover:bg-white focus:outline-none"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="rounded-full bg-white/80 p-2 shadow-lg hover:bg-white focus:outline-none"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Swipe indicators - Mobile only */}
        <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center gap-2 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors
                ${index === currentIndex ? 'bg-black' : 'bg-black/20'}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails - Desktop only */}
      <div className="hidden md:grid grid-cols-4 gap-2 mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative pb-[100%] overflow-hidden rounded
              ${index === currentIndex 
                ? 'ring-2 ring-black' 
                : 'ring-1 ring-gray-200 hover:ring-gray-300'}`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          </button>
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
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8 lg:gap-y-0">
          {/* Image Column */}
          <div className="w-full lg:sticky lg:top-0 lg:h-screen lg:pt-8">
            <div className="h-full max-h-[90vh] overflow-y-auto scrollbar-hide">
              <ImageSlider images={product.images} />
            </div>
          </div>

          {/* Details Column */}
          <div className="w-full px-4 sm:px-6 lg:px-8 pb-24 lg:py-8">
            <div className="max-w-2xl mx-auto lg:max-w-none">
              {/* Product Info */}
              <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                  {product.name}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <p className="text-2xl sm:text-3xl text-gray-900">
                    ${product.price}
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <StarIcon 
                        key={index} 
                        className="h-5 w-5 text-yellow-500 fill-yellow-500" 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-base text-gray-700">
                  {product.description}
                </p>
              </div>

              {/* Form */}
              <form action={handleAddToCart} className="mt-10 space-y-8">
                <input type="hidden" name="productId" value={product.id} />
                
                {/* Size Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Size
                  </label>
                  <Select name="sizeId">
                    <SelectTrigger className="w-full h-12">
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
                <div className="flex items-center gap-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <Button 
                      type="button" 
                      onClick={decrementQuantity} 
                      className="h-10 w-10 rounded-full"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center text-lg font-medium">
                      {quantity}
                    </span>
                    <Button 
                      type="button" 
                      onClick={incrementQuantity} 
                      className="h-10 w-10 rounded-full"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="w-full sm:max-w-xs">
                  <ShoppingBagButton />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}