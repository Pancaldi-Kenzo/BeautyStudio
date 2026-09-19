import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase.js';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('beauty_settings')
      .select('*')
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Erreur lecture paramètres :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { admin_password, promo_code } = req.body;

    let updateData: any = {
      promo_code: promo_code
    };

    // Si un nouveau mot de passe est fourni et qu'il ne s'agit pas déjà d'un hash bcrypt existant
    if (admin_password && !admin_password.startsWith('$2b$')) {
      // On le chiffre proprement avec bcrypt avant de l'enregistrer
      const hashedPassword = await bcrypt.hash(admin_password, 10);
      updateData.admin_password = hashedPassword;
    } else if (admin_password) {
      // Si c'est déjà un hash (cas où l'admin n'a pas touché au champ mdp), on le laisse tel quel
      updateData.admin_password = admin_password;
    }

    const { data, error } = await supabase
      .from('beauty_settings')
      .update(updateData)
      .neq('admin_password', '') // Met à jour la ligne existante
      .select();

    if (error) {
      console.error("Erreur Supabase update settings:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: "Paramètres mis à jour avec succès !", data });
  } catch (err) {
    console.error("Erreur serveur update settings:", err);
    res.status(500).json({ error: "Erreur interne du serveur." });
  }
};

export const verifyPromoCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    console.log("Code promo reçu du panier :", code);

    const { data, error } = await supabase
      .from('beauty_settings')
      .select('promo_code')
      .single();

    console.log("Données brutes reçues de Supabase :", data);

    if (error || !data || !data.promo_code) {
      console.log("Erreur ou pas de données trouvées");
      return res.status(200).json({ valid: false });
    }

    let promoList = data.promo_code;

    if (typeof promoList === 'string') {
      try {
        promoList = JSON.parse(promoList);
      } catch (e) {
        console.log("Erreur parsing JSON:", e);
        promoList = [];
      }
    }

    console.log("Liste des promos transformée en tableau :", promoList);

    if (!Array.isArray(promoList)) {
      return res.status(200).json({ valid: false });
    }

    const foundPromo = promoList.find(
      (item: any) => item.code.trim().toUpperCase() === code.trim().toUpperCase()
    );

    console.log("Code promo trouvé :", foundPromo);

    if (foundPromo) {
      return res.json({
        valid: true,
        discount_percent: foundPromo.discount
      });
    } else {
      return res.json({ valid: false });
    }

  } catch (err) {
    console.error("Erreur serveur :", err);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};