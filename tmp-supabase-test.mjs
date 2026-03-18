import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('SUPABASE_URL', supabaseUrl);
console.log('SUPABASE_KEY exists', !!supabaseAnonKey);

const { data, error } = await supabase.from('PDV').select('*').limit(1);
console.log('error', error);
console.log('data', data);
