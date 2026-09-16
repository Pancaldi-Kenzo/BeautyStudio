import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/useCart';
import '../styles/Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleValidateOrder = async () => {
    if (cartItems.length === 0) {
      alert("Votre panier est vide !");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/orders', {
        items: cartItems,
        total_amount: totalPrice
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
            <div className="cart-total-price">{totalPrice.toFixed(2)} €</div>
            <p>Nombre d'article : {totalItemsCount}</p>
            
            <button className="validate-btn" onClick={handleValidateOrder}>
              VALIDER
            </button>
            
            <button className="detail-back-btn" onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}