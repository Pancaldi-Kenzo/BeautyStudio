import { useState, useEffect } from 'react';
import axios from 'axios';

interface TopItem {
  name: string;
  count: number;
}

interface Activity {
  id: number;
  action_description: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [topConsulted, setTopConsulted] = useState<TopItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dashboard-stats?t=' + Date.now())
      .then((response) => {
        setTopConsulted(response.data.topConsulted);
        setActivities(response.data.activities);
        setTotalOrders(response.data.totalOrders);
        setTotalRevenue(response.data.totalRevenue);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur chargement dashboard :", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4 fw-bold text-dark border-bottom pb-2">Tableau de Bord - Vue d'ensemble</h2>

      {/* Cartes de Statistiques Globales */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 p-4 text-center h-100 bg-white">
            <h5 className="text-muted mb-2 fs-6">Chiffre d'Affaires Total</h5>
            <p className="fs-3 fw-bold mb-0" style={{ color: '#c59b67' }}>
              {loading ? '...' : `${totalRevenue.toFixed(2)} €`}
            </p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0 p-4 text-center h-100 bg-white">
            <h5 className="text-muted mb-2 fs-6">Commandes Totales</h5>
            <p className="fs-3 fw-bold text-dark mb-0">
              {loading ? '...' : totalOrders}
            </p>
          </div>
        </div>
      </div>

      {/* Grille inférieure : Top Consultés & Dernières Activités */}
      <div className="row g-4">
        
        {/* Top Consultés */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 p-4 h-100 bg-white">
            <h3 className="h5 fw-bold mb-3 text-dark">Top Consultés</h3>
            {loading ? (
              <p className="text-muted">Chargement...</p>
            ) : topConsulted.length === 0 ? (
              <p className="text-muted small">Aucune consultation enregistrée.</p>
            ) : (
              <ul className="list-group list-group-flush">
                {topConsulted.map((item, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center px-0 bg-transparent">
                    <span className="text-dark">{index + 1}. {item.name}</span>
                    <span className="badge bg-light text-dark border" style={{ color: '#c59b67' }}>
                      {item.count} vues
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Dernières Activités */}
        <div className="col-12 col-lg-6">
          <div className="card shadow-sm border-0 p-4 h-100 bg-white">
            <h3 className="h5 fw-bold mb-3 text-dark">Dernières Activités</h3>
            {loading ? (
              <p className="text-muted">Chargement...</p>
            ) : activities.length === 0 ? (
              <p className="text-muted small">Aucune activité récente.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {activities.map((act) => (
                  <div key={act.id} className="border-bottom pb-2">
                    <p className="mb-1 text-dark small">{act.action_description}</p>
                    <small className="text-muted d-block" style={{ fontSize: '11px' }}>
                      {new Date(act.created_at).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}