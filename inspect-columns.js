import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function inspectTables() {
  try {
    // Verificar PDV
    const { data: pdvData, error: pdvError } = await supabase.from('PDV').select('*').limit(3);
    console.log('📋 TABELA: PDV');
    if (pdvError) {
      console.error('Erro:', pdvError.message);
    } else if (pdvData && pdvData.length > 0) {
      console.log('Colunas:', Object.keys(pdvData[0]).join(', '));
      console.log('\nPrimeiros 3 registros:');
      pdvData.forEach((pdv, i) => {
        console.log(`\n  Registro ${i + 1}:`);
        console.log(`    - nome: ${pdv.nome}`);
        console.log(`    - cidade: ${pdv.cidade}`);
        console.log(`    - created_date: ${pdv.created_date}`);
      });
    }

    // Verificar RelatorioQualidade
    console.log('\n\n📋 TABELA: RelatorioQualidade');
    const { data: relData, error: relError } = await supabase.from('RelatorioQualidade').select('*').limit(100);
    if (relError) {
      console.error('Erro:', relError.message);
    } else if (relData && relData.length > 0) {
      console.log('Colunas:', Object.keys(relData[0]).join(', '));
      console.log(`\nTotal de registros: ${relData.length}`);
      console.log('\nPrimeiros 5 registros (resumido):');
      relData.slice(0, 5).forEach((rel, i) => {
        console.log(`\n  Registro ${i + 1}:`);
        console.log(`    - id: ${rel.id}`);
        console.log(`    - pdv_id: ${rel.pdv_id}`);
        console.log(`    - pdv_nome: ${rel.pdv_nome}`);
        console.log(`    - auditor: ${rel.auditor}`);
        console.log(`    - data_visita: ${rel.data_visita}`);
      });
      
      // Procurar especificamente pelo id=10
      const rel10 = relData.find(r => r.id === 10);
      if (rel10) {
        console.log('\n\n🎯 Relatório com id=10 encontrado:');
        console.log(`    - pdv_nome: ${rel10.pdv_nome}`);
        console.log(`    - auditor: ${rel10.auditor}`);
      } else {
        console.log('\n\n⚠️  Relatório com id=10 NÃO encontrado');
        console.log('IDs disponíveis:', relData.map(r => r.id).join(', '));
      }
    }

    // Testar query de PDV filtrando por nome
    console.log('\n\n🔍 Teste de FILTER - PDV por nome:');
    const { data: filterPDV, error: filterError } = await supabase
      .from('PDV')
      .select('*')
      .eq('nome', 'PDV - JARAGUÁ')
      .limit(1);
    
    if (filterError) {
      console.error('Erro:', filterError.message);
    } else {
      console.log('Encontrado:', filterPDV.length, 'registros');
      if (filterPDV.length > 0) {
        console.log(JSON.stringify(filterPDV[0], null, 2));
      }
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

inspectTables();
