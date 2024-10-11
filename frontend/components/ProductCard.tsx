// components/ProductCard.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface IProduct {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
  type: string;
  slug: string;
}

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, quantity, price, image, type, slug } = product;

  const handleAddToCart = () => {
    // Dummy function to simulate adding to cart
    alert(`Added ${name} to cart!`);
  };

  return (
    <div className="product-card">
      <Link href={`/product/${slug}`}>
        <a>
          <Image src={image} alt={name} width={200} height={200} />
          <h2>{name}</h2>
          <p>Type: {type}</p>
          <p>Quantity: {quantity}</p>
          <p className="price">${price.toFixed(2)}</p>
        </a>
      </Link>
      <button onClick={handleAddToCart} className="add-to-cart-button">
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
