'use client'

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from 'lucide-react'
import { FilterControls } from "./FilterControls"

export function ClientOrders({ initialOrders }: any) {
  const [filteredOrders, setFilteredOrders] = useState(initialOrders)

  const handleFilter = ({ sort, order, status, category }: any) => {
    let filtered = [...initialOrders]

    // Apply status filter
    if (status) {
      filtered = filtered.filter(item => item.status === status)
    }

    // Apply category filter
    if (category) {
      filtered = filtered.filter(item => 
        item.orderItems.some((orderItem: { product: { category: any } }) => orderItem.product.category === category)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const modifier = order === 'asc' ? 1 : -1
      if (sort === 'amount') {
        return (a.amount - b.amount) * modifier
      } else {
        const dateA = new Date(a.createdAt).getTime()
        const dateB = new Date(b.createdAt).getTime()
        return (dateA - dateB) * modifier
      }
    })

    setFilteredOrders(filtered)
  }

  return (
    <>
      <FilterControls onFilter={handleFilter} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Order Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>
                <p className="font-medium">{item.user?.firstName}</p>
                <p className="text-sm text-muted-foreground">{item.user?.email}</p>
              </TableCell>
              <TableCell>
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center">
                    <span className="mr-2">Order Items</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-2">
                    {item.orderItems.map((orderItem: any, index: number) => (
                      <div key={index} className="text-sm">
                        <p>{orderItem.product.name}</p>
                        <p className="text-muted-foreground">
                          Size: {orderItem.size.name} - Qty: {orderItem.quantity} - Category: {orderItem.product.category}
                        </p>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.status === 'complete' ? 'bg-green-100 text-green-800' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {item.status}
                </span>
              </TableCell>
              <TableCell>
                {new Intl.DateTimeFormat("en-US", {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }).format(new Date(item.createdAt))}
              </TableCell>
              <TableCell className="text-right">
                ${(item.amount / 100).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
