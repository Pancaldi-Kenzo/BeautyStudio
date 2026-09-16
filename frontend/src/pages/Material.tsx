import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Material.css';
import { useCart } from '../context/useCart'; // Import du contexte panier

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
    <div className="material-container">
      <header className="material-header">
        <div className="material-logo-circle">
          <span className="material-logo-title">Beauty Studio</span>
          <span className="material-logo-subtitle">Coiffure</span>
        </div>
      </header>

      <div className="material-body">
        <div className="material-sidebar-buttons">
          <button className="material-side-btn" onClick={() => navigate('/produits')}>Produits</button>
          <button className="material-side-btn" onClick={() => navigate('/materiel')}>Matériel</button>
          <button className="material-side-btn" onClick={() => navigate('/')}>Accueil</button>
        </div>

        <div className="material-content-area">
          <div className="top-bar">
            <span className="breadcrumb">Accueil &gt; Produits</span>
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
            <div className="material-grid">
              {materials.map((item) => (
                <div className="material-card" key={item.id}>
                  <span className="material-info-icon" onClick={() => navigate(`/materiel/${item.id}`)} style={{ cursor: 'pointer' }}>i</span>
                  <img src={item.image_url || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=300&q=80'} alt={item.name} className="material-img" />
                  <h3 className="material-name">{item.name}</h3>
                  <p className="material-desc">{item.description}</p>
                  <span className="material-price">{item.price}€</span>
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