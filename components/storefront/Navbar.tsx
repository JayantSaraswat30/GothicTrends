import Link from "next/link"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import { ShoppingBagIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { NavbarLinks } from "./NavbarLinks"
import { UserDropdown } from "./UserDropdown"
import { redis } from "@/lib/redis"
import { Cart } from "@/lib/interface"
import { SearchBar } from "./SearchBar"
import { ThemeToggle } from "../dashboard/ThemeToggle"


export async function Navbar() {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  const cart: Cart | null = await redis.get(`cart-${user?.id}`)
  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <nav className="w-full bg-white dark:bg-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-black dark:text-white font-bold text-xl lg:text-2xl">
                Gothic<span className="text-primary">Trends</span>
              </h1>
            </Link>
            <div className="hidden md:block ml-10">
              <NavbarLinks />
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <SearchBar />
              {user ? (
                <>
                  <Link href="/bag" className="group p-2 flex items-center dark:text-white 
                   
                  text-gray-600 hover:text-gray-900">
                    <ShoppingBagIcon className="h-6 w-6" />
                    <span className="ml-2 text-sm font-medium">{total}</span>
                  </Link>
                  <UserDropdown
                    email={user.email as string}
                    name={user.given_name as string}
                    userImage={user.picture ?? `https://avatar.vercel.sh/${user.given_name}`}
                  />
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <LoginLink>Sign in</LoginLink>
                  </Button>
                  <Button variant="ghost" asChild>
                    <RegisterLink>Create Account</RegisterLink>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <NavbarLinks />
          </div>
          <ThemeToggle/>
        </div>
      </div>
      <div className="md:hidden border-t border-gray-200 py-2">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar />
          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/bag" className="group p-2 flex items-center text-gray-600 hover:text-gray-900">
                <ShoppingBagIcon className="h-6 w-6" />
                <span className="ml-2 text-sm font-medium">{total}</span>
              </Link>
              <UserDropdown
                email={user.email as string}
                name={user.given_name as string}
                userImage={user.picture ?? `https://avatar.vercel.sh/${user.given_name}`}
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <LoginLink>Sign in</LoginLink>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <RegisterLink>Create Account</RegisterLink>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}