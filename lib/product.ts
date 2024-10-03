import prisma from '@/lib/db'

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: 'published',
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        category: true,
        status: true,
      },
    })

    return products
  } catch (error) {
    console.error('Failed to fetch products:', error)
    throw new Error('Failed to fetch products')
  }
}