import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin/Adminlogin.css';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        password
      });

      if (response.data.success) {
        sessionStorage.setItem('isAdminAuth', 'true');
        navigate('/admin');
      }
    } catch (err) {
      setError('Mot de passe incorrect.');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center">
      <div className="row w-100 justify-content-center g-0">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4 d-flex justify-content-center">
          <form onSubmit={handleSubmit} className="admin-login-form w-100">
            <h2>Accès Administrateur</h2>
            
            {error && <div className="admin-login-error">{error}</div>}

            <div className="param-field">
              <label>Mot de passe</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
              />
            </div>

            <button type="submit" className="btn-admin-login">
              Se connecter
            </button>

            {/* Bouton pour retourner sur le site public */}
            <button 
              type="button" 
              onClick={() => navigate('/')}
              className="btn-admin-home"
            >
              Retour à l'accueil du site
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}