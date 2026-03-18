import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockAPI } from '@/lib/mock-data';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Store,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  FileSpreadsheet,
  Download
} from "lucide-react";
import PDFGenerator from "@/components/relatorio/PDFGenerator";
import { cn } from "@/lib/utils";


const statusConfig = {
  aprovado: { label: "Aprovado", icon: CheckCircle2, className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  reprovado: { label: "Reprovado", icon: XCircle, className: "bg-red-100 text-red-700 border-red-200" },
  pendente: { label: "Pendente", icon: AlertCircle, className: "bg-amber-100 text-amber-700 border-amber-200" }
};

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

export default function VisualizarRelatorio() {
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  // sanitize ID: ignore empty strings or the literal 'null'/'undefined'
  const rawId = urlParams.get('id');
  const relatorioId = rawId && rawId !== 'null' && rawId !== 'undefined' ? rawId : null;
  
  // Log para debug
  console.log('🔍 VisualizarRelatorio - debug:', { rawId, relatorioId, urlFull: window.location.search });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const exportToExcel = () => {
    if (!relatorio) return;
    
    const headers = ['Categoria', 'Item', 'Setor', 'Nota', 'Se aplica', 'Observação'];
    
    const rows = (relatorio.itens_avaliacao || []).map(item => [
      item.categoria || '',
      item.item || '',
      getSetor(item) || '',
      item.nota?.toString() || '0',
      item.conforme ? 'Sim' : 'Não se aplica',
      item.observacao || ''
    ]);

    // Adicionar informações do cabeçalho
    const headerInfo = [
      ['RELATÓRIO DE QUALIDADE'],
      [''],
      ['PDV:', relatorio.pdv_nome || ''],
      ['Data da Visita:', relatorio.data_visita ? format(new Date(relatorio.data_visita), 'dd/MM/yyyy') : ''],
      ['Auditor:', relatorio.auditor || ''],
      ['Nota Geral:', relatorio.nota_geral?.toFixed(1) || '0'],
      ['Resultado:', relatorio.resultado === 'aprovado' ? 'Aprovado' : relatorio.resultado === 'reprovado' ? 'Reprovado' : 'Pendente'],
      [''],
      headers,
      ...rows,
      [''],
      ['Observações Gerais:', relatorio.observacoes_gerais || ''],
      ['Plano de Ação:', relatorio.plano_acao || '']
    ];

    const csvContent = headerInfo.map(row => row.join(';')).join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${relatorio.pdv_nome || 'pdv'}_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllImages = async () => {
    if (!relatorio) return;

    const images = (relatorio.itens_avaliacao || [])
      .flatMap((item, idx) =>
        (item.imagens || []).map((img, imgIdx) => ({
          src: img,
          name: `${relatorio.pdv_nome || 'relatorio'}_${idx + 1}_${imgIdx + 1}.png`
        }))
      );

    if (images.length === 0) {
      toast({
        title: 'Nenhuma imagem',
        description: 'Este relatório não possui imagens anexadas.',
        variant: 'destructive'
      });
      return;
    }

    const downloadBlob = (blob, filename) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    for (const { src, name } of images) {
      try {
        if (src.startsWith('data:')) {
          // data URL
          const [meta, base64] = src.split(',');
          const contentType = meta.split(':')[1].split(';')[0];
          const binary = atob(base64);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
          downloadBlob(new Blob([array], { type: contentType }), name);
        } else {
          const res = await fetch(src);
          if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
          const blob = await res.blob();
          downloadBlob(blob, name);
        }
      } catch (err) {
        console.error('Erro ao baixar imagem:', err);
        toast({
          title: 'Erro ao baixar imagens',
          description: err.message || 'Verifique a URL das imagens.',
          variant: 'destructive'
        });
        break;
      }
    }
  };

  const { data: relatorio, isLoading, isError, error } = useQuery({
    queryKey: ['relatorio', relatorioId],
    queryFn: async () => {
      if (!relatorioId) {
        throw new Error('ID de relatório não fornecido');
      }
      // additional sanity check: avoid calling filter with invalid string
      if (relatorioId === 'null' || relatorioId === 'undefined') {
        throw new Error('ID de relatório inválido');
      }
      console.log('📡 Fetching relatório com id:', relatorioId);
      const results = await mockAPI.relatorios.filter({ id: relatorioId });
      console.log('📡 Resultados da query:', { count: results?.length, ids: results?.map(r => r.id) });
      const selected = results[0];
      console.log('📡 Relatório selecionado:', selected?.id, selected?.pdv_nome);
      return selected;
    },
    enabled: !!relatorioId,
    onError: (err) => {
      console.error('❌ Erro carregando relatório:', err);
    },
    onSuccess: (data) => {
      console.log('✅ Sucesso ao carregar relatório:', data?.id);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-64 w-full rounded-2xl mb-6" />
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Erro ao carregar relatório: {error?.message || 'desconhecido'}</p>
      </div>
    );
  }

  if (!relatorio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center">
        <Card className="border-0 shadow-sm max-w-md w-full mx-4">
          <CardContent className="py-16 text-center">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-700 mb-2">Relatório não encontrado</h3>
            <Link to={createPageUrl('Relatorios')}>
              <Button className="mt-4 bg-[#ff7800] hover:bg-[#e66a00]">
                Voltar aos Relatórios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[relatorio.resultado] || statusConfig.pendente;
  const StatusIcon = status.icon;

  const groupedItems = (relatorio.itens_avaliacao || []).reduce((acc, item) => {
    const cat = item.categoria;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  // Calcular notas por setor (ignorar itens marcados como "Não se aplica")
  const notasPorSetor = (relatorio.itens_avaliacao || []).reduce((acc, item) => {
    const setor = getSetor(item) || 'Outros';
    if (!acc[setor]) {
      acc[setor] = { totalNota: 0, aplicaveis: 0, totalItens: 0 };
    }

    acc[setor].totalItens += 1;

    if (item.conforme) {
      acc[setor].aplicaveis += 1;
      acc[setor].totalNota += (item.nota || 0);
    }

    return acc;
  }, {});

  const setoresOrdenados = ['PDV', 'MKT', 'COMERCIAL'].filter(s => notasPorSetor[s]);
  
  const setorConfig = {
    PDV: { color: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    MKT: { color: 'bg-purple-500', bgLight: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    COMERCIAL: { color: 'bg-amber-500', bgLight: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Relatorios')}>
              <Button variant="ghost" size="icon" className="hover:bg-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{relatorio.pdv_nome}</h1>
              <p className="text-slate-600">Relatório de Qualidade</p>
            </div>
          </div>
          <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={exportToExcel}
                            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                          >
                            <FileSpreadsheet className="w-4 h-4 mr-2" />
                            Excel
                          </Button>
                          <Button
                            variant="outline"
                            onClick={downloadAllImages}
                            className="border-slate-300 text-slate-700 hover:bg-slate-50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar imagens
                          </Button>
                          <PDFGenerator 
                            relatorio={relatorio} 
                            isGenerating={isGeneratingPDF} 
                            setIsGenerating={setIsGeneratingPDF}
                            notasPorSetor={notasPorSetor}
                          />
                          </div>
        </div>

        {/* Score Card */}
        <Card className={cn(
          "border-0 shadow-lg mb-6 overflow-hidden",
          relatorio.resultado === 'aprovado' && "bg-gradient-to-br from-emerald-500 to-emerald-600",
          relatorio.resultado === 'reprovado' && "bg-gradient-to-br from-red-500 to-red-600",
          relatorio.resultado === 'pendente' && "bg-gradient-to-br from-amber-500 to-amber-600"
        )}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <p className="text-white/80 mb-1">Nota Geral</p>
                <div className="flex items-end gap-2">
                  <span className="text-6xl font-bold">{relatorio.nota_geral?.toFixed(1) || '0.0'}</span>
                  <span className="text-2xl text-white/80 mb-2">/100</span>
                </div>
                <Badge className="mt-3 bg-white/20 text-white border-0">
                  <StatusIcon className="w-4 h-4 mr-1" />
                  {status.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <Store className="w-4 h-4" />
                    <span className="text-sm">PDV</span>
                  </div>
                  <p className="font-semibold">{relatorio.pdv_nome}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Data</span>
                  </div>
                  <p className="font-semibold">
                    {relatorio.data_visita 
                      ? format(new Date(relatorio.data_visita), "dd/MM/yyyy", { locale: ptBR })
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 col-span-2">
                  <div className="flex items-center gap-2 text-white/70 mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Auditor</span>
                  </div>
                  <p className="font-semibold">{relatorio.auditor || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas por Setor */}
        {setoresOrdenados.length > 0 && (
          <Card className="border-0 shadow-sm mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-800">Notas por Setor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {setoresOrdenados.map(setor => {
                  const dados = notasPorSetor[setor];
                  const media = dados.aplicaveis > 0 ? (dados.totalNota / dados.aplicaveis) : 0;
                  const percentualAplicacao = dados.totalItens > 0 ? (dados.aplicaveis / dados.totalItens * 100) : 0;
                  const config = setorConfig[setor];
                  
                  return (
                    <div key={setor} className={cn("rounded-xl p-4 border", config.bgLight, config.border)}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={cn("font-semibold text-sm", config.text)}>{setor}</span>
                        <span className={cn("text-xs px-2 py-1 rounded-full", config.bgLight, config.text)}>
                          {dados.aplicaveis} de {dados.totalItens} itens aplicáveis
                        </span>
                      </div>
                      <div className="flex items-end gap-1 mb-2">
                        <span className={cn("text-3xl font-bold", config.text)}>{media.toFixed(1)}</span>
                        <span className="text-slate-500 text-sm mb-1">/10</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                        <div 
                          className={cn("h-2 rounded-full", config.color)} 
                          style={{ width: `${media * 10}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        {percentualAplicacao.toFixed(0)}% aplicável ({dados.aplicaveis}/{dados.totalItens})
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Items */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([categoria, items]) => (
            <Card key={categoria} className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800">{categoria}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "border-l-4 rounded-lg p-4 bg-slate-50",
                      item.conforme ? "border-l-emerald-500" : "border-l-red-500"
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-medium text-slate-800">{item.item}</h4>
                              {getSetor(item) && (
                                <span className={cn(
                                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                                  getSetor(item) === 'PDV' ? "bg-blue-100 text-blue-700" : getSetor(item) === 'COMERCIAL' ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                                )}>
                                  {getSetor(item)}
                                </span>
                              )}
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-xs",
                                  item.conforme 
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                    : "bg-slate-100 text-slate-600 border-slate-200"
                                )}
                              >
                                {item.conforme ? 'Se aplica' : 'Não se aplica'}
                              </Badge>
                            </div>
                        {item.observacao && (
                          <p className="text-sm text-slate-600 mt-2">{item.observacao}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-slate-800">{item.nota || 0}</span>
                        <span className="text-sm text-slate-500">/10</span>
                      </div>
                    </div>

                    {item.imagens && item.imagens.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                          <ImageIcon className="w-3 h-3" />
                          Imagens anexadas
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.imagens.map((img, imgIdx) => (
                            <a 
                              key={imgIdx} 
                              href={img} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={img}
                                alt={`Evidência ${imgIdx + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border border-slate-200 hover:opacity-80 transition-opacity"
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Observations */}
          {(relatorio.observacoes_gerais || relatorio.plano_acao) && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Observações e Plano de Ação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatorio.observacoes_gerais && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Observações Gerais</h4>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{relatorio.observacoes_gerais}</p>
                  </div>
                )}
                {relatorio.plano_acao && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Plano de Ação</h4>
                    <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{relatorio.plano_acao}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}