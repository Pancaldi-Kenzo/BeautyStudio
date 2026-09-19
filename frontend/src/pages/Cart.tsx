import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/useCart';
import '../styles/Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0); // Stocke le pourcentage (ex: 15 pour 15%)
  const [promoMessage, setPromoMessage] = useState('');

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  // Calcul du prix final avec le pourcentage de réduction récupéré de la BDD
  const finalPrice = subtotalPrice * (1 - (discount / 100));

  // Fonction pour vérifier le code promo auprès de l'API
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    try {
      const response = await axios.post('http://localhost:5000/api/promo/verify', {
        code: promoCode.trim()
      });

      if (response.data.valid) {
        setDiscount(response.data.discount_percent);
        setPromoMessage(`Code appliqué : -${response.data.discount_percent}% !`);
      } else {
        setPromoMessage('Code promo invalide ou expiré.');
        setDiscount(0);
      }
    } catch (error) {
      console.error("Erreur vérification code promo :", error);
      setPromoMessage('Code promo invalide.');
      setDiscount(0);
    }
  };

  const handleValidateOrder = async () => {
    if (cartItems.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        items: cartItems,
        total_amount: finalPrice,
        promo_code: discount > 0 ? promoCode : null
      });

      alert("Commande validée avec succès ! ID de commande : " + response.data.order.id);
      clearCart();
      navigate('/produits');
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      alert("Une erreur est survenue lors de la validation de la commande.");
    }
  };

  return (
    <div className="cart-container">
      <header className="cart-header">
        <div className="cart-logo-circle">
          <span className="cart-logo-title">Beauty Studio</span>
          <span className="cart-logo-subtitle">Coiffure</span>
        </div>
      </header>

      <div className="cart-main">
        <h2 className="cart-section-title">Votre Sélection</h2>

        <div className="cart-content-layout">
          <div className="cart-items-list">
            {cartItems.length === 0 ? (
              <p className="cart-empty-msg">Votre panier est vide.</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-card" key={item.id}>
                  <img src={item.image_url} alt={item.name} className="cart-item-img" />
                  <div className="cart-item-details">
                    <span className="cart-item-name">{item.name}</span>
                    <div className="cart-item-actions">
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    {(item.price * item.quantity).toFixed(2)} €
                  </div>
                  <button className="delete-btn" onClick={() => removeFromCart(item.id)}>
                    🗑️ Supprimer
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary-box">
            <h3>Total Estimé</h3>
            
            {/* Section Code Promo Dynamique */}
            <div className="promo-container">
              <div className="promo-input-group">
                <input 
                  type="text" 
                  placeholder="Entrer un code promo" 
                  value={promoCode} 
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={handleApplyPromo} className="promo-apply-btn">
                  Appliquer
                </button>
              </div>
              {promoMessage && (
                <p className={`promo-message ${discount > 0 ? 'success' : 'error'}`}>
                  {promoMessage}
                </p>
              )}
            </div>

            {/* Affichage des montants */}
            {discount > 0 ? (
              <div className="cart-discount-details">
                <p className="subtotal-text">Sous-total : {subtotalPrice.toFixed(2)} €</p>
                <p className="discount-text">Réduction (-{discount}%) : -{(subtotalPrice * (discount / 100)).toFixed(2)} €</p>
                <div className="cart-total-price">{finalPrice.toFixed(2)} €</div>
              </div>
            ) : (
              <div className="cart-total-price">{subtotalPrice.toFixed(2)} €</div>
            )}

            <p className="items-count-text">Nombre d'article : {totalItemsCount}</p>
            
            <button className="validate-btn" onClick={handleValidateOrder}>
              VALIDER
            </button>
            
            <button className="detail-back-btn" onClick={() => navigate(-1)}>
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}