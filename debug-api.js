import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAPIFunctions() {
  console.log('🧪 Testando funções de API do mock-data.js\n');

  try {
    // Teste 1: Listar PDVs
    console.log('1️⃣ mockAPI.pdvs.list()');
    console.log('═'.repeat(60));
    const pdvs = await supabase.from('PDV').select('*');
    console.log('Resposta Supabase:', JSON.stringify(pdvs, null, 2));

    // Teste 2: Listar Relatórios
    console.log('\n\n2️⃣ mockAPI.relatorios.list()');
    console.log('═'.repeat(60));
    const relatorios = await supabase
      .from('RelatorioQualidade')
      .select('*')
      .order('created_date', { ascending: false });
    console.log('Resposta Supabase:', JSON.stringify(relatorios, null, 2));

    // Teste 3: Filter por ID
    if (relatorios.data && relatorios.data.length > 0) {
      const firstId = relatorios.data[0].id;
      console.log('\n\n3️⃣ mockAPI.relatorios.filter({ id: "' + firstId + '" })');
      console.log('═'.repeat(60));
      const filtered = await supabase
        .from('RelatorioQualidade')
        .select('*')
        .eq('id', firstId);
      console.log('Resposta Supabase:', JSON.stringify(filtered, null, 2));
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

testAPIFunctions();
