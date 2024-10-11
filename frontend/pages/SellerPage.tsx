import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useState } from 'react';
import MainLayout from '../layouts/Main';
import { makeAllMenus } from '../lib/menu';
import { apiClient } from '../lib/api';
import { IMenuItem } from '../@types/components';
import { IBasicSettings } from '../@types/settings';

const SellerPage = ({ mainMenu, footerMenu, basicSettings }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  // State to hold form data
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);  // Updated for file input
  const [quantity, setQuantity] = useState<number>(1);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(0, parseInt(e.target.value, 10));  // Prevent quantity from being less than 0
    setQuantity(newQuantity);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('price', price);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    formData.append('quantity', quantity.toString());

    // For demonstration purposes, log the form data (you can send this to an API)
    console.log({
      productName,
      price,
      imageFile, // This will log the file information
      quantity
    });

    // Reset the form after submission
    setProductName('');
    setPrice('');
    setImageFile(null);
    setQuantity(1);
  };

  return (
    <MainLayout mainMenu={mainMenu} footerMenu={footerMenu} basicSettings={basicSettings}>
      <div className="container">
        <h1 className="page-heading page-heading_h1 page-heading_m-h1">Sell Item</h1>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Product Image</label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imageFile && <p>Selected file: {imageFile.name}</p>} {/* Display the selected file name */}
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="0"  // HTML validation for quantity
              placeholder="Enter quantity"
              required
            />
          </div>

          <button type="submit" className="submit-btn">Submit Product</button>
        </form>
      </div>

      <style jsx>{`
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
        }

        input[type="text"],
        input[type="number"] {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }

        input[type="file"] {
          padding: 10px;
        }

        .submit-btn {
          background-color: black;
          color: white;
          padding: 10px 20px;
          border: none;
          cursor: pointer;
          border-radius: 5px;
        }

        .submit-btn:hover {
          background-color: darkgray;
        }
      `}</style>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const categoryTree = await apiClient.catalog.getCategoryTree({ menu: 'category' });
  const basicSettings = await apiClient.system.fetchSettings(['system.locale', 'system.currency']) as IBasicSettings;

  const menus = makeAllMenus({ categoryTree });

  return {
    props: {
      mainMenu: menus.mainMenu,
      footerMenu: menus.footerMenu,
      basicSettings,
    },
  };
};

export default SellerPage;
