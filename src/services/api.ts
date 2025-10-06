import { supabase } from '../lib/supabase';
import type { AdmissionInfo, Program, NewsArticle, ContactMessage } from '../types';

export const admissionsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AdmissionInfo[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('admissions')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as AdmissionInfo | null;
  },
};

export const programsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('name');

    if (error) throw error;
    return data as Program[];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as Program | null;
  },
};

export const newsApi = {
  getAll: async (published = true) => {
    let query = supabase.from('news').select('*');

    if (published) {
      query = query.eq('published', true);
    }

    const { data, error } = await query.order('published_at', { ascending: false });

    if (error) throw error;
    return data as NewsArticle[];
  },

  getBySlug: async (slug: string) => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle();

    if (error) throw error;
    return data as NewsArticle | null;
  },
};

export const contactApi = {
  create: async (message: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(message)
      .select()
      .single();

    if (error) throw error;
    return data as ContactMessage;
  },
};
