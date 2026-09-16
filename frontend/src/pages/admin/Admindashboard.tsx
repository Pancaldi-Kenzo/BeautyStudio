import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/Adminlayout.css';
import '../../styles/admin/AdminDashboard.css';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dashboard-stats?t=' + Date.now())
      .then((response) => {
        setTopConsulted(response.data.topConsulted);
        setActivities(response.data.activities);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur chargement dashboard :", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="admin-page dashboard-page">
      <h2>Tableau de Bord - Vue d'ensemble</h2>

      {/* Grille inférieure : Top Consultés & Dernières Activités */}
      <div className="dashboard-grid">
        
        {/* Top Consultés Réel */}
        <div className="dashboard-box">
          <h3 className="dashboard-box-title">Top Consultés</h3>
          {loading ? (
            <p>Chargement...</p>
          ) : topConsulted.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#666' }}>Aucune consultation enregistrée.</p>
          ) : (
            <ul className="dashboard-list">
              {topConsulted.map((item, index) => (
                <li key={index} className="dashboard-list-item">
                  {index + 1}. {item.name} <span style={{ color: '#c59b67', fontSize: '12px' }}>({item.count} vues)</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Dernières Activités Réelles */}
        <div className="dashboard-box">
          <h3 className="dashboard-box-title">Dernières Activités</h3>
          {loading ? (
            <p>Chargement...</p>
          ) : activities.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#666' }}>Aucune activité récente.</p>
          ) : (
            <div className="dashboard-activity-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activities.map((act) => (
                <p key={act.id} className="dashboard-activity-item">
                  {act.action_description}
                  <span style={{ display: 'block', fontSize: '10px', color: '#888', marginTop: '2px' }}>
                    {new Date(act.created_at).toLocaleString()}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}