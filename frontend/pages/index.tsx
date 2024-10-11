// pages/index.tsx

import React from 'react';
import { IProduct } from '../@types/IProduct';
import MainLayout from '../layouts/Main';
import SwiperSlider from '../components/SwiperSlider';
import ProductCard from '../components/ProductCard';

export default function IndexPage() {
  const products: IProduct[] = [
    {
      product_id: 1,
      name: 'Fresh Apples',
      quantity: 50,
      price: 2.99,
      image: '/images/products/apple.jpg',
      type: 'Fruit',
      slug: 'fresh-apples',
    },
    {
      product_id: 2,
      name: 'Crunchy Carrots',
      quantity: 70,
      price: 1.89,
      image: '/images/products/carrot.jpg',
      type: 'Vegetable',
      slug: 'crunchy-carrots',
    },
    {
      product_id: 3,
      name: 'Cool Cucumbers',
      quantity: 60,
      price: 1.49,
      image: '/images/products/cucumber.jpg',
      type: 'Vegetable',
      slug: 'cool-cucumbers',
    },
    {
      product_id: 4,
      name: 'Exotic Dragonfruit',
      quantity: 20,
      price: 5.99,
      image: '/images/products/dragonfruit.jpg',
      type: 'Fruit',
      slug: 'exotic-dragonfruit',
    },
    {
      product_id: 5,
      name: 'Green Apples',
      quantity: 40,
      price: 3.49,
      image: '/images/products/greenapples.jpg',
      type: 'Fruit',
      slug: 'green-apples',
    },
    {
      product_id: 6,
      name: 'Zesty Lemons',
      quantity: 80,
      price: 0.99,
      image: '/images/products/lemon.jpg',
      type: 'Fruit',
      slug: 'zesty-lemons',
    },
    {
      product_id: 7,
      name: 'Sweet Mangoes',
      quantity: 35,
      price: 4.49,
      image: '/images/products/mango.jpg',
      type: 'Fruit',
      slug: 'sweet-mangoes',
    },
    {
      product_id: 8,
      name: 'Tropical Passionfruit',
      quantity: 25,
      price: 3.99,
      image: '/images/products/passionfruit.jpg',
      type: 'Fruit',
      slug: 'tropical-passionfruit',
    },
    {
      product_id: 9,
      name: 'Fresh Strawberries',
      quantity: 30,
      price: 4.99,
      image: '/images/products/strawberry.jpg',
      type: 'Fruit',
      slug: 'fresh-strawberries',
    },
    {
      product_id: 10,
      name: 'Juicy Tangerines',
      quantity: 50,
      price: 2.79,
      image: '/images/products/tangerine.jpg',
      type: 'Fruit',
      slug: 'juicy-tangerines',
    },
  ];

  return (
    <MainLayout>
      <div className="container">
        <MainPageSlider />
        <h1 className="page-heading page-heading_h1 page-heading_m-h1">Shopper's Delight</h1>

        {/* Products List */}
        <div className="products-section">
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.product_id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function MainPageSlider() {
  const slides = [
    {
      img: '/images/products/apple.jpg', // Changed from cliffImg.src to apple image
      link: '',
      caption:
        'Experience the freshness of locally grown produce delivered to your doorstep.',
      captionPosition: 'center',
      useFilling: true,
      fillingColor: '#000000',
      fillingOpacity: 0.4,
    },
    {
      img: '/images/products/strawberry.jpg', // Changed second slide image
      link: '',
      caption:
        'Join our community of growers and enjoy the bounty of nature.',
      captionPosition: 'center',
      useFilling: true,
      fillingColor: '#000000',
      fillingOpacity: 0.4,
    },
  ];

  return (
    <SwiperSlider
      showPrevNext
      roundCorners
      pagination="progressbar"
      size="large"
      slides={slides}
      className="mb-4"
    />
  );
}
