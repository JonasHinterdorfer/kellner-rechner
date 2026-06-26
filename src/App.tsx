import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ChangeCalculatorPage from './pages/ChangeCalculatorPage';
import { CartProvider } from './contexts/CartContext';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:category/:productId" element={<ProductDetailsPage />} />
            <Route path="/change-calculator" element={<ChangeCalculatorPage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
