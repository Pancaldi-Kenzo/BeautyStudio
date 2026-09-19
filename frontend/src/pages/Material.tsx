import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/product.css'; // On utilise directement le même fichier CSS que les produits
import { useCart } from '../context/useCart';

interface MaterialItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function Material() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:5000/api/materials')
      .then((response) => {
        setMaterials(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement du matériel :', error);
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
            <p>Chargement du matériel...</p>
          ) : (
            <div className="products-grid">
              {materials.map((item) => (
                <div className="product-card" key={item.id}>
                  <span className="info-icon" onClick={() => navigate(`/materiel/${item.id}`)} style={{ cursor: 'pointer' }}>i</span>
                  <img 
                    src={item.image_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=300&q=80'} 
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
                  <button className="order-btn" onClick={() => addToCart({ ...item, id: `mat-${item.id}` })}> Commander </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}