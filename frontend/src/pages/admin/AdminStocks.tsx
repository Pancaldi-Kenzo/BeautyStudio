import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/Adminstocks.css';

interface StockItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  benefits: string;
  type: 'product' | 'material';
}

export default function AdminStocks() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  // États du formulaire
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [benefits, setBenefits] = useState('');
  const [itemType, setItemType] = useState<'product' | 'material'>('product');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchItems = () => {
    setLoading(true);
    Promise.all([
      axios.get('http://localhost:5000/api/products').catch(() => ({ data: [] })),
      axios.get('http://localhost:5000/api/materials').catch(() => ({ data: [] }))
    ])
    .then(([prodRes, matRes]) => {
      const products = (prodRes.data || []).map((p: any) => ({ ...p, type: 'product' }));
      const materials = (matRes.data || []).map((m: any) => ({ ...m, type: 'material' }));
      setItems([...products, ...materials]);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Erreur chargement stocks :", err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Gérer l'ajout ou la mise à jour
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = itemType === 'product' 
      ? 'http://localhost:5000/api/products' 
      : 'http://localhost:5000/api/materials';

    if (editingId) {
      // Mode Modification (PUT)
      axios.put(`${endpoint}/${editingId}`, {
        name,
        description,
        price: Number(price),
        image_url: imageUrl,
        benefits
      })
      .then(() => {
        setSuccessMsg('Article modifié avec succès !');
        resetForm();
        fetchItems();
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch((err) => {
        console.error("Erreur lors de la modification :", err);
        alert("Erreur lors de la modification de l'article.");
      });
    } else {
      // Mode Ajout (POST)
      axios.post(endpoint, {
        name,
        description,
        price: Number(price),
        image_url: imageUrl,
        benefits
      })
      .then(() => {
        setSuccessMsg('Article ajouté avec succès !');
        resetForm();
        fetchItems();
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch((err) => {
        console.error("Erreur lors de l'ajout :", err);
        alert("Erreur lors de l'enregistrement de l'article.");
      });
    }
  };

  // Charger un article dans le formulaire pour modification
  const handleEditClick = (item: StockItem) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || '');
    setPrice(String(item.price));
    setImageUrl(item.image_url || '');
    setBenefits(item.benefits || '');
    setItemType(item.type);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonte vers le formulaire
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setBenefits('');
  };

  // Suppression d'un article
  const handleDelete = (id: string | number, type: 'product' | 'material') => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    const endpoint = type === 'product' 
      ? `http://localhost:5000/api/products/${id}` 
      : `http://localhost:5000/api/materials/${id}`;

    axios.delete(endpoint)
      .then(() => {
        setSuccessMsg('Article supprimé avec succès.');
        fetchItems();
        setTimeout(() => setSuccessMsg(''), 4000);
      })
      .catch((err) => {
        console.error("Erreur lors de la suppression :", err);
        alert("Erreur lors de la suppression.");
      });
  };

  return (
    <div className="admin-page admin-stocks-container container-fluid py-4">
      <h2 className="mb-4">Gestion des Stocks</h2>

      {successMsg && (
        <div className="admin-success-msg">
          {successMsg}
        </div>
      )}

      {/* Formulaire d'ajout / modification */}
      <form onSubmit={handleSubmit} className="admin-stock-form mb-5">
        <h3 className="mb-3">{editingId ? "Modifier l'article" : "Ajouter un nouvel article"}</h3>
        
        <div className="form-group">
          <label>Type d'article :</label>
          <select 
            value={itemType} 
            onChange={(e) => setItemType(e.target.value as 'product' | 'material')}>
            <option value="product">Produit (Coiffure / Soin)</option>
            <option value="material">Matériel (Appareil / Outil)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Nom :</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Description :</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            rows={2} 
          />
        </div>

        <div className="form-group">
          <label>Prix (€) :</label>
          <input 
            type="number" 
            step="0.01" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>URL de l'image :</label>
          <input 
            type="text" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder="https://..." 
          />
        </div>

        <div className="form-group">
          <label>Bénéfices / Caractéristiques :</label>
          <textarea 
            value={benefits} 
            onChange={(e) => setBenefits(e.target.value)} 
            rows={2} 
          />
        </div>

        <div className="admin-form-actions">
          <button type="submit" className="admin-submit-btn">
            {editingId ? "Enregistrer les modifications" : "Ajouter l'article"}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={resetForm} 
              className="admin-cancel-btn"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      {/* Liste et Tableau des Stocks Existants */}
      <div className="admin-stocks-section">
        <h3>Liste des articles enregistrés</h3>

        {loading ? (
          <p>Chargement des stocks...</p>
        ) : items.length === 0 ? (
          <p>Aucun article en stock pour le moment.</p>
        ) : (
          <div className="stocks-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={`${item.type}-${item.id}`}>
                    <td>
                      <span className={`badge-type ${item.type === 'product' ? 'badge-product' : 'badge-material'}`}>
                        {item.type === 'product' ? 'Produit' : 'Matériel'}
                      </span>
                    </td>
                    <td className="item-name-cell">{item.name}</td>
                    <td>{Number(item.price).toFixed(2)} €</td>
                    <td className="item-desc-cell">{item.description || '-'}</td>
                    <td>
                      <div className="btn-actions">
                        <button 
                          className="btn-edit" 
                          onClick={() => handleEditClick(item)}
                        >
                          Modifier
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDelete(item.id, item.type)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}