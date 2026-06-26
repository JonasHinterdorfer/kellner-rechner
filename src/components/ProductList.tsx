import React from 'react';
import { Product } from '../types/types';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ProductList.css';

type ProductListProps = {
  products: Product[];
  category: 'food' | 'drinks';
};

const ProductList: React.FC<ProductListProps> = ({ products, category }) => {
  const { addToCart } = useCart();
  const sortedProducts = [...products];
  const handleDirectAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      selectedOption: { name: product.name, price: product.basePrice },
      quantity: 1,
      category
    });
  };

  return (
    <div className="product-list">
      {sortedProducts.map(product => {
        const hasOptions = product.options && product.options.length > 0;
        const style = product.color ? { backgroundColor: `${product.color}80` } : {};
        if (hasOptions) {
          return (
            <Link
              to={`/product/${category}/${product.id}`}
              key={product.id}
              className="product-item"
              style={style}
            >
              <div className="product-name">{product.name}</div>
              <div className="product-price">{product.basePrice.toFixed(2)} €</div>
            </Link>
          );
        } else {
          return (
            <div
              key={product.id}
              className="product-item"
              style={style}
              onClick={() => handleDirectAddToCart(product)}
            >
              <div className="product-name">{product.name}</div>
              <div className="product-price">{product.basePrice.toFixed(2)} €</div>
            </div>
          );
        }
      })}
    </div>
  );
};


export default ProductList;
