'use client'

import { useState, useEffect } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useDebounce } from 'use-debounce'
import { ProductCard } from '@/components/storefront/ProductCard'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  status: string
}

interface CategoryPageProps {
  initialProducts: Product[]
}

export default function CategoryPage({ initialProducts }: CategoryPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [categoryFilters, setCategoryFilters] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300)

  const categories = Array.from(new Set(products.map(product => product.category)))
  const maxPrice = Math.max(...products.map(product => product.price))

  useEffect(() => {
    const newFilteredProducts = products.filter(product => 
      (categoryFilters.length === 0 || categoryFilters.includes(product.category)) &&
      (product.price >= priceRange[0] && product.price <= priceRange[1]) &&
      (product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
       product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))
    )
    setFilteredProducts(newFilteredProducts)
  }, [categoryFilters, priceRange, products, debouncedSearchQuery])

  const handleCategoryChange = (category: string) => {
    setCategoryFilters(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const resetFilters = () => {
    setCategoryFilters([])
    setPriceRange([0, maxPrice])
    setSearchQuery('')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Products</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/4">
          <div className="bg-white dark:bg-black p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Filters</h2>
            <div className="mb-6">
              <Label htmlFor="search" className="text-lg font-semibold mb-2">Search</Label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search products..."
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              {categories.map(category => (
                <div key={category} className="flex items-center space-x-2 mb-2">
                  <Checkbox 
                    id={category} 
                    checked={categoryFilters.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={category}>{category}</Label>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <Slider
                min={0}
                max={maxPrice}
                step={1}
                value={priceRange}
                onValueChange={handlePriceChange}
              />
            </div>
            <Button onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-xl">No products found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} item={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}