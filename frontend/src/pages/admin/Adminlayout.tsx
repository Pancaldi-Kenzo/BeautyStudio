import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import '../../styles/admin/Adminlayout.css';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="admin-container">
      {/* Barre latérale */}
      <aside className="admin-sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="admin-logo-circle">
            <span className="admin-logo-title">Beauty Studio</span>
            <span className="admin-logo-subtitle">Gérant</span>
          </div>
          <nav className="admin-nav">
            <button 
              className={`admin-side-btn ${location.pathname === '/admin' ? 'active' : ''}`} 
              onClick={() => navigate('/admin')}
            >
              Tableau de Bord
            </button>
            <button 
              className={`admin-side-btn ${location.pathname === '/admin/stocks' ? 'active' : ''}`} 
              onClick={() => navigate('/admin/stocks')}
            >
              Gestion des Stocks
            </button>
            <button 
              className={`admin-side-btn ${location.pathname === '/admin/ventes' ? 'active' : ''}`} 
              onClick={() => navigate('/admin/ventes')}
            >
              Ventes
            </button>
            <button 
              className={`admin-side-btn ${location.pathname === '/admin/parametres' ? 'active' : ''}`} 
              onClick={() => navigate('/admin/parametres')}
            >
              Paramètres
            </button>
          </nav>
        </div>

        {/* Bouton de retour à l'accueil client en bas de la sidebar */}
        <div style={{ padding: '20px' }}>
          <button 
            onClick={() => navigate('/')}
            className="admin-side-btn"
            style={{ 
              backgroundColor: '#c59b67', 
              color: '#fff', 
              textAlign: 'center',
              fontWeight: 'bold',
              border: 'none'
            }}
          >
            Accueil Client
          </button>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}