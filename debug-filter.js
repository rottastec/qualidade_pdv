import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testFilter() {
  console.log('🔍 Testando filter de RelatorioQualidade\n');

  try {
    // Teste o filtro exatamente como está em mock-data.js
    console.log('Teste 1️⃣: filter({ id: 10 })');
    let query = supabase.from('RelatorioQualidade').select('*');
    query = query.eq('id', 10);
    const { data: result1, error: error1 } = await query;
    
    if (error1) {
      console.error('❌ Erro:', error1.message);
    } else {
      console.log(`✅ Encontrados ${result1.length} registros`);
      if (result1.length > 0) {
        console.log('Primeiro resultado:');
        console.log(JSON.stringify(result1[0], (key, value) => {
          if (key === 'itens_avaliacao' && Array.isArray(value)) {
            return `[${value.length} itens]`;
          }
          return value;
        }, 2));
      }
    }

    // Teste com string
    console.log('\n\nTeste 2️⃣: filter({ id: "10" })');
    let query2 = supabase.from('RelatorioQualidade').select('*');
    query2 = query2.eq('id', '10');
    const { data: result2, error: error2 } = await query2;
    
    if (error2) {
      console.error('❌ Erro:', error2.message);
    } else {
      console.log(`✅ Encontrados ${result2.length} registros`);
    }

    // Teste listando todos e depois filtrando em JS
    console.log('\n\nTeste 3️⃣: select todos e filter em JS');
    const { data: allRels, error: errorAll } = await supabase
      .from('RelatorioQualidade')
      .select('id, pdv_nome, auditor');
    
    if (errorAll) {
      console.error('❌ Erro:', errorAll.message);
    } else {
      console.log(`Total de relatórios: ${allRels.length}`);
      console.log('Todos os IDs:', allRels.map(r => r.id).join(', '));
      const found = allRels.find(r => r.id === 10);
      if (found) {
        console.log('✅ id=10 encontrado via JS filter:', found);
      } else {
        console.log('❌ id=10 não encontrado via JS filter');
      }
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

testFilter();
