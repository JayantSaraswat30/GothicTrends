import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import Image from "next/image";
import { formatDistance } from "date-fns";

async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
          size: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return orders;
}

export default async function OrderHistory() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/");
  }

  const orders = await getOrders(user.id);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">No Orders Yet</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
          Looks like you haven&apos;t placed any orders yet.
        </p>
        <a
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md transition duration-200 ease-in-out"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Order History</h1>
      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition duration-200 ease-in-out hover:shadow-lg"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Order placed{" "}
                    {formatDistance(new Date(order.createdAt), new Date(), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order ID: {order.id}</p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize" style={{
                    backgroundColor: order.status === 'pending' ? 'var(--warning-bg)' : 
                                     order.status === 'processing' ? 'var(--info-bg)' : 
                                     order.status === 'completed' ? 'var(--success-bg)' : 'var(--error-bg)',
                    color: order.status === 'pending' ? 'var(--warning-text)' :
                           order.status === 'processing' ? 'var(--info-text)' :
                           order.status === 'completed' ? 'var(--success-text)' : 'var(--error-text)'
                  }}>
                    {order.status}
                  </span>
                </div>
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Total: ${(order.amount/100).toFixed(2)}
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{item.product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Size: {item.size.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        ${(item.product.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

