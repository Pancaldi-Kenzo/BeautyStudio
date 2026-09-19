import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/product.css';
import { useCart } from '../context/useCart'; // Import du contexte panier

interface ProductItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    // Appel vers ton backend Express pour les produits
    axios.get('http://localhost:5000/api/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des produits :', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="shop-container">
      <header className="shop-header">
        <div className="logo-circle">
          <span className="logo-title">Beauty Studio</span>
          <span className="logo-subtitle">Coiffure</span>
        </div>
      </header>

      <div className="shop-body">
        <div className="sidebar-buttons">
          <button className="side-btn" onClick={() => navigate('/produits')}>Produits</button>
          <button className="side-btn" onClick={() => navigate('/materiel')}>Matériel</button>
          <button className="side-btn" onClick={() => navigate('/')}>Accueil</button>
        </div>

        <div className="content-area">
          <div className="top-bar">
            <span className="breadcrumb"></span>
            <div className="top-right-actions">
              <input type="text" placeholder="Recherche ..." className="search-input" />
              <button className="cart-top-btn" onClick={() => navigate('/panier')}>
                🛒 Panier
              </button>
            </div>
          </div>

          {loading ? (
            <p>Chargement des produits...</p>
          ) : (
            <div className="products-grid">
              {products.map((item) => (
                <div className="product-card" key={item.id}>
                  <span className="info-icon" onClick={() => navigate(`/produit/${item.id}`)} style={{ cursor: 'pointer' }}> i</span>
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=300&q=80'} 
                    alt={item.name} 
                    className="product-img" 
                  />
                  <h3 className="product-name">{item.name}</h3>
                  <p className="product-desc">
                    {item.description && item.description.length > 90 
                      ? item.description.substring(0, 90) + '...' 
                      : item.description}
                  </p>
                  <span className="product-price">{item.price}€</span>
                  <button className="order-btn" onClick={() => addToCart({ ...item, id: `prod-${item.id}` })}> Commander </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}