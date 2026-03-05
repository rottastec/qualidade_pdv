import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugTables() {
  console.log('🔍 Analisando estrutura das tabelas...\n');

  try {
    // Lista de possíveis nomes de tabelas
    const tableNames = ['PDV', 'pdv', 'RelatorioQualidade', 'relatorio_qualidade', 'relatorios', 'public_PDV'];

    for (const tableName of tableNames) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' });

        if (!error) {
          console.log(`✅ ENCONTRADA: "${tableName}"`);
          console.log(`   - Registros: ${data?.length || 0}`);
          if (data && data.length > 0) {
            console.log(`   - Colunas: ${Object.keys(data[0]).join(', ')}`);
            console.log(`   - Primeiro registro:\n${JSON.stringify(data[0], null, 2)}\n`);
          } else {
            console.log(`   - Tabela vazia\n`);
          }
        }
      } catch (e) {
        // Ignore
      }
    }

    // Tentar verificar RLS policies
    console.log('\n⚠️  Se nenhuma tabela foi encontrada, pode ser um problema de RLS.');
    console.log('Verifique no Supabase:\n');
    console.log('1. Authentication > Policies');
    console.log('2. Certifique-se de que "SELECT" é permitido para usuários anônimos');
    console.log('3. Ou desabilite RLS temporariamente para testar\n');

    // Tentar com autenticação
    console.log('Testando com modo anônimo (sem autenticação)...\n');
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    
    if (anonError) {
      console.log('⚠️  Erro ao fazer login anônimo:', anonError.message);
    } else {
      console.log('✅ Login anônimo bem-sucedido');
      
      // Tentar novamente após autenticação
      const { data: pdvData, error: pdvError } = await supabase
        .from('PDV')
        .select('*');
      
      if (pdvError) {
        console.error('❌ Erro depois da autenticação:', pdvError.message);
      } else {
        console.log(`✅ PDVs encontrados após autenticação: ${pdvData?.length || 0}`);
        if (pdvData && pdvData.length > 0) {
          console.log(`   Colunas: ${Object.keys(pdvData[0]).join(', ')}`);
          console.log(`   Primeiro registro:\n${JSON.stringify(pdvData[0], null, 2)}`);
        }
      }
    }

  } catch (err) {
    console.error('❌ Erro:', err.message);
  }
}

debugTables();
