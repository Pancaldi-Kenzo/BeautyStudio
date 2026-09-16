import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Route pour récupérer les produits de beauté
app.get('/api/products', async (req, res) => {
  try {
    const { data, error } = await supabase.from('beauty_products').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour récupérer le matériel de coiffure
app.get('/api/materials', async (req, res) => {
  try {
    const { data, error } = await supabase.from('beauty_materials').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('beauty_products').select('*').eq('id', id).single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/materials/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('beauty_materials').select('*').eq('id', id).single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Route pour valider une commande
app.post('/api/orders', async (req, res) => {
  try {
    const { items, total_amount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Le panier est vide." });
    }

    // Insertion dans la table 'orders' de Supabase
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          items: items, 
          total_amount: total_amount,
          created_at: new Date()
        }
      ])
      .select();

    if (error) {
      console.error("Erreur Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: "Commande enregistrée avec succès !", order: data[0] });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
});

// Route pour récupérer toutes les commandes
app.get('/api/orders', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Route pour enregistrer une consultation sur la borne
app.post('/api/consultations', async (req, res) => {
  try {
    const { itemId, itemName, itemType } = req.body;
    const { error } = await supabase
      .from('borne_consultations')
      .insert([{ item_id: itemId, item_name: itemName, item_type: itemType }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Consultation enregistrée" });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// Route pour récupérer les statistiques du Dashboard
app.get('/api/admin/dashboard-stats', async (req, res) => {
  try {
    // 1. Récupérer les consultations pour le Top
    const { data: consultations, error: errConsult } = await supabase
      .from('borne_consultations')
      .select('*');

    if (errConsult) throw errConsult;

    // 2. Récupérer les dernières activités admin
    const { data: activities, error: errAct } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (errAct) throw errAct;

    // 3. Récupérer les commandes (orders) pour les stats de ventes
    const { data: orders, error: errOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (errOrders) throw errOrders;

    // Calculs globaux des ventes
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    // Calcul du Top Consultés (groupement par nom d'article)
    const counts: { [key: string]: number } = {};
    consultations.forEach((c) => {
      counts[c.item_name] = (counts[c.item_name] || 0) + 1;
    });

    const topConsulted = Object.keys(counts)
      .map(name => ({ name, count: counts[name] as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4); // Top 4

    res.status(200).json({
      consultations,
      topConsulted,
      activities,
      totalOrders,
      totalRevenue,
      recentOrders: orders.slice(0, 5) // Les 5 dernières commandes pour le dashboard
    });
  } catch (err) {
    console.error("Erreur stats dashboard:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des stats du dashboard." });
  }
});

// Route pour ajouter un produit
app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, image_url, benefits } = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert([{ name, description, price, image_url, benefits }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Produit ajouté avec succès", data });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour ajouter du matériel
app.post('/api/materials', async (req, res) => {
  try {
    const { name, description, price, image_url, benefits } = req.body;
    const { data, error } = await supabase
      .from('materials')
      .insert([{ name, description, price, image_url, benefits }]);

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: "Matériel ajouté avec succès", data });
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur Backend démarré sur le port ${PORT}`);
});