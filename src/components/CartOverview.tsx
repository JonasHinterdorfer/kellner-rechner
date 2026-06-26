import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartOverview.css';

const CartOverview: React.FC = () => {
  const navigate = useNavigate(); // <-- Move here
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice,
    getFoodCount,
    getDrinksCount,
    clearCart
  } = useCart();

  if (cartItems.length === 0) {
    return <div className="empty-cart">Warenkorb ist leer</div>;
  }

  return (
    <div className="cart-overview">
      <div className="cart-summary">
        <div className="count-info">
          <div className="food-count">Essen: {getFoodCount()}</div>
          <div className="drink-count">Getränke: {getDrinksCount()}</div>
        </div>
        <div className="total-price">Gesamtpreis: {getTotalPrice().toFixed(2)} €</div>
      </div>

      <div className="cart-actions">
        <button
            className="calculate-change-button"
            onClick={() => navigate('/change-calculator')}
        >
          Restgeld berechnen
        </button>

        <button
            className="clear-cart-button"
            onClick={clearCart}
        >
          Warenkorb leeren
        </button>
      </div>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={`${item.productId}-${item.selectedOption.name}`} className="cart-item">
            <div className="item-info">
              <div className="item-name">{item.productName}</div>
              <div className="item-option">{item.selectedOption.name}</div>
              <div className="item-price">{(item.selectedOption.price * item.quantity).toFixed(2)} €</div>
            </div>
            <div className="item-quantity">
              <button onClick={() => decrementQuantity(item.productId, item.selectedOption.name)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => incrementQuantity(item.productId, item.selectedOption.name)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartOverview;