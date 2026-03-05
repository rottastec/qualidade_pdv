import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Mapeamento de itens para setores (para relatórios antigos que não têm o campo setor)
const itemSetorMap = {
  // DOCUMENTAÇÃO GERAL
  'Memorial descritivo da loja impresso e encadernado para utilização no PDV': 'PDV',
  'Alvará de funcionamento instalado em quadro na parede': 'PDV',
  'Alvará de bombeiros instalado em quadro na parede': 'PDV',
  // ESTRUTURA DA LOJA
  'Pintura da fachada (padrão de cor e manutenção)': 'PDV',
  'Logo Rottas (padrão de cor e manutenção)': 'PDV',
  'Esquadrias em bom estado e sem avarias': 'PDV',
  'Manutenção da estrutura externa': 'PDV',
  'Estruturas sem infiltração ou vazamentos nas paredes': 'PDV',
  'Paisagismo (grama) em bom estado e aparado': 'MKT',
  'Paisagismo (ornamental) em bom estado, sem plantas mortas, mato ou caídas': 'PDV',
  'Acessos sem obstrução': 'PDV',
  'Qualidade dos forros': 'PDV',
  'Fechaduras e trincos das lojas funcionando': 'PDV',
  // DECORAÇÃO E MOBILIÁRIOS DA LOJA
  'Móveis em bom estado, sem avarias': 'PDV',
  'Cadeiras em bom estado, sem avarias': 'PDV',
  'Sofás limpos e sem manchas': 'PDV',
  'Bate cadeiras em bom estado': 'PDV',
  'Apresenta apoio para café em bom estado; (Bandeja e Louças)': 'PDV',
  'Tapetes limpos e bem conservados': 'PDV',
  'Marcenaria bem conservada, sem apresentar manchas e peças faltando': 'PDV',
  'Parede verde em bom estado': 'PDV',
  'Louças em bom estado': 'PDV',
  'Pedras do banheiro e copa em bom estado': 'PDV',
  'Saboneteiras e papeleiras funcionando': 'PDV',
  // MAQUETE
  'Maquete limpa e sem avarias': 'PDV',
  'Vegetação decorativa da maquete limpas e organizadas': 'PDV',
  'Vidros e cantoneiras em bom estado': 'PDV',
  'Iluminação da maquete e pendente funcionando': 'PDV',
  // COMUNICAÇÃO VISUAL LOJA
  'Qualidade dos adesivos na fachada': 'MKT',
  'Logo Rottas iluminada e funcionando': 'MKT',
  'Letreiro empreendimento em bom estado e sem ferrugem': 'PDV',
  'Letreiro neon funcionando e sem letradas apagadas; (energia full)': 'MKT',
  'Adesivos de comunicação dos empreendimentos bem fixados': 'MKT',
  'Placas de acrílico de fotos dos empreendimentos bem fixados': 'MKT',
  'A arte urbana e grafites em bom estado': 'MKT',
  'Plaquinhas de comunicação, banheiros e serviços em bom estado': 'PDV',
  // ESTACIONAMENTO LOJA
  'Pintura das vagas;': 'PDV',
  'Conservação PAVER e/ou calçadas': 'PDV',
  'Sujeira no chão': 'COMERCIAL',
  'Lixeiras padronizados, identificados e sem excesso de sujeira': 'PDV',
  'Muros do estacionamento sem pixações': 'PDV',
  // ELÉTRICA LOJA
  'Parte elétrica funcionando, sem fiação aparente e sem lâmpadas queimadas ou piscando': 'PDV',
  'Iluminação externa em bom estado (fitas de led piscando, ou lampadas apagadas)': 'PDV',
  // HIDRÁULICA LOJA
  'Parte hidráulica funcionando, sem vazamentos e infiltrações. Pias e vasos funcionando': 'PDV',
  'Fossa sem odor e com manutenção em dia': 'PDV',
  'Manutenção periódica das caixas de gordura.': 'PDV',
  // PINTURAS LOJA
  'Pintura de paredes e tetos, sem manchas, descascados e sujeiras': 'PDV',
  // PISO EM GERAL LOJA
  'Conservação do piso, sem manchas, pisos soltos e avarias': 'PDV',
  'Conservação do rejunte ': 'PDV',
  // LIMPEZA E ORGANIZAÇÃO LOJA
  'Limpeza civil em bom estado (calçadas, escadas externas, esquadrias)': 'PDV',
  'Limpeza diária bom estado (diarista)': 'MKT',
  'Limpeza de vidros e bom estado': 'MKT',
  'Limpeza e conservação dos banheiros adequada': 'MKT',
  'Cantinho do café exposto, limpo e organizado;': 'COMERCIAL',
  'Espaço de vendas sem materiais de limpeza expostos': 'COMERCIAL',
  'Espaço de  vendas sem materiais de venda expostos e desorganizado': 'COMERCIAL',
  'Copa sem restos de comida e copos espalhados': 'COMERCIAL',
  'Depósito organizado': 'COMERCIAL',
  'Bolsas e mochilas espalhadas pelo salão': 'COMERCIAL',
  'Limpeza dos eletrodomésticos em dia': 'MKT',
  'Porta guarda chuva está acessível para utilização do cliente': 'COMERCIAL',
  'Lixeiras sem lixo transbordando nos banheiros': 'MKT',
  'Lixeiras sem lixo transbordando na loja': 'MKT',
  // ESCADAS LOJA
  'Antiderrapante em fita em cada degrau ou material próprio antiderrapante ( se aplicável )': 'PDV',
  'Piso em bom estado': 'PDV',
  'Guarda corpo sem ferrugens, bem fixado e em bom estado': 'PDV',
  // MANUTENÇÃO DE EQUIPAMENTOS LOJA
  'Aparelhos de ar condicionado funcionando em com manutenção em dia': 'PDV',
  'Filtro de água em bom estado,  e funcionando': 'PDV',
  'Geladeira em bom estado,  e funcionando': 'PDV',
  'Microondas em bom estado, e funcionando': 'PDV',
  'TV em bom estado, bem fixada e funcionando': 'PDV',
  'Equipamentos interativos em bom estado e funcionando (se aplicável)': 'PDV',
  'Câmeras e Alarmes Funcionando': 'PDV',
  // UTENSÍLIOS DOMÉSTICOS LOJA
  'Coffee place disposto para atendimento ao cliente ( jarra de vidro, copos, xicaras, e talheres)': 'COMERCIAL',
  'Utensilios domésticos exclusivos para o cliente (xicara, copos pires e colher de café)': 'MKT',
  'Utensilios domésticos exclusivos para os funcionários (xicara, pratos, copos pires e colher de café)': 'MKT',
  'Utensilios de higiene organizados  (papel higienico, papel toalha, sabonete, produtos de limpeza, panos, baldes)': 'MKT',
  'Utensilios de limpeza organizados e armazenados em armários (sem exposição para o cliente)': 'COMERCIAL',
  // EQUIPAMENTOS DE SEGURANÇA
  'Equipamentos dos bombeiros devidamente posicionados': 'PDV',
  'Luzes de emergência funcionando': 'PDV',
  // DECORADO
  'Limpeza civil em bom estado (calçadas, escadas, esquadrias) e sem restos de obra': 'PDV',
  'Limpeza diária em bom estado (diarista)': 'MKT',
  'Conservação do piso, sem manchas, rejuntes e pisos soltos e avarias': 'PDV',
  'Pintura interna em bom estado, sem manchas': 'PDV',
  'Organização dos itens de decoração devidamente posicionados': 'MKT',
  'Limpeza da área externa, grama, churrasqueira e mobiliário': 'MKT',
  'Limpeza de decorações (tapetes, enxoval e cortinas)': 'PDV',
  'Funcionamento das portas': 'PDV',
  'Iluminação funcionando perfeitamente e sem fiação exposta': 'PDV',
  'Mobiliário em bom estado, sem avarias': 'PDV',
  'Mobiliários externos em bom estato, sem avarias': 'PDV',
  'Placa de informativo ao cliente, na entrada do decorado, em bom estado (do empreendimento)': 'MKT',
  'Plaquinhas e adesivos de informativo dentro do decorado, em bom estado ( memorial do cliente)': 'PDV',
  'Cheirinho Rottas completo e em bom estado': 'MKT',
  'Logo do empreendimento na porta do decorado em bom estado': 'MKT',
  'Eletrodomésticos visualmente em bom estado': 'PDV',
  'Espelhos em bom estado e sem quebras': 'PDV'
};

const getSetor = (item) => {
  return item.setor || itemSetorMap[item.item] || null;
};

export default function PDFGenerator({ relatorio, isGenerating, setIsGenerating, notasPorSetor }) {
  
  const generatePDF = () => {
    setIsGenerating(true);
    
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Qualidade - ${relatorio.pdv_nome}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; line-height: 1.6; padding: 40px; }
          .header { text-align: center; border-bottom: 3px solid #ff7800; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #ff7800; font-size: 28px; margin-bottom: 8px; }
          .header p { color: #64748b; font-size: 14px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-box { background: #f8fafc; border-radius: 8px; padding: 16px; }
          .info-box label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-box p { font-size: 16px; font-weight: 600; color: #1e293b; margin-top: 4px; }
          .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; }
          .status.aprovado { background: #dcfce7; color: #166534; }
          .status.reprovado { background: #fee2e2; color: #991b1b; }
          .status.pendente { background: #fef3c7; color: #92400e; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 18px; font-weight: 700; color: #ff7800; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
          .item { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 12px; page-break-inside: avoid; }
          .item-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
          .item-title { font-weight: 600; color: #1e293b; }
          .item-categoria { font-size: 12px; color: #64748b; text-transform: uppercase; }
          .item-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
          .item-badge.conforme { background: #dcfce7; color: #166534; }
          .item-badge.nao-conforme { background: #fee2e2; color: #991b1b; }
          .setor-badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; margin-left: 8px; }
          .setor-badge.pdv { background: #dbeafe; color: #1d4ed8; }
          .setor-badge.mkt { background: #f3e8ff; color: #7c3aed; }
          .setor-badge.comercial { background: #fef3c7; color: #92400e; }
          .item-details { display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; font-size: 14px; }
          .item-details label { color: #64748b; }
          .item-details span { color: #1e293b; }
          .images { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
          .images img { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; border: 1px solid #e2e8f0; }
          .score-box { text-align: center; background: linear-gradient(135deg, #ff7800 0%, #ffa040 100%); color: white; padding: 24px; border-radius: 12px; margin-bottom: 30px; }
          .score-box .score { font-size: 48px; font-weight: 700; }
          .score-box .label { font-size: 14px; opacity: 0.9; }
          .setor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 30px; }
          .setor-card { border-radius: 12px; padding: 16px; text-align: center; }
          .setor-card.pdv { background: #dbeafe; border: 1px solid #93c5fd; }
          .setor-card.mkt { background: #f3e8ff; border: 1px solid #d8b4fe; }
          .setor-card.comercial { background: #fef3c7; border: 1px solid #fcd34d; }
          .setor-card .setor-name { font-size: 14px; font-weight: 700; margin-bottom: 8px; }
          .setor-card.pdv .setor-name { color: #1d4ed8; }
          .setor-card.mkt .setor-name { color: #7c3aed; }
          .setor-card.comercial .setor-name { color: #92400e; }
          .setor-card .setor-score { font-size: 28px; font-weight: 700; }
          .setor-card.pdv .setor-score { color: #1d4ed8; }
          .setor-card.mkt .setor-score { color: #7c3aed; }
          .setor-card.comercial .setor-score { color: #92400e; }
          .setor-card .setor-info { font-size: 11px; color: #64748b; margin-top: 4px; }
          .observacoes { background: #f8fafc; border-left: 4px solid #ff7800; padding: 16px; border-radius: 0 8px 8px 0; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
          @media print { body { padding: 20px; } .item { page-break-inside: avoid; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Relatório de Qualidade</h1>
          <p>Documento gerado automaticamente</p>
        </div>
        
        <div class="info-grid">
          <div class="info-box">
            <label>Ponto de Venda</label>
            <p>${relatorio.pdv_nome || 'N/A'}</p>
          </div>
          <div class="info-box">
            <label>Data da Visita</label>
            <p>${relatorio.data_visita ? format(new Date(relatorio.data_visita), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'N/A'}</p>
          </div>
          <div class="info-box">
            <label>Auditor</label>
            <p>${relatorio.auditor || 'N/A'}</p>
          </div>
          <div class="info-box">
            <label>Status</label>
            <p><span class="status ${relatorio.resultado}">${relatorio.resultado?.toUpperCase() || 'PENDENTE'}</span></p>
          </div>
        </div>
        
        <div class="score-box">
          <div class="score">${relatorio.nota_geral?.toFixed(1) || '0.0'}</div>
          <div class="label">Nota Geral (0-100)</div>
        </div>

        ${notasPorSetor && Object.keys(notasPorSetor).length > 0 ? `
        <div class="section">
          <h2 class="section-title">Notas por Setor</h2>
          <div class="setor-grid">
            ${['PDV', 'MKT', 'COMERCIAL'].filter(s => notasPorSetor[s]).map(setor => {
              const dados = notasPorSetor[setor];
              const media = dados.count > 0 ? (dados.total / dados.count) : 0;
              const percentualConforme = dados.count > 0 ? (dados.conformes / dados.count * 100) : 0;
              return `
                <div class="setor-card ${setor.toLowerCase()}">
                  <div class="setor-name">${setor}</div>
                  <div class="setor-score">${media.toFixed(1)}<span style="font-size: 14px; opacity: 0.7;">/10</span></div>
                  <div class="setor-info">${dados.count} itens • ${percentualConforme.toFixed(0)}% conformidade</div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <h2 class="section-title">Itens Avaliados</h2>
          ${(relatorio.itens_avaliacao || []).map(item => `
            <div class="item">
              <div class="item-header">
                <div>
                  <div class="item-categoria">${item.categoria || ''}</div>
                  <div class="item-title">${item.item || ''}${getSetor(item) ? `<span class="setor-badge ${getSetor(item).toLowerCase()}">${getSetor(item)}</span>` : ''}</div>
                </div>
                <span class="item-badge ${item.conforme ? 'conforme' : 'nao-conforme'}">
                  ${item.conforme ? 'CONFORME' : 'NÃO CONFORME'}
                </span>
              </div>
              <div class="item-details">
                <label>Nota:</label>
                <span>${item.nota || 0}/10</span>
                ${item.observacao ? `<label>Observação:</label><span>${item.observacao}</span>` : ''}
              </div>
              ${(item.imagens && item.imagens.length > 0) ? `
                <div class="images">
                  ${item.imagens.map(img => `<img src="${img}" alt="Evidência" />`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        
        ${relatorio.observacoes_gerais ? `
          <div class="section">
            <h2 class="section-title">Observações Gerais</h2>
            <div class="observacoes">${relatorio.observacoes_gerais}</div>
          </div>
        ` : ''}
        
        ${relatorio.plano_acao ? `
          <div class="section">
            <h2 class="section-title">Plano de Ação</h2>
            <div class="observacoes">${relatorio.plano_acao}</div>
          </div>
        ` : ''}
        
        <div class="footer">
          <p>Relatório gerado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      setIsGenerating(false);
    };
  };

  return (
    <Button 
      onClick={generatePDF} 
      disabled={isGenerating}
      className="bg-gradient-to-r from-[#ff7800] to-[#e66a00] hover:from-[#e66a00] hover:to-[#cc5e00]"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="w-4 h-4 mr-2" />
      )}
      Gerar PDF
    </Button>
  );
}