'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export function FilterControls({ onFilter }: any) {
  const [sort, setSort] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [status, setStatus] = useState('all')
  const [category, setCategory] = useState('all')

  const handleFilter = () => {
    onFilter({
      sort,
      order,
      status: status === 'all' ? undefined : status,
      category: category === 'all' ? undefined : category
    })
  }

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 mb-4">
      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt">Date</SelectItem>
          <SelectItem value="amount">Amount</SelectItem>
        </SelectContent>
      </Select>

      <Select value={order} onValueChange={setOrder}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">Ascending</SelectItem>
          <SelectItem value="desc">Descending</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="complete">Complete</SelectItem>
        </SelectContent>
      </Select>

      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="men">Men</SelectItem>
          <SelectItem value="women">Women</SelectItem>
          <SelectItem value="kids">Kids</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleFilter}>
        Apply Filters
      </Button>
    </div>
  )
}