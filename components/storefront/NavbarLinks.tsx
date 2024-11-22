"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "../dashboard/ThemeToggle"

export const navbarLinks = [
  { id: 0, name: "Home", href: "/" },
  { id: 1, name: "All Products", href: "/products/" },
  { id: 2, name: "Men", href: "/products/men" },
  { id: 3, name: "Women", href: "/products/women" },
  { id: 4, name: "Kids", href: "/products/kids" },
  { id: 5, name: "Orders", href: "/orders" },
]

export function NavbarLinks() {
  const location = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button onClick={toggleMenu} className="p-2 text-gray-600 hover:text-gray-900">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop menu */}
      <div className="hidden md:flex items-center space-x-4">
        {navbarLinks.map((item) => (
          <Link
            href={item.href}
            key={item.id}
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              location === item.href
                ? "bg-primary text-white"
                : "text-black dark:text-white hover:bg-primary hover:text-white "
            )}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg z-20">
          {navbarLinks.map((item) => (
            <Link
              href={item.href}
              key={item.id}
              className={cn(
                "block px-4 py-2 text-base font-medium",
                location === item.href
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-primary hover:text-white"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
       
      )}
      
    </>
  )
}