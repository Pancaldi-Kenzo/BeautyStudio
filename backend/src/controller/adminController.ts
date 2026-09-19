import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.js';

// Connexion Admin
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { password } = req.body;

    const { data, error } = await supabase
      .from('beauty_settings')
      .select('admin_password')
      .single();

    if (error || !data) {
      return res.status(401).json({ success: false, message: "Paramètres introuvables" });
    }

    const match = await bcrypt.compare(password, data.admin_password);

    if (match) {
      res.json({ success: true, message: "Connexion réussie" });
    } else {
      res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }
  } catch (err) {
    console.error("Erreur login :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// Statistiques Dashboard & Activités
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { data: consultations, error: errConsult } = await supabase
      .from('borne_consultations')
      .select('*');

    if (errConsult) throw errConsult;

    const { data: activities, error: errAct } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (errAct) throw errAct;

    const { data: orders, error: errOrders } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (errOrders) throw errOrders;

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

    const counts: { [key: string]: number } = {};
    consultations.forEach((c) => {
      counts[c.item_name] = (counts[c.item_name] || 0) + 1;
    });

    const topConsulted = Object.keys(counts)
      .map(name => ({ name, count: counts[name] as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    res.status(200).json({
      consultations,
      topConsulted,
      activities,
      totalOrders,
      totalRevenue,
      recentOrders: orders.slice(0, 5)
    });
  } catch (err) {
    console.error("Erreur stats dashboard:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des stats du dashboard." });
  }
};

export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const postConsultation = async (req: Request, res: Response) => {
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
};