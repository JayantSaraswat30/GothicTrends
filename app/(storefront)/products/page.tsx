
import { getProducts } from '@/lib/product'
import CategoryPage from './_components/CategoryPage'

export default async function Page() {
  const products = await getProducts()

  return <CategoryPage initialProducts={products} />
}