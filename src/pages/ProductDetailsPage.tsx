import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductDetails from '../components/ProductDetails';
import { Product } from '../types/types';
import './ProductDetailsPage.css';

const ProductDetailsPage: React.FC = () => {
  const { category, productId } = useParams<{ category: string, productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await import('../data/products.json');
        if (!category || (category !== 'food' && category !== 'drinks')) {
          throw new Error('Invalid category');
        }
        
        const foundProduct = data[category].find((p: Product) => p.id === productId);
        
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          throw new Error('Product not found');
        }
      } catch (error) {
        console.error('Failed to load product:', error);
        navigate('/');
      }
    };
    
    loadProduct();
  }, [category, productId, navigate]);
  
  if (!product || !category) {
    return <div className="loading">Laden...</div>;
  }
  
  return (
    <div className="product-details-page">
      <header className="details-header">
        <button className="back-button" onClick={() => navigate('/')}>
          &larr; Zurück
        </button>
        <h1>{product.name}</h1>
      </header>
      <ProductDetails 
        product={product} 
        category={category as 'food' | 'drinks'} 
      />
    </div>
  );
};

export default ProductDetailsPage;
