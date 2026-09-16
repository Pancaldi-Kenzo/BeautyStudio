import { useState } from 'react';
import axios from 'axios';
import '../../styles/admin/AdminStocks.css'; // Importation du CSS séparé

export default function AdminStocks() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [benefits, setBenefits] = useState('');
  const [itemType, setItemType] = useState<'product' | 'material'>('product');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const endpoint = itemType === 'product' 
      ? 'http://localhost:5000/api/products' 
      : 'http://localhost:5000/api/materials';

    axios.post(endpoint, {
      name,
      description,
      price: Number(price),
      image_url: imageUrl,
      benefits
    })
    .then(() => {
      setSuccessMsg('Article ajouté avec succès !');
      setName('');
      setDescription('');
      setPrice('');
      setImageUrl('');
      setBenefits('');
      setTimeout(() => setSuccessMsg(''), 4000);
    })
    .catch((err) => {
      console.error("Erreur lors de l'ajout :", err);
      alert("Erreur lors de l'enregistrement de l'article.");
    });
  };

  return (
    <div className="admin-page admin-stocks-container">
      <h2>Gestion des Stocks - Ajouter un article</h2>

      {successMsg && (
        <div className="admin-success-msg">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-stock-form">
        
        <div className="form-group">
          <label>Type d'article :</label>
          <select 
            value={itemType} 
            onChange={(e) => setItemType(e.target.value as 'product' | 'material')}
          >
            <option value="product">Produit</option>
            <option value="material">Matériel</option>
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
            rows={3} 
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
          <label>Bénéfices / Caractéristiques (un par ligne) :</label>
          <textarea 
            value={benefits} 
            onChange={(e) => setBenefits(e.target.value)} 
            rows={3} 
          />
        </div>

        <button type="submit" className="admin-submit-btn">
          Ajouter l'article
        </button>
      </form>
    </div>
  );
}