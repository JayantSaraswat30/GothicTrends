"use server"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod"
import { bannerSchema, productSchema } from "@/lib/zodSchemas";
import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { adminUsers } from "./constants";

export async function createProduct(prevState: unknown, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !adminUsers.includes(user.email as string)) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if(submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) => urlString.split(",").map((url) => url.trim()))

  await prisma.product.create({
    data: {
      name: submission.value.name,
      description: submission.value.description,
      status: submission.value.status,
      price: submission.value.price,
      images: flattenUrls,
      category: submission.value.category,
      isFeatured: submission.value.isFeatured,
      sizes: {
        create: submission.value.sizes.map((size) => ({
          name: size.name,
          stock: size.stock,
        })),
      },
    },
  });

  redirect('/dashboard/products')
}

export async function editProduct(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !adminUsers.includes(user.email as string)) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const productId = formData.get("productId") as string;
  
  // First, delete existing sizes
  await prisma.size.deleteMany({
    where: {
      productId: productId,
    },
  });

  // Then update the product and create new sizes
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: submission.value.name,
      description: submission.value.description,
      category: submission.value.category,
      price: submission.value.price,
      isFeatured: submission.value.isFeatured === true ? true : false,
      status: submission.value.status,
      images: flattenUrls,
      sizes: {
        create: submission.value.sizes.map((size) => ({
          name: size.name,
          stock: size.stock,
        })),
      },
    },
  });

  redirect("/dashboard/products");
}


export async function deleteProduct(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !adminUsers.includes(user.email as string)) {
    return redirect("/");
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });

  redirect("/dashboard/products");
}

export async function createBanner(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !adminUsers.includes(user.email as string)) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: bannerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.banner.create({
    data: {
      title: submission.value.title,
      imageString: submission.value.imageString,
    },
  });

  redirect("/dashboard/banner");
}

export async function deleteBanner(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !adminUsers.includes(user.email as string)) {
    return redirect("/");
  }

  await prisma.banner.delete({
    where: {
      id: formData.get("bannerId") as string,
    },
  });

  redirect("/dashboard/banner");
}

export async function addItem(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  const productId = formData.get("productId") as string;
  const sizeId = formData.get("sizeId") as string;
  const quantity = parseInt(formData.get("quantity") as string) || 1;

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  const selectedProduct = await prisma.product.findUnique({
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
      sizes: {
        where: {
          id: sizeId
        }
      }
    },
    where: {
      id: productId,
    },
  });

  if (!selectedProduct || selectedProduct.sizes.length === 0) {
    throw new Error("No product with this id or size");
  }

  const selectedSize = selectedProduct.sizes[0];

  let myCart: Cart = {
    userId: user.id,
    items: [],
  };

  if (!cart || !cart.items) {
    myCart.items = [
      {
        price: selectedProduct.price,
        id: selectedProduct.id,
        imageString: selectedProduct.images[0],
        name: selectedProduct.name,
        quantity: quantity,
        sizeId: selectedSize.id,
        sizeName: selectedSize.name,
      },
    ];
  } else {
    let itemFound = false;

    myCart.items = cart.items.map((item: any) => {
      if (item.id === productId && item.sizeId === sizeId) {
        itemFound = true;
        return { ...item, quantity: item.quantity + quantity };
      }
      return item;
    });

    if (!itemFound) {
      myCart.items.push({
        id: selectedProduct.id,
        imageString: selectedProduct.images[0],
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: quantity,
        sizeId: selectedSize.id,
        sizeName: selectedSize.name,
      });
    }
  }

  await redis.set(`cart-${user.id}`, myCart);

  revalidatePath("/", "layout");
}
export async function delItem(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  const productId = formData.get("productId");

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (cart && cart.items) {
    const updateCart: Cart = {
      userId: user.id,
      items: cart.items.filter((item) => item.id !== productId),
    };

    await redis.set(`cart-${user.id}`, updateCart);
  }

  revalidatePath("/bag");
}

export async function CheckOut() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if(!user) {
    return redirect("/")
  }

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  if(cart && cart.items) {

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.items.map((item) => (
      {
        price_data: {
          currency: 'usd',
          unit_amount: item.price * 100,
          product_data: {
            name: item.name,
            images: [item.imageString],
            description: `Size: ${item.sizeName}`,
          }
        },
        quantity: item.quantity
      }
    ))

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url:process.env.NODE_ENV === "development" ? "http://localhost:3000/payment/success" : "https://gothic-trends-pa0giu4yg-kishan-sonagaras-projects.vercel.app/payment/success",
      cancel_url:process.env.NODE_ENV === "development" ?  "http://localhost:3000/payment/cancel" : "https://gothic-trends-pa0giu4yg-kishan-sonagaras-projects.vercel.app/payment/cancel",
      metadata: {
        userId: user.id
      }
    })

    return redirect(session.url as string)
  }
}

export async function searchProducts(query: string) {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
      status: 'published',
    },
    select: {
      id: true,
      name: true,
      price: true,
      images: true,
    },
    take: 5, // Limit to 5 results
  });

  return products;
}

export async function updateQuantity(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  const productId = formData.get("productId") as string;
  const sizeId = formData.get("sizeId") as string;
  const action = formData.get("action") as "increment" | "decrement";

  let cart: Cart | null = await redis.get(`cart-${user.id}`);

  if (!cart || !cart.items) {
    return;
  }

  const updatedItems = cart.items.map((item) => {
    if (item.id === productId && item.sizeId === sizeId) {
      return {
        ...item,
        quantity: action === "increment" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
      };
    }
    return item;
  });

  const updatedCart: Cart = {
    userId: user.id,
    items: updatedItems,
  };

  await redis.set(`cart-${user.id}`, updatedCart);
  revalidatePath("/bag");
}