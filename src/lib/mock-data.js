// Supabase data integration - replaces mock data

import { supabase } from '../api/supabaseClient';

// API functions using Supabase
export const mockAPI = {
  relatorios: {
    list: async (order = '-created_date', limit = 50) => {
      let query = supabase
        .from('RelatorioQualidade')
        .select('*')
        .limit(limit);

      if (order === '-created_date') {
        query = query.order('created_date', { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    filter: async (filters) => {
      let query = supabase.from('RelatorioQualidade').select('*');

      if (filters.id) {
        query = query.eq('id', filters.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    create: async (data) => {
      const { data: result, error } = await supabase
        .from('RelatorioQualidade')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    }
  },
  pdvs: {
    list: async () => {
      const { data, error } = await supabase
        .from('PDV')
        .select('*');

      if (error) throw error;
      return data;
    },
    create: async (data) => {
      const { data: result, error } = await supabase
        .from('PDV')
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    update: async (nome, data) => {
      const { data: result, error } = await supabase
        .from('PDV')
        .update(data)
        .eq('nome', nome)
        .select()
        .single();

      if (error) throw error;
      return result;
    }
  }
};