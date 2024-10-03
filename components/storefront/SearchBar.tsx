'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { searchProducts } from '@/app/action'

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() === '') {
        setResults([])
        return
      }

      const handleSearch = async () => {
        setIsLoading(true)
        try {
          const searchResults = await searchProducts(query)
          setResults(searchResults)
        } catch (error) {
          console.error('Error searching products:', error)
        } finally {
          setIsLoading(false)
        }
      }

      handleSearch()
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setResults([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setResults([])
    setQuery('')
  }

  return (
    <div className="relative" ref={searchRef}>
      <Input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full"
      />
      {isLoading && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md mt-1 p-2">
          Loading...
        </div>
      )}
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-md mt-1 z-10">
          {results.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product.id)}
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={50}
                height={50}
                className="object-cover mr-2"
              />
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}