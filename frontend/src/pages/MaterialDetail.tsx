import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/useCart';
import '../styles/MaterialDetail.css';

interface MaterialDetailType {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  benefits?: string;
}

export default function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [material, setMaterial] = useState<MaterialDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  
  const hasLogged = useRef(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/materials/${id}`)
      .then((res) => {
        setMaterial(res.data);
        setLoading(false);

        if (!hasLogged.current) {
          hasLogged.current = true;
          axios.post('http://localhost:5000/api/consultations', {
            itemId: res.data.id,
            itemName: res.data.name,
            itemType: 'material'
          }).catch(err => console.error("Erreur enregistrement consultation matériel :", err));
        }

      })
      .catch((err) => {
        console.error('Erreur chargement détail matériel :', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="mat-loading">Chargement...</p>;
  if (!material) return <p className="mat-loading">Matériel introuvable</p>;

  const benefitsList = material.benefits 
    ? material.benefits.split('\n').filter(Boolean) 
    : [];

  return (
    <div className="mat-detail-container">
      <header className="mat-detail-header">
        <div className="mat-detail-logo-circle">
          <span className="mat-detail-logo-title">Beauty Studio</span>
          <span className="mat-detail-logo-subtitle">Matériel</span>
        </div>
      </header>

      <div className="mat-detail-main">
        <div className="mat-detail-image-section">
          <img src={material.image_url} alt={material.name} className="mat-detail-img" />
          <div className="mat-detail-img-reflection"></div>
        </div>

        <div className="mat-detail-info-section">
          <h1 className="mat-detail-title">{material.name}</h1>
          <h2 className="mat-detail-brand">Beauty Studio Pro</h2>
          <span className="mat-detail-price">{material.price}€</span>
          <p className="mat-detail-desc">{material.description}</p>
          
          {benefitsList.length > 0 && (
            <div className="mat-detail-benefits">
              <h3>Caractéristiques</h3>
              <ul>
                {benefitsList.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}

          <button 
            onClick={() => addToCart({
              id: `mat-${material.id}`,
              name: material.name,
              price: material.price,
              image_url: material.image_url
            })}
            className="add-to-cart-btn"
          >
            Ajouter au panier
          </button>
          <button className="mat-detail-back-btn" onClick={() => navigate(-1)}>RETOUR</button>
        </div>
      </div>
    </div>
  );
}