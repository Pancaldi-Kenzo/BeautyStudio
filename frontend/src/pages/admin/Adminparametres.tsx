import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/AdminParametres.css';

interface PromoCode {
  code: string;
  discount: number;
}

export default function AdminParametres() {
  const [adminPassword, setAdminPassword] = useState('');
  
  // Gestion de la liste des codes promo
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [newCodeName, setNewCodeName] = useState('');
  const [newCodeDiscount, setNewCodeDiscount] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);

  // Charger les paramètres depuis le backend au démarrage
  useEffect(() => {
    axios.get('http://localhost:5000/api/settings')
      .then((res) => {
        if (res.data) {
          setAdminPassword(res.data.admin_password || '');
          
          if (res.data.promo_code) {
            let parsedCodes = res.data.promo_code;
            
            if (typeof parsedCodes === 'string') {
              try {
                parsedCodes = JSON.parse(parsedCodes);
              } catch (e) {
                console.error("Erreur parsing promo_code:", e);
                parsedCodes = [];
              }
            }

            if (Array.isArray(parsedCodes)) {
              setPromoCodes(parsedCodes);
            } else {
              setPromoCodes([]);
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur chargement paramètres :", err);
        setLoading(false);
      });
  }, []);

  // Ajouter un code promo à la liste locale
  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCodeName.trim() || !newCodeDiscount) return;

    const discountNum = Number(newCodeDiscount);
    if (isNaN(discountNum)) {
      alert("Veuillez entrer un pourcentage valide.");
      return;
    }

    setPromoCodes([...promoCodes, { code: newCodeName.trim(), discount: discountNum }]);
    setNewCodeName('');
    setNewCodeDiscount('');
  };

  // Supprimer un code promo de la liste locale
  const handleRemovePromo = (indexToRemove: number) => {
    setPromoCodes(promoCodes.filter((_, index) => index !== indexToRemove));
  };

  // Sauvegarder les modifications via l'API
  const handleSave = () => {
    axios.put('http://localhost:5000/api/settings', {
      admin_password: adminPassword,
      promo_code: promoCodes // Envoi du tableau complet vers le champ JSONB Supabase
    })
    .then(() => {
      setSuccessMsg('Paramètres enregistrés avec succès dans la base de données !');
      setTimeout(() => setSuccessMsg(''), 4000);
    })
    .catch((err) => {
      console.error("Erreur sauvegarde :", err);
      alert("Erreur lors de la sauvegarde des paramètres.");
    });
  };

  if (loading) {
    return (
      <div className="admin-page admin-parametres-page">
        <p>Chargement des paramètres...</p>
      </div>
    );
  }

  return (
    <div className="admin-page admin-parametres-page container-fluid py-4">
      <h2 className="parametres-title">Paramètres de l'application</h2>

      {successMsg && (
        <div className="admin-success-alert">
          {successMsg}
        </div>
      )}

      {/* Grille Bootstrap pour l'alignement responsive */}
      <div className="row g-4 parametres-grid">
        
        {/* 1. Sécurité */}
        <div className="col-12 col-lg-6">
          <div className="parametres-card h-100">
            <div className="card-header">
              <h3>Sécurité</h3>
            </div>
            <div className="card-body">
              <div className="param-field">
                <label>Mot de Passe Administrateur</label>
                <input 
                  type="password" 
                  value={adminPassword} 
                  onChange={(e) => setAdminPassword(e.target.value)} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Codes Promo Dynamiques */}
        <div className="col-12 col-lg-6">
          <div className="parametres-card h-100">
            <div className="card-header">
              <h3>Codes Promo</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddPromo} className="promo-add-row">
                <input 
                  type="text" 
                  placeholder="Nom du code" 
                  value={newCodeName} 
                  onChange={(e) => setNewCodeName(e.target.value)} 
                />
                <input 
                  type="number" 
                  placeholder="%" 
                  value={newCodeDiscount} 
                  onChange={(e) => setNewCodeDiscount(e.target.value)} 
                />
                <button type="submit" className="btn-add-promo">Ajouter</button>
              </form>

              <ul className="promo-list">
                {promoCodes.length === 0 ? (
                  <p style={{ fontSize: '13px', color: '#666', textAlign: 'center' }}>Aucun code promo actif.</p>
                ) : (
                  promoCodes.map((item, index) => (
                    <li key={index} className="promo-item">
                      <span><strong>{item.discount}%</strong> - {item.code}</span>
                      <button 
                        type="button" 
                        className="btn-delete-promo" 
                        onClick={() => handleRemovePromo(index)}
                      >
                        Supprimer
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

      </div>

      {/* Bouton global d'enregistrement */}
      <div className="mt-4 text-end">
        <button 
          onClick={handleSave} 
          className="btn-add-promo"
          style={{ padding: '12px 25px', fontSize: '16px' }}
        >
          Enregistrer tous les paramètres
        </button>
      </div>

    </div>
  );
}