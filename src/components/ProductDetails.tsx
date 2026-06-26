import React, { useState } from 'react';
import { Product, ProductOption } from '../types/types';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductDetails.css';

type ProductDetailsProps = {
  product: Product;
  category: 'food' | 'drinks';
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, category }) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption>(
    product.options?.[0] || { name: product.name, price: 0 }
  );
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Use a safer approach for options
  const options = product.options || [];
  const hasSamePrice = options.length > 0 && 
    options.every(option => option.price === options[0].price);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      productName: product.name,
      selectedOption,
      quantity,
      category
    });
    navigate('/');
  };

  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      
      {options.length > 0 && (
        <div className="options-list">
          <h3>Optionen:</h3>
          {options.map(option => (
            <div 
              key={option.name}
              className={`option-item ${selectedOption.name === option.name ? 'selected' : ''}`}
              onClick={() => setSelectedOption(option)}
              style={(option.color || product.color) ? 
                { backgroundColor: `${option.color || product.color}60` } : {}}
            >
              <span>{option.name}</span>
              {!hasSamePrice && <span className="option-price">{option.price.toFixed(2)} €</span>}
            </div>
          ))}
          {hasSamePrice && (
            <div className="uniform-price">Preis: {options[0].price.toFixed(2)} €</div>
          )}
        </div>
      )}
      
      <div className="quantity-controls">
        <h3>Menge:</h3>
        <div className="quantity-buttons">
          <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(prev => prev + 1)}>+</button>
        </div>
      </div>
      
      <div className="price-summary">
        <div>Gesamt: <strong>{(selectedOption.price * quantity).toFixed(2)} €</strong></div>
      </div>
      
      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Zum Warenkorb hinzufügen
      </button>
    </div>
  );
};

export default ProductDetails;
