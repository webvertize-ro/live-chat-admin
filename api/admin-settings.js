import { supabase } from '../src/db/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'PATCH') {
    const { notification_sound_enabled } = req.body;

    const { data, error } = await supabase
      .from('admin_settings')
      .update({ notification_sound_enabled })
      .eq('id', req.body.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  res.status(405).end();
}
