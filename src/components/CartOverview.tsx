import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartOverview.css';

const CartOverview: React.FC = () => {
  const navigate = useNavigate();
  const [showTableModal, setShowTableModal] = useState(false);
  const {
    cartItems,
    incrementQuantity,
    decrementQuantity,
    getTotalPrice,
    getFoodCount,
    getDrinksCount,
    clearCart,
    tableItems,
    isTableActive,
    setTableActive,
    clearTable,
    getTableTotalPrice,
    getTableFoodCount,
    getTableDrinksCount
  } = useCart();

  const hasCartItems = cartItems.length > 0;

  const handleToggleTable = () => {
    setTableActive(!isTableActive);
  };

  return (
    <div className="cart-overview">
      <div className="cart-summary">
        <div className="count-info">
          <div className="count-column">
            <div className="food-count">Essen: {getFoodCount()}</div>
            {isTableActive && (
              <div className="table-count">Tisch Essen: {getTableFoodCount()}</div>
            )}
          </div>
          <div className="count-column right">
            <div className="drink-count">Getränke: {getDrinksCount()}</div>
            {isTableActive && (
              <div className="table-count">Tisch Getränke: {getTableDrinksCount()}</div>
            )}
          </div>
        </div>
        <div className="total-price">Gesamtpreis: {getTotalPrice().toFixed(2)} €</div>
        {isTableActive && (
          <div className="table-total-price">
            Tisch gesamt: {getTableTotalPrice().toFixed(2)} €
          </div>
        )}
      </div>

      <div className="cart-actions">
        <div className="table-actions">
          <button
            className="toggle-table-button active"
            onClick={handleToggleTable}
          >
            {isTableActive ? 'Tisch deaktivieren' : 'Tisch aktivieren'}
          </button>

          {isTableActive && (
            <>
              <button
                className="view-table-button"
                onClick={() => setShowTableModal(true)}
                disabled={tableItems.length === 0}
              >
                Tisch anzeigen
              </button>
            </>
          )}

          <button
            className="calculate-change-button"
            onClick={() => navigate('/change-calculator')}
            disabled={!hasCartItems}
          >
            Restgeld
          </button>
        </div>

        <button
          className="clear-cart-button"
          onClick={clearCart}
          disabled={!hasCartItems}
        >
          Warenkorb leeren
        </button>
      </div>

      {hasCartItems ? (
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
      ) : (
        <div className="empty-cart">Warenkorb ist leer</div>
      )}

      {showTableModal && (
        <div className="table-modal-overlay" onClick={() => setShowTableModal(false)}>
          <div className="table-modal" onClick={e => e.stopPropagation()}>
            <div className="table-modal-header">
              <h3>Gespeicherter Tisch</h3>
              <button className="close-modal-button" onClick={() => setShowTableModal(false)}>×</button>
            </div>
            {tableItems.length === 0 ? (
              <div className="empty-table">Tisch ist leer</div>
            ) : (
              <>
                <div className="table-modal-summary">
                  <span>Essen: {getTableFoodCount()}</span>
                  <span>Getränke: {getTableDrinksCount()}</span>
                  <span className="table-modal-total">{getTableTotalPrice().toFixed(2)} €</span>
                </div>
                <div className="table-items">
                  {tableItems.map((item) => (
                    <div key={`table-${item.productId}-${item.selectedOption.name}`} className="cart-item">
                      <div className="item-info">
                        <div className="item-name">{item.productName}</div>
                        <div className="item-option">{item.selectedOption.name}</div>
                        <div className="item-price">{(item.selectedOption.price * item.quantity).toFixed(2)} €</div>
                      </div>
                      <div className="item-quantity static">
                        <span>{item.quantity}x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartOverview;
