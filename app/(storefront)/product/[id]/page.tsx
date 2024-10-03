import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/lib/db";
import { FeaturedProducts } from "@/components/storefront/FeaturedProducts";
import { Category, ProductStatus } from "@prisma/client";
import { ProductDetails } from "../_component/ProductDetails";

interface Size {
  id: string;
  name: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  price: number;
  images: string[];
  category: Category;
  isFeatured: boolean;
  createdAt: Date;
  sizes: Size[];
}

async function getData(productId: string): Promise<Product> {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      sizes: true,
    },
  });

  if (!data) {
    notFound();
  }

  return data;
}

export default async function ProductIdRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);

  return (
    <>
      <ProductDetails product={data} />
      <div className="mt-16">
        <FeaturedProducts />
      </div>
    </>
  );
}