import { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/Adminlayout.css';
import '../../styles/admin/AdminVentes.css';

interface Order {
  id: number;
  items: Array<{ id: string | number; name: string; price: number; quantity: number }>;
  total_amount: number;
  created_at: string;
}

interface SupplierItem {
  name: string;
  totalQuantity: number;
}

export default function AdminVentes() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders')
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des ventes :", error);
        setLoading(false);
      });
  }, []);

  // Calcul dynamique du résumé des articles à commander au fournisseur
  const supplierSummary: SupplierItem[] = (() => {
    const summaryMap: { [key: string]: number } = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (summaryMap[item.name]) {
          summaryMap[item.name] += item.quantity;
        } else {
          summaryMap[item.name] = item.quantity;
        }
      });
    });

    return Object.keys(summaryMap).map((name) => ({
      name,
      totalQuantity: summaryMap[name],
    }));
  })();

  return (
    <div className="admin-page ventes-page container-fluid py-4">
      <h2 className="mb-4">Gestion des Ventes & Réassort Fournisseur</h2>
      
      {/* 📦 Section Résumé Fournisseur */}
      <div className="dashboard-box supplier-box mb-4">
        <h3 className="dashboard-box-title supplier-box-title mb-3">
          📦 Résumé des articles à commander au fournisseur
        </h3>

        {loading ? (
          <p>Calcul des besoins...</p>
        ) : supplierSummary.length === 0 ? (
          <p className="supplier-empty-text">Aucun article à recommander pour le moment.</p>
        ) : (
          <div className="supplier-table-container">
            <table className="admin-table">
              <thead>
                <tr className="supplier-table-header-row">
                  <th>Article</th>
                  <th>Quantité Totale à Commander</th>
                </tr>
              </thead>
              <tbody>
                {supplierSummary.map((item, index) => (
                  <tr key={index} className="supplier-table-body-row">
                    <td>{item.name}</td>
                    <td className="supplier-qty-cell">
                      {item.totalQuantity} unité(s)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 📋 Liste des Commandes Client */}
      <h3 className="mb-3">Historique des Commandes</h3>
      {loading ? (
        <p className="ventes-loading">Chargement des ventes...</p>
      ) : orders.length === 0 ? (
        <p className="ventes-empty">Aucune commande enregistrée pour le moment.</p>
      ) : (
        <div className="orders-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID Commande</th>
                <th>Date</th>
                <th>Articles</th>
                <th>Total (€)</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString()}</td>
                  <td>
                    <ul className="order-items-list-mini">
                      {order.items.map((item, index) => (
                        <li key={index}>
                          {item.name} (x{item.quantity}) - {(item.price * item.quantity).toFixed(2)} €
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <span className="order-total-amount">{Number(order.total_amount).toFixed(2)} €</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}