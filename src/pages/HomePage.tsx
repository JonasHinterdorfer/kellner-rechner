import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import CartOverview from '../components/CartOverview';
import { ProductsData } from '../types/types';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [productsData, setProductsData] = useState<ProductsData>({ food: [], drinks: [] });
  const [activeTab, setActiveTab] = useState<'food' | 'drinks'>(() => {
    // Initialize from session storage, default to 'drinks' if not available
    const savedTab = sessionStorage.getItem('kelnerRechnerActiveTab');
    return (savedTab === 'food' || savedTab === 'drinks') ? savedTab as 'food' | 'drinks' : 'drinks';
  });
  
  useEffect(() => {
    import('../data/products.json')
      .then(data => {
        setProductsData(data);
      })
      .catch(error => console.error('Failed to load products:', error));
  }, []);
  
  // Handler for tab changes that also updates session storage
  const handleTabChange = (tab: 'food' | 'drinks') => {
    setActiveTab(tab);
    sessionStorage.setItem('kelnerRechnerActiveTab', tab);
  };
  
  return (
    <div className="home-page">
      <header className="app-header">
        <h1>Preis Rechner</h1>
      </header>

      <div className="main-container">
        <div className="products-container">
          <div className="category-tabs">
            <button
              className={activeTab === 'drinks' ? 'active' : ''}
              onClick={() => handleTabChange('drinks')}
            >
              Getränke
            </button>
            <button 
              className={activeTab === 'food' ? 'active' : ''}
              onClick={() => handleTabChange('food')}
            >
              Essen
            </button>
          </div>
          
          <ProductList
            products={productsData[activeTab]} 
            category={activeTab} 
          />
        </div>
        
        <div className="cart-container">
          <h2 className="section-title">Warenkorb</h2>
          <CartOverview />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
