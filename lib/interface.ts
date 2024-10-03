interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageString: string;
  sizeId: string;
  sizeName: string;
}

interface Cart {
  userId: string;
  items: CartItem[];
}