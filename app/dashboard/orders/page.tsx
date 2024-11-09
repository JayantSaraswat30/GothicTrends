import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/db"
import { unstable_noStore as noStore } from "next/cache"
import { ClientOrders } from "./_components/ClientOrders"

async function getData() {
  noStore()
  const orders = await prisma.order.findMany({
    select: {
      amount: true,
      createdAt: true,
      status: true,
      id: true,
      user: {
        select: {
          firstName: true,
          email: true,
        },
      },
      orderItems: {
        select: {
          quantity: true,
          product: {
            select: {
              name: true,
              category: true,
            },
          },
          size: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return orders
}

export default async function OrdersPage() {
  const orders = await getData()

  return (
    <div className="px-8">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage your store orders</CardDescription>
        </CardHeader>
        <CardContent>
          <ClientOrders initialOrders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}