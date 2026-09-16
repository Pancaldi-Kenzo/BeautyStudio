import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Scissors } from 'lucide-react';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  // Fonction de déclenchement secret (3 clics rapides)
  const handleSecretAdminAccess = () => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 3) {
        navigate('/admin');
        return 0;
      }
      
      // Réinitialise le compteur si on clique trop lentement (après 1 seconde)
      setTimeout(() => setClickCount(0), 1000);
      return newCount;
    });
  };

  return (
    <div className="home-container">
      <div className="home-overlay"></div>
      <div className="home-content">
        <h1 
          className="home-title" 
          onClick={handleSecretAdminAccess}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          title=""
        >
          BeautyStudio
        </h1>
        <div className="home-button-container">
          <button className="home-card product" onClick={() => navigate('/produits')}>
            <Package size={48} color="#fff" />
            <span className="home-card-text">Produit</span>
          </button>
          <button className="home-card material" onClick={() => navigate('/materiel')}>
            <Scissors size={48} color="#fff" />
            <span className="home-card-text">MATERIEL</span>
          </button>
        </div>
      </div>
    </div>
  );
}