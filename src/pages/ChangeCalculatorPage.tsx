import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './ChangeCalculatorPage.css';

interface MoneyItem {
  value: number;
  label: string;
  count: number;
}

const ChangeCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const { getTotalPrice, clearCart } = useCart();
  const cartTotal = getTotalPrice();

  const initialDenominations: MoneyItem[] = [
    { value: 0.5, label: '0,50 €', count: 0 },
    { value: 1, label: '1 €', count: 0 },
    { value: 2, label: '2 €', count: 0 },
    { value: 5, label: '5 €', count: 0 },
    { value: 10, label: '10 €', count: 0 },
    { value: 20, label: '20 €', count: 0 },
    { value: 50, label: '50 €', count: 0 },
    { value: 100, label: '100 €', count: 0 },
    { value: 200, label: '200 €', count: 0 },
  ];

  const [moneyItems, setMoneyItems] = useState<MoneyItem[]>(initialDenominations);
  const [customerTotal, setCustomerTotal] = useState<number>(0);
  const [changeAmount, setChangeAmount] = useState<number>(0);

  // Calculate totals whenever money items change
  useEffect(() => {
    const total = moneyItems.reduce((sum, item) => sum + item.value * item.count, 0);
    setCustomerTotal(total);
    // Allow negative values when customer hasn't paid enough
    setChangeAmount(total - cartTotal);
  }, [moneyItems, cartTotal]);

  const handleDenominationClick = (index: number) => {
    const updatedItems = [...moneyItems];
    updatedItems[index].count += 1;
    setMoneyItems(updatedItems);
  };

  const resetDenomination = (index: number) => {
    const updatedItems = [...moneyItems];
    updatedItems[index].count = 0;
    setMoneyItems(updatedItems);
  };

  const decreaseDenomination = (index: number) => {
    if (moneyItems[index].count > 0) {
      const updatedItems = [...moneyItems];
      updatedItems[index].count -= 1;
      setMoneyItems(updatedItems);
    }
  };

  const resetAllDenominations = () => {
    setMoneyItems(initialDenominations.map(item => ({ ...item, count: 0 })));
  };

  const handleDoneClick = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="change-calculator-page">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate('/')}>
          &larr; Zurück
        </button>
        <h1>Restgeld</h1>
        <button className="done-button" onClick={handleDoneClick}>
          Fertig
        </button>
      </header>

      <div className="calculator-container">
        <div className="totals-section">
          <div className="total-item">
            <span>Warenkorb:</span>
            <span>{cartTotal.toFixed(2)} €</span>
          </div>
          <div className="total-item">
            <span>Erhalten:</span>
            <span>{customerTotal.toFixed(2)} €</span>
          </div>
          <div className="total-item highlight">
            <span>Restgeld:</span>
            <span 
              style={{ 
                color: changeAmount < 0 ? '#ff0000' : 'inherit',
                fontWeight: changeAmount < 0 ? 'bold' : 'inherit'
              }}
            >
              {changeAmount.toFixed(2)} €
            </span>
          </div>
        </div>

        <div className="denominations-grid">
          {moneyItems.map((item, index) => (
            <button
              key={item.value}
              className="denomination-button"
              onClick={() => handleDenominationClick(index)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="selected-denominations">
          <h3>Ausgewählte Münzen/Scheine</h3>
          {moneyItems.some(item => item.count > 0) ? (
            <ul>
              {moneyItems
                .filter(item => item.count > 0)
                .map((item, index) => (
                  <li key={item.value} className="denomination-item">
                    <span>{item.count}x {item.label}</span>
                    <div className="item-controls">
                      <button onClick={() => decreaseDenomination(
                        moneyItems.findIndex(i => i.value === item.value)
                      )}>-</button>
                      <button onClick={() => resetDenomination(
                        moneyItems.findIndex(i => i.value === item.value)
                      )}>×</button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p>Keine Auswahl</p>
          )}

          {moneyItems.some(item => item.count > 0) && (
            <button 
              className="reset-button" 
              onClick={resetAllDenominations}
            >
              Alle zurücksetzen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeCalculatorPage;
