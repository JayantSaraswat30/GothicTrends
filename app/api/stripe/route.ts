import prisma from "@/lib/db";
import { redis } from "@/lib/redis";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";

interface CartItem {
  id: string;
  sizeId: string;
  quantity: number;
}

interface Cart {
  userId: string;
  items: CartItem[];
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_WEBHOOK as string
    );
  } catch (error: unknown) {
    return new Response("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (userId) {
        // Fetch the cart data from Redis
        const cart: Cart | null = await redis.get(`cart-${userId}`);

        if (cart && Array.isArray(cart.items) && cart.items.length > 0) {
          // Create the order
          const order = await prisma.order.create({
            data: {
              amount: session.amount_total as number,
              status: session.status as string,
              userId: userId,
            },
          });

          // Create order items with size information
          for (const item of cart.items) {
            await prisma.orderItem.create({
              data: {
                orderId: order.id,
                productId: item.id,
                sizeId: item.sizeId,
                quantity: item.quantity,
              },
            });
          }

          // Clear the cart after successful order creation
          await redis.del(`cart-${userId}`);
        }
      }

      break;
    }
    default: {
      console.log("unhandled event");
    }
  }

  return new Response(null, { status: 200 });
}