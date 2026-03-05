import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testCRUD() {
  console.log('🧪 Teste de CRUD Operations\n');

  try {
    // 1. CREATE PDV
    console.log('1️⃣ Tentando CREATE um novo PDV...');
    const newPDV = {
      nome: 'PDV TESTE ' + Date.now(),
      endereco: 'Rua Teste, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      responsavel: 'Fulano de Tal',
      telefone: '(11) 99999-9999',
      status: 'ativo'
    };
    
    const { data: createData, error: createError } = await supabase
      .from('PDV')
      .insert([newPDV])
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Erro ao criar PDV:', createError.message);
    } else {
      console.log('✅ PDV criado com sucesso:', createData.nome);
    }

    // 2. CREATE Relatório
    console.log('\n2️⃣ Tentando CREATE um novo Relatório...');
    const newRelatorio = {
      pdv_id: createData?.id || createData?.nome, // prefer numeric id but fall back for old rows
      pdv_nome: createData?.nome,
      data_visita: '2026-03-05',
      auditor: 'Tester',
      status: 'rascunho',
      resultado: 'pendente',
      nota_geral: 50,
      itens_avaliacao: [],
      observacoes_gerais: 'Teste'
    };
    
    const { data: relData, error: relError } = await supabase
      .from('RelatorioQualidade')
      .insert([newRelatorio])
      .select()
      .single();
    
    if (relError) {
      console.error('❌ Erro ao criar Relatório:', relError.message);
    } else {
      console.log('✅ Relatório criado com sucesso:', relData.id);
    }

    // 3. UPDATE PDV
    if (createData) {
      console.log('\n3️⃣ Tentando UPDATE do PDV...');
      const { data: updateData, error: updateError } = await supabase
        .from('PDV')
        .update({ telefone: '(11) 88888-8888' })
        .eq('nome', createData.nome)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Erro ao atualizar PDV:', updateError.message);
      } else {
        console.log('✅ PDV atualizado com sucesso:', updateData.telefone);
      }
    }

    // 4. LIST PDVs
    console.log('\n4️⃣ Listando PDVs...');
    const { data: pdvList, error: listError } = await supabase
      .from('PDV')
      .select('*')
      .limit(3);
    
    if (listError) {
      console.error('❌ Erro ao listar PDVs:', listError.message);
    } else {
      console.log(`✅ ${pdvList.length} PDVs encontrados`);
      if (pdvList.length > 0) {
        console.log('Estrutura:', Object.keys(pdvList[0]).join(', '));
      }
    }

    // 5. LIST Relatórios
    console.log('\n5️⃣ Listando Relatórios...');
    const { data: relList, error: relListError } = await supabase
      .from('RelatorioQualidade')
      .select('*')
      .limit(3);
    
    if (relListError) {
      console.error('❌ Erro ao listar Relatórios:', relListError.message);
    } else {
      console.log(`✅ ${relList.length} Relatórios encontrados`);
      if (relList.length > 0) {
        console.log('Estrutura:', Object.keys(relList[0]).join(', '));
      }
    }

  } catch (err) {
    console.error('❌ Erro geral:', err.message);
  }
}

testCRUD();
