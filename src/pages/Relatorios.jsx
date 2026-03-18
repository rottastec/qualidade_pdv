import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { mockAPI } from '@/lib/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search,
  ClipboardCheck,
  Plus,
  Filter,
  Eye,
  FileSpreadsheet
} from "lucide-react";

// Mapeamento de itens para setores
const itemSetorMap = {
  'Memorial descritivo da loja impresso e encadernado para utilização no PDV': 'PDV',
  'Alvará de funcionamento instalado em quadro na parede': 'PDV',
  'Alvará de bombeiros instalado em quadro na parede': 'PDV',
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
  'Maquete limpa e sem avarias': 'PDV',
  'Vegetação decorativa da maquete limpas e organizadas': 'PDV',
  'Vidros e cantoneiras em bom estado': 'PDV',
  'Iluminação da maquete e pendente funcionando': 'PDV',
  'Qualidade dos adesivos na fachada': 'MKT',
  'Logo Rottas iluminada e funcionando': 'MKT',
  'Letreiro empreendimento em bom estado e sem ferrugem': 'PDV',
  'Letreiro neon funcionando e sem letradas apagadas; (energia full)': 'MKT',
  'Adesivos de comunicação dos empreendimentos bem fixados': 'MKT',
  'Placas de acrílico de fotos dos empreendimentos bem fixados': 'MKT',
  'A arte urbana e grafites em bom estado': 'MKT',
  'Plaquinhas de comunicação, banheiros e serviços em bom estado': 'PDV',
  'Pintura das vagas;': 'PDV',
  'Conservação PAVER e/ou calçadas': 'PDV',
  'Sujeira no chão': 'COMERCIAL',
  'Lixeiras padronizados, identificados e sem excesso de sujeira': 'PDV',
  'Muros do estacionamento sem pixações': 'PDV',
  'Parte elétrica funcionando, sem fiação aparente e sem lâmpadas queimadas ou piscando': 'PDV',
  'Iluminação externa em bom estado (fitas de led piscando, ou lampadas apagadas)': 'PDV',
  'Parte hidráulica funcionando, sem vazamentos e infiltrações. Pias e vasos funcionando': 'PDV',
  'Fossa sem odor e com manutenção em dia': 'PDV',
  'Manutenção periódica das caixas de gordura.': 'PDV',
  'Pintura de paredes e tetos, sem manchas, descascados e sujeiras': 'PDV',
  'Conservação do piso, sem manchas, pisos soltos e avarias': 'PDV',
  'Conservação do rejunte ': 'PDV',
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
  'Antiderrapante em fita em cada degrau ou material próprio antiderrapante ( se aplicável )': 'PDV',
  'Piso em bom estado': 'PDV',
  'Guarda corpo sem ferrugens, bem fixado e em bom estado': 'PDV',
  'Aparelhos de ar condicionado funcionando em com manutenção em dia': 'PDV',
  'Filtro de água em bom estado,  e funcionando': 'PDV',
  'Geladeira em bom estado,  e funcionando': 'PDV',
  'Microondas em bom estado, e funcionando': 'PDV',
  'TV em bom estado, bem fixada e funcionando': 'PDV',
  'Equipamentos interativos em bom estado e funcionando (se aplicável)': 'PDV',
  'Câmeras e Alarmes Funcionando': 'PDV',
  'Coffee place disposto para atendimento ao cliente ( jarra de vidro, copos, xicaras, e talheres)': 'COMERCIAL',
  'Utensilios domésticos exclusivos para o cliente (xicara, copos pires e colher de café)': 'MKT',
  'Utensilios domésticos exclusivos para os funcionários (xicara, pratos, copos pires e colher de café)': 'MKT',
  'Utensilios de higiene organizados  (papel higienico, papel toalha, sabonete, produtos de limpeza, panos, baldes)': 'MKT',
  'Utensilios de limpeza organizados e armazenados em armários (sem exposição para o cliente)': 'COMERCIAL',
  'Equipamentos dos bombeiros devidamente posicionados': 'PDV',
  'Luzes de emergência funcionando': 'PDV',
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

const getSetor = (item) => item.setor || itemSetorMap[item.item] || null;

const calcularNotasPorSetor = (itens) => {
  if (!itens || itens.length === 0) return {};
  return itens.reduce((acc, item) => {
    const setor = getSetor(item) || 'Outros';
    if (!acc[setor]) acc[setor] = { total: 0, count: 0 };
    acc[setor].total += (item.nota || 0);
    acc[setor].count += 1;
    return acc;
  }, {});
};

const getNotaSetor = (notasPorSetor, setor) => {
  if (!notasPorSetor[setor] || notasPorSetor[setor].count === 0) return '-';
  return (notasPorSetor[setor].total / notasPorSetor[setor].count).toFixed(1);
};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const statusConfig = {
  aprovado: { label: "Aprovado", className: "bg-emerald-100 text-emerald-700" },
  reprovado: { label: "Reprovado", className: "bg-red-100 text-red-700" },
  pendente: { label: "Pendente", className: "bg-amber-100 text-amber-700" }
};

const documentoConfig = {
  rascunho: { label: "Rascunho", className: "bg-slate-100 text-slate-600" },
  finalizado: { label: "Finalizado", className: "bg-blue-100 text-blue-700" }
};

export default function Relatorios() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [filterResultado, setFilterResultado] = useState('todos');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const { data: relatorios = [], isLoading } = useQuery({
    queryKey: ['relatorios'],
    queryFn: () => mockAPI.relatorios.list('-created_date'),
    onSuccess: (data) => {
      const missing = data.filter(r => !r.id);
      if (missing.length > 0) {
        console.warn('Relatórios sem ID encontrados:', missing);
      }
    }
  });

  const filteredRelatorios = relatorios.filter(rel => {
    const matchSearch = rel.pdv_nome?.toLowerCase().includes(search.toLowerCase()) ||
                       rel.auditor?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'todos' || rel.status === filterStatus;
    const matchResultado = filterResultado === 'todos' || rel.resultado === filterResultado;

    const visitDate = rel.data_visita ? new Date(rel.data_visita) : null;
    const matchStartDate = filterStartDate ? (visitDate && visitDate >= new Date(filterStartDate)) : true;
    const matchEndDate = filterEndDate ? (visitDate && visitDate <= new Date(filterEndDate)) : true;

    return matchSearch && matchStatus && matchResultado && matchStartDate && matchEndDate;
  });

  const exportToExcel = () => {
    // Preparar dados para exportação
    const headers = ['PDV', 'Data da Visita', 'Auditor', 'Status', 'Resultado', 'Nota Geral', 'PDV', 'MKT', 'Comercial'];
    
    const rows = filteredRelatorios.map(rel => {
      const notasPorSetor = calcularNotasPorSetor(rel.itens_avaliacao);
      return [
        rel.pdv_nome || '',
        rel.data_visita ? format(new Date(rel.data_visita), 'dd/MM/yyyy') : '',
        rel.auditor || '',
        rel.status === 'finalizado' ? 'Finalizado' : 'Rascunho',
        rel.resultado === 'aprovado' ? 'Aprovado' : rel.resultado === 'reprovado' ? 'Reprovado' : 'Pendente',
        rel.nota_geral?.toFixed(1) || '0',
        getNotaSetor(notasPorSetor, 'PDV'),
        getNotaSetor(notasPorSetor, 'MKT'),
        getNotaSetor(notasPorSetor, 'COMERCIAL')
      ];
    });

    // Criar conteúdo CSV
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\n');

    // Adicionar BOM para UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Criar link e fazer download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorios_qualidade_${format(new Date(), 'dd-MM-yyyy')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* debug: warn about any relatorios missing an ID */}
      {relatorios && relatorios.some(r => !r.id) && (
        <div className="p-4 bg-yellow-100 text-yellow-800">
          ⚠️ Existem relatórios sem ID no retorno da API (ver console).
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Relatórios</h1>
            <p className="text-slate-600 mt-1">Histórico de avaliações de qualidade</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={exportToExcel}
              disabled={filteredRelatorios.length === 0}
              className="border-[#ff7800] text-[#ff7800] hover:bg-orange-50"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Exportar Excel
            </Button>
            <Link to={createPageUrl('PDVs')}>
              <Button className="bg-gradient-to-r from-[#ff7800] to-[#e66a00] hover:from-[#e66a00] hover:to-[#cc5e00] shadow-lg shadow-orange-500/25">
                <Plus className="w-4 h-4 mr-2" />
                Nova Avaliação
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por PDV ou auditor..."
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-36 bg-white">
                    <Filter className="w-4 h-4 mr-2 text-slate-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Status</SelectItem>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterResultado} onValueChange={setFilterResultado}>
                  <SelectTrigger className="w-36 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos Resultados</SelectItem>
                    <SelectItem value="aprovado">Aprovado</SelectItem>
                    <SelectItem value="reprovado">Reprovado</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-40 bg-white"
                    placeholder="Início"
                  />
                  <Input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-40 bg-white"
                    placeholder="Fim"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : filteredRelatorios.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                                          <TableRow className="bg-slate-50">
                                            <TableHead className="font-semibold text-slate-700">PDV</TableHead>
                                            <TableHead className="font-semibold text-slate-700">Data</TableHead>
                                            <TableHead className="font-semibold text-slate-700">Auditor</TableHead>
                                            <TableHead className="font-semibold text-slate-700">Status</TableHead>
                                            <TableHead className="font-semibold text-slate-700">Resultado</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-center">Geral</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-center">PDV</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-center">MKT</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-center">Comercial</TableHead>
                                            <TableHead className="font-semibold text-slate-700 text-center">Ações</TableHead>
                                          </TableRow>
                                        </TableHeader>
                  <TableBody>
                    {filteredRelatorios.map((relatorio) => {
                                                const status = statusConfig[relatorio.resultado] || statusConfig.pendente;
                                                const documento = documentoConfig[relatorio.status] || documentoConfig.rascunho;
                                                const notasPorSetor = calcularNotasPorSetor(relatorio.itens_avaliacao);

                                                return (
                                                  <TableRow key={relatorio.id} className="hover:bg-slate-50">
                                                    <TableCell className="font-medium text-slate-800">
                                                      {relatorio.pdv_nome || 'PDV não identificado'}
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                      {relatorio.data_visita 
                                                        ? format(new Date(relatorio.data_visita), "dd/MM/yyyy", { locale: ptBR })
                                                        : '-'
                                                      }
                                                    </TableCell>
                                                    <TableCell className="text-slate-600">
                                                      {relatorio.auditor || '-'}
                                                    </TableCell>
                                                    <TableCell>
                                                      <Badge variant="outline" className={documento.className}>
                                                        {documento.label}
                                                      </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                      <Badge variant="outline" className={status.className}>
                                                        {status.label}
                                                      </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      <span className={cn(
                                                        "font-bold text-lg",
                                                        relatorio.resultado === 'aprovado' && "text-emerald-600",
                                                        relatorio.resultado === 'reprovado' && "text-red-600",
                                                        relatorio.resultado === 'pendente' && "text-amber-600"
                                                      )}>
                                                        {relatorio.nota_geral?.toFixed(1) || '0'}
                                                      </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      <span className="font-semibold text-blue-600">
                                                        {getNotaSetor(notasPorSetor, 'PDV')}
                                                      </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      <span className="font-semibold text-purple-600">
                                                        {getNotaSetor(notasPorSetor, 'MKT')}
                                                      </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      <span className="font-semibold text-amber-600">
                                                        {getNotaSetor(notasPorSetor, 'COMERCIAL')}
                                                      </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      {(
                                                        relatorio.id &&
                                                        relatorio.id !== 'null' &&
                                                        relatorio.id !== 'undefined'
                                                      ) ? (
                                                        <Link to={createPageUrl(`VisualizarRelatorio?id=${relatorio.id}`)}>
                                                          <Button variant="ghost" size="sm" className="text-[#ff7800] hover:text-[#e66a00] hover:bg-orange-50">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Ver
                                                          </Button>
                                                        </Link>
                                                      ) : (
                                                        <Button variant="ghost" size="sm" disabled className="text-slate-400">
                                                          <Eye className="w-4 h-4 mr-1" />
                                                          (sem ID)
                                                        </Button>
                                                      )}
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-16 text-center">
                <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">
                  {search || filterStatus !== 'todos' || filterResultado !== 'todos' 
                    ? 'Nenhum relatório encontrado' 
                    : 'Nenhum relatório ainda'
                  }
                </h3>
                <p className="text-slate-500 mb-4">
                  {search || filterStatus !== 'todos' || filterResultado !== 'todos'
                    ? 'Tente ajustar os filtros'
                    : 'Crie sua primeira avaliação de qualidade'
                  }
                </p>
                {!(search || filterStatus !== 'todos' || filterResultado !== 'todos') && (
                  <Link to={createPageUrl('PDVs')}>
                    <Button className="bg-[#ff7800] hover:bg-[#e66a00]">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Avaliação
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        {filteredRelatorios.length > 0 && (
          <div className="mt-4 text-sm text-slate-500 text-right">
            Exibindo {filteredRelatorios.length} de {relatorios.length} relatório(s)
          </div>
        )}
      </div>
    </div>
  );
}