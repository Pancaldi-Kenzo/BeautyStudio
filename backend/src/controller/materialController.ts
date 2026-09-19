import type { Request, Response } from 'express';
import { supabase } from '../config/supabase.js';

export const getMaterials = async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('beauty_materials').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('beauty_materials').select('*').eq('id', id).single();
    if (error) throw error;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaterial = async (req: Request, res: Response) => {
  const { name, description, price, image_url, benefits } = req.body;
  const { data, error } = await supabase.from('beauty_materials').insert([{ name, description, price, image_url, benefits }]);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('admin_activity_logs').insert([
    { action_description: `Ajout du matériel : ${name}` }
  ]);

  res.status(201).json(data);
};

export const updateMaterial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, image_url, benefits } = req.body;
  const { data, error } = await supabase.from('beauty_materials').update({ name, description, price, image_url, benefits }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('admin_activity_logs').insert([
    { action_description: `Modification du matériel : ${name}` }
  ]);

  res.json(data);
};

export const deleteMaterial = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await supabase.from('beauty_materials').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });

  await supabase.from('admin_activity_logs').insert([
    { action_description: `Suppression du matériel ID : ${id}` }
  ]);

  res.json({ message: "Matériel supprimé avec succès" });
};