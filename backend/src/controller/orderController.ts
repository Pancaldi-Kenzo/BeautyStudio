import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getOrders = async (req: Request, res: Response) => {
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
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    // On récupère aussi le code promo optionnel envoyé par le frontend
    const { items, promoCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Le panier est vide." });
    }

    // 1. Calcul du sous-total brut basé sur les articles du panier
    let subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    let discountAmount = 0;

    // 2. Si un code promo est fourni, on le vérifie de manière sécurisée côté backend dans 'beauty_settings'
    if (promoCode && promoCode.trim() !== "") {
      const { data: settingsData, error: settingsError } = await supabase
        .from('beauty_settings')
        .select('promo_code')
        .single();

      if (!settingsError && settingsData && settingsData.promo_code) {
        let promoList = settingsData.promo_code;
        if (typeof promoList === 'string') {
          try { promoList = JSON.parse(promoList); } catch (e) { promoList = []; }
        }

        if (Array.isArray(promoList)) {
          const found = promoList.find(
            (p: any) => p.code.trim().toUpperCase() === promoCode.trim().toUpperCase()
          );

          if (found) {
            // Calcul de la réduction réelle sur le serveur
            discountAmount = (subtotal * found.discount) / 100;
          }
        }
      }
    }

    // 3. Calcul final du montant sécurisé
    const finalTotal = Number((subtotal - discountAmount).toFixed(2));

    // 4. Insertion de la commande avec le montant calculé et vérifié par le serveur
    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          items: items, 
          total_amount: finalTotal,
          created_at: new Date()
        }
      ])
      .select();

    if (error) {
      console.error("Erreur Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    await supabase.from('admin_activity_logs').insert([
      { action_description: `Nouvelle commande validée (Total: ${finalTotal} €)` }
    ]);

    res.status(201).json({ message: "Commande enregistrée avec succès !", order: data[0] });
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};