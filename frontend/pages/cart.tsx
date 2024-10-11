// pages/cart.tsx

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import MainLayout from '../layouts/Main';
import { IMenuItem } from '../@types/components';
import { GetServerSideProps } from 'next';
import { makeAllMenus } from '../lib/menu';
import { apiClient } from '../lib/api';
import { IBasicSettings } from '../@types/settings';

export default function CartPage({
  mainMenu,
  footerMenu,
  basicSettings,
}: ICartPageProps) {
  const { items, setItems, total } = useCartItems();

  return (
    <MainLayout
      mainMenu={mainMenu}
      footerMenu={footerMenu}
      basicSettings={basicSettings}
      noIndex
    >
      <div className="container">
        <div className="cart-page row">
          <div className="col-lg-8 offset-lg-2">
            <h1 className="page-heading page-heading_h1 page-heading_m-h1">
              Shopping Cart
            </h1>
            <div className="cart-page__content">
              {items.length > 0 ? (
                <CartItems items={items} setItems={setItems} total={total} />
              ) : (
                <>
                  <p className="cart-page__warning">Your shopping cart is empty.</p>
                  <p className="cart-page__warning">
                    <Link href="/">
                      <a className="btn btn-success">Go shopping!</a>
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const getServerSideProps: GetServerSideProps<ICartPageProps> = async () => {
  const categoryTree = await apiClient.catalog.getCategoryTree({ menu: 'category' });
  const basicSettings = (await apiClient.system.fetchSettings([
    'system.locale',
    'system.currency',
  ])) as IBasicSettings;
  const { mainMenu, footerMenu } = makeAllMenus({ categoryTree });

  return {
    props: {
      mainMenu,
      footerMenu,
      basicSettings,
    },
  };
};

interface ICartPageProps {
  mainMenu: IMenuItem[];
  footerMenu: IMenuItem[];
  basicSettings: IBasicSettings;
}

// Define ICartItem interface within the page
interface ICartItem {
  cart_item_id: number;
  item_id: number;
  qty: number;
  itemPrice: {
    final_price: number;
  };
  product: {
    product_id: number;
    name: string;
    slug: string;
    image: string;
  };
}

const useCartItems = () => {
  const [items, setItems] = useState<ICartItem[]>([
    {
      cart_item_id: 1,
      item_id: 1,
      qty: 1,
      itemPrice: {
        final_price: 2.99,
      },
      product: {
        product_id: 1,
        name: 'Fresh Apples',
        slug: 'fresh-apples',
        image: '/images/products/apple.jpg',
      },
    },
  ]);

  const total = useMemo(() => {
    const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.qty * item.itemPrice.final_price,
      0
    );
    return { qty: totalQty, price: totalPrice };
  }, [items]);

  return {
    items,
    setItems,
    total,
  };
};

interface CartItemsProps {
  items: ICartItem[];
  setItems: React.Dispatch<React.SetStateAction<ICartItem[]>>;
  total: { qty: number; price: number };
}

function CartItems({ items, setItems, total }: CartItemsProps) {
  const handleRemove = (cart_item_id: number) => {
    setItems(items.filter((item) => item.cart_item_id !== cart_item_id));
  };

  const handleQtyChange = (cart_item_id: number, newQty: number) => {
    if (newQty < 1) return; // Prevent quantity less than 1
    setItems(
      items.map((item) =>
        item.cart_item_id === cart_item_id ? { ...item, qty: newQty } : item
      )
    );
  };

  return (
    <div className="cart-items">
      <table className="table">
        <thead>
          <tr>
            <th style={{ textAlign: 'left' }}>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.cart_item_id}>
              <td style={{ textAlign: 'left' }}>
                <img src={item.product.image} alt={item.product.name} width={50} />
                <span style={{ marginLeft: '10px' }}>{item.product.name}</span>
              </td>
              <td>${item.itemPrice.final_price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  value={item.qty}
                  min={1}
                  onChange={(e) =>
                    handleQtyChange(item.cart_item_id, Number(e.target.value))
                  }
                  style={{ width: '60px' }}
                />
              </td>
              <td>${(item.itemPrice.final_price * item.qty).toFixed(2)}</td>
              <td>
                <button
                  onClick={() => handleRemove(item.cart_item_id)}
                  className="btn btn-danger btn-sm"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary" style={{ textAlign: 'right' }}>
        <p>Total Items: {total.qty}</p>
        <p>Total Price: ${total.price.toFixed(2)}</p>
        <Link href="/checkout">
          <a className="btn btn-primary">Proceed to Checkout</a>
        </Link>
      </div>
    </div>
  );
}
