export interface OrderForm {
  name: string;
  phone: string;
  address: string;
  comment?: string;
}

export interface OrderErrors {
  name?: string;
  phone?: string;
  address?: string;
  submit?: string;
}

export interface Order {
  address: string;
  comment: string;
  createdAt: string;
  items: [
    {
      productId: string;
      quantity: number;
      _id: string;
    },
  ];
  name: string;
  phone: string;
  status: string;
  total: number;
  updatedAt: string;
  userId: string;
  __v: number;
  _id: string;
}

export interface CreateOrderBody extends OrderForm {
  productIds: string[];
  quantities: number[];
}
