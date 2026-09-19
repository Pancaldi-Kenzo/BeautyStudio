import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getProducts = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('beauty_products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('beauty_products').select('*').eq('id', id).single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, image_url, benefits } = req.body;
  const { data, error } = await supabase.from('beauty_products').insert([{ name, description, price, image_url, benefits }]);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('admin_activity_logs').insert([
    { action_description: `Ajout du produit : ${name}` }
  ]);

  res.status(201).json(data);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, image_url, benefits } = req.body;
  const { data, error } = await supabase.from('beauty_products').update({ name, description, price, image_url, benefits }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('admin_activity_logs').insert([
    { action_description: `Modification du produit : ${name}` }
  ]);

  res.json(data);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from('beauty_products').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('admin_activity_logs').insert([
    { action_description: `Suppression du produit ID : ${id}` }
  ]);

  res.json({ message: "Produit supprimé avec succès" });
};