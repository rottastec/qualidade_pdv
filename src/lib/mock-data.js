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
    update: async (identifier, data) => {
      // identifier may be PDV name or numeric id; use id if it looks numeric
      let query = supabase.from('PDV').update(data);
      const idNum = Number(identifier);
      if (!isNaN(idNum) && identifier !== '' && identifier !== null) {
        query = query.eq('id', idNum);
      } else {
        query = query.eq('nome', identifier);
      }

      const { data: result, error } = await query.select().single();

      if (error) throw error;
      return result;
    }
  }
};