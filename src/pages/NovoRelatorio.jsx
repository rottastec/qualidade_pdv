import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { mockAPI } from '@/lib/mock-data';
import { useAuth } from '@/lib/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Store, 
  Calendar,
  User,
  Loader2,
  Info,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import ItemAvaliacao from "@/components/relatorio/ItemAvaliacao";
import {
  canFlagCommercialVisibility,
  filterPdvsByAccess,
  normalizeAllowedStates,
  normalizeRole,
} from '@/lib/access-control';

const categoriasDefault = [
    { nome: 'DOCUMENTAÇÃO GERAL', itens: [
    { nome: 'Memorial descritivo da loja impresso e encadernado para utilização no PDV', setor: 'PDV' },
    { nome: 'Alvará de funcionamento instalado em quadro na parede', setor: 'PDV' },
    { nome: 'Alvará de bombeiros instalado em quadro na parede', setor: 'PDV' }
  ]},
    { nome: 'ESTRUTURA DA LOJA', itens: [
    { nome: 'Pintura da fachada (padrão de cor e manutenção)', setor: 'PDV' },
    { nome: 'Logo Rottas (padrão de cor e manutenção)', setor: 'PDV' },
    { nome: 'Esquadrias em bom estado e sem avarias', setor: 'PDV' },
    { nome: 'Manutenção da estrutura externa', setor: 'PDV' },
    { nome: 'Estruturas sem infiltração ou vazamentos nas paredes', setor: 'PDV' },
    { nome: 'Paisagismo (grama) em bom estado e aparado', setor: 'MKT' },
    { nome: 'Paisagismo (ornamental) em bom estado, sem plantas mortas, mato ou caídas', setor: 'PDV' },
    { nome: 'Acessos sem obstrução', setor: 'PDV' },
    { nome: 'Qualidade dos forros', setor: 'PDV' },
    { nome: 'Fechaduras e trincos das lojas funcionando', setor: 'PDV' }
  ]},
  { nome: 'DECORAÇÃO E MOBILIÁRIOS DA LOJA', itens: [
    { nome: 'Móveis em bom estado, sem avarias', setor: 'PDV' },
    { nome: 'Cadeiras em bom estado, sem avarias', setor: 'PDV' },
    { nome: 'Sofás limpos e sem manchas', setor: 'PDV' },
    { nome: 'Bate cadeiras em bom estado', setor: 'PDV' },
    { nome: 'Apresenta apoio para café em bom estado; (Bandeja e Louças)', setor: 'PDV' },
    { nome: 'Tapetes limpos e bem conservados', setor: 'PDV' },
    { nome: 'Marcenaria bem conservada, sem apresentar manchas e peças faltando', setor: 'PDV' },
    { nome: 'Parede verde em bom estado', setor: 'PDV' },
    { nome: 'Louças em bom estado', setor: 'PDV' },
    { nome: 'Pedras do banheiro e copa em bom estado', setor: 'PDV' },
    { nome: 'Saboneteiras e papeleiras funcionando', setor: 'PDV' }
  ]},
  { nome: 'MAQUETE', itens: [
    { nome: 'Maquete limpa e sem avarias', setor: 'PDV' },
    { nome: 'Vegetação decorativa da maquete limpas e organizadas', setor: 'PDV' },
    { nome: 'Vidros e cantoneiras em bom estado', setor: 'PDV' },
    { nome: 'Iluminação da maquete e pendente funcionando', setor: 'PDV' }
  ]},
  { nome: 'COMUNICAÇÃO VISUAL LOJA', itens: [
    { nome: 'Qualidade dos adesivos na fachada', setor: 'MKT' },
    { nome: 'Logo Rottas iluminada e funcionando', setor: 'MKT' },
    { nome: 'Letreiro empreendimento em bom estado e sem ferrugem', setor: 'PDV' },
    { nome: 'Letreiro neon funcionando e sem letradas apagadas; (energia full)', setor: 'MKT' },
    { nome: 'Adesivos de comunicação dos empreendimentos bem fixados', setor: 'MKT' },
    { nome: 'Placas de acrílico de fotos dos empreendimentos bem fixados', setor: 'MKT' },
    { nome: 'A arte urbana e grafites em bom estado', setor: 'MKT' },
    { nome: 'Plaquinhas de comunicação, banheiros e serviços em bom estado', setor: 'PDV' }
  ]},
  { nome: 'ESTACIONAMENTO LOJA', itens: [
    { nome: 'Pintura das vagas;', setor: 'PDV' },
    { nome: 'Conservação PAVER e/ou calçadas', setor: 'PDV' },
    { nome: 'Sujeira no chão', setor: 'COMERCIAL' },
    { nome: 'Lixeiras padronizados, identificados e sem excesso de sujeira', setor: 'PDV' },
    { nome: 'Muros do estacionamento sem pixações', setor: 'PDV' }
  ]},
  { nome: 'ELÉTRICA LOJA', itens: [
    { nome: 'Parte elétrica funcionando, sem fiação aparente e sem lâmpadas queimadas ou piscando', setor: 'PDV' },
    { nome: 'Iluminação externa em bom estado (fitas de led piscando, ou lampadas apagadas)', setor: 'PDV' }
  ]},
  { nome: 'HIDRÁULICA LOJA', itens: [
    { nome: 'Parte hidráulica funcionando, sem vazamentos e infiltrações. Pias e vasos funcionando', setor: 'PDV' },
    { nome: 'Fossa sem odor e com manutenção em dia', setor: 'PDV' },
    { nome: 'Manutenção periódica das caixas de gordura.', setor: 'PDV' }
  ]},
  { nome: 'PINTURAS LOJA', itens: [
    { nome: 'Pintura de paredes e tetos, sem manchas, descascados e sujeiras', setor: 'PDV' }
  ]},
  { nome: 'PISO EM GERAL LOJA', itens: [
    { nome: 'Conservação do piso, sem manchas, pisos soltos e avarias', setor: 'PDV' },
    { nome: 'Conservação do rejunte ', setor: 'PDV' }
  ]},
  { nome: 'LIMPEZA E ORGANIZAÇÃO LOJA', itens: [
    { nome: 'Limpeza civil em bom estado (calçadas, escadas externas, esquadrias)', setor: 'PDV' },
    { nome: 'Limpeza diária bom estado (diarista)', setor: 'MKT' },
    { nome: 'Limpeza de vidros e bom estado', setor: 'MKT' },
    { nome: 'Limpeza e conservação dos banheiros adequada', setor: 'MKT' },
    { nome: 'Cantinho do café exposto, limpo e organizado;', setor: 'COMERCIAL' },
    { nome: 'Espaço de vendas sem materiais de limpeza expostos', setor: 'COMERCIAL' },
    { nome: 'Espaço de  vendas sem materiais de venda expostos e desorganizado', setor: 'COMERCIAL' },
    { nome: 'Copa sem restos de comida e copos espalhados', setor: 'COMERCIAL' },
    { nome: 'Depósito organizado', setor: 'COMERCIAL' },
    { nome: 'Bolsas e mochilas espalhadas pelo salão', setor: 'COMERCIAL' },
    { nome: 'Limpeza dos eletrodomésticos em dia', setor: 'MKT' },
    { nome: 'Porta guarda chuva está acessível para utilização do cliente', setor: 'COMERCIAL' },
    { nome: 'Lixeiras sem lixo transbordando nos banheiros', setor: 'MKT' },
    { nome: 'Lixeiras sem lixo transbordando na loja', setor: 'MKT' }
  ]},
  { nome: 'ESCADAS LOJA', itens: [
    { nome: 'Antiderrapante em fita em cada degrau ou material próprio antiderrapante ( se aplicável )', setor: 'PDV' },
    { nome: 'Piso em bom estado', setor: 'PDV' },
    { nome: 'Guarda corpo sem ferrugens, bem fixado e em bom estado', setor: 'PDV' }
  ]},
  { nome: 'MANUTENÇÃO DE EQUIPAMENTOS LOJA', itens: [
    { nome: 'Aparelhos de ar condicionado funcionando em com manutenção em dia', setor: 'PDV' },
    { nome: 'Filtro de água em bom estado,  e funcionando', setor: 'PDV' },
    { nome: 'Geladeira em bom estado,  e funcionando', setor: 'PDV' },
    { nome: 'Microondas em bom estado, e funcionando', setor: 'PDV' },
    { nome: 'TV em bom estado, bem fixada e funcionando', setor: 'PDV' },
    { nome: 'Equipamentos interativos em bom estado e funcionando (se aplicável)', setor: 'PDV' },
    { nome: 'Câmeras e Alarmes Funcionando', setor: 'PDV' }
  ]},
  { nome: 'UTENSÍLIOS DOMÉSTICOS LOJA', itens: [
    { nome: 'Coffee place disposto para atendimento ao cliente ( jarra de vidro, copos, xicaras, e talheres)', setor: 'COMERCIAL' },
    { nome: 'Utensilios domésticos exclusivos para o cliente (xicara, copos pires e colher de café)', setor: 'MKT' },
    { nome: 'Utensilios domésticos exclusivos para os funcionários (xicara, pratos, copos pires e colher de café)', setor: 'MKT' },
    { nome: 'Utensilios de higiene organizados  (papel higienico, papel toalha, sabonete, produtos de limpeza, panos, baldes)', setor: 'MKT' },
    { nome: 'Utensilios de limpeza organizados e armazenados em armários (sem exposição para o cliente)', setor: 'COMERCIAL' }
  ]},
  { nome: 'EQUIPAMENTOS DE SEGURANÇA', itens: [
    { nome: 'Equipamentos dos bombeiros devidamente posicionados', setor: 'PDV' },
    { nome: 'Luzes de emergência funcionando', setor: 'PDV' }
  ]},
  { nome: 'DECORADO', itens: [
    { nome: 'Limpeza civil em bom estado (calçadas, escadas, esquadrias) e sem restos de obra', setor: 'PDV' },
    { nome: 'Limpeza diária em bom estado (diarista)', setor: 'MKT' },
    { nome: 'Conservação do piso, sem manchas, rejuntes e pisos soltos e avarias', setor: 'PDV' },
    { nome: 'Pintura interna em bom estado, sem manchas', setor: 'PDV' },
    { nome: 'Organização dos itens de decoração devidamente posicionados', setor: 'MKT' },
    { nome: 'Limpeza da área externa, grama, churrasqueira e mobiliário', setor: 'MKT' },
    { nome: 'Limpeza de decorações (tapetes, enxoval e cortinas)', setor: 'PDV' },
    { nome: 'Funcionamento das portas', setor: 'PDV' },
    { nome: 'Iluminação funcionando perfeitamente e sem fiação exposta', setor: 'PDV' },
    { nome: 'Mobiliário em bom estado, sem avarias', setor: 'PDV' },
    { nome: 'Mobiliários externos em bom estato, sem avarias', setor: 'PDV' },
    { nome: 'Placa de informativo ao cliente, na entrada do decorado, em bom estado (do empreendimento)', setor: 'MKT' },
    { nome: 'Plaquinhas e adesivos de informativo dentro do decorado, em bom estado ( memorial do cliente)', setor: 'PDV' },
    { nome: 'Cheirinho Rottas completo e em bom estado', setor: 'MKT' },
    { nome: 'Logo do empreendimento na porta do decorado em bom estado', setor: 'MKT' },
    { nome: 'Eletrodomésticos visualmente em bom estado', setor: 'PDV' },
    { nome: 'Espelhos em bom estado e sem quebras', setor: 'PDV' }
  ]}
];

const categoriasTapume = [
  { nome: 'TAPUME', itens: [
    { nome: 'Tapume com pintura conservada', setor: 'OBRA' },
    { nome: 'Encontra-se limpo', setor: 'OBRA' },
    { nome: 'Apresenta ausência de amassados', setor: 'OBRA' },
    { nome: 'Encontra-se alinhado corretamente', setor: 'OBRA' },
    { nome: 'Sem frestas visíveis', setor: 'OBRA' },
    { nome: 'Fixação de forma regular e segura', setor: 'OBRA' },
    { nome: 'Livre de pichações e vandalismo', setor: 'OBRA' },
  ]},
  { nome: 'PAISAGISMO', itens: [
    { nome: 'Há ausência de mato', setor: 'OBRA' },
    { nome: 'Plantas estão saudáveis', setor: 'OBRA' },
    { nome: 'Áreas estão limpas', setor: 'OBRA' },
    { nome: 'Iluminação funcionando de maneira correta', setor: 'OBRA' },
    { nome: 'Plantas altas podadas', setor: 'OBRA' },
  ]},
  { nome: 'COMUNICAÇÃO VISUAL', itens: [
    { nome: 'Logos / placas fixadas de maneira adequada', setor: 'MKT' },
    { nome: 'Logos / placas devidamente limpos', setor: 'MKT' },
    { nome: 'Comunicação de vendas atualizada', setor: 'MKT' },
    { nome: 'Iluminação funcionando de maneira correta', setor: 'MKT' },
    { nome: 'Placas de comunicação visual sem danos', setor: 'MKT' },
    { nome: 'Placa de evolução de obra, devidamente preenchida', setor: 'MKT' },
    { nome: 'Placa governo federal conservada', setor: 'MKT' },
    { nome: 'Placa Cohapar conservada', setor: 'MKT' },
    { nome: 'Placa responsável técnico conservada', setor: 'MKT' },
    { nome: 'Placa selo azul + caixa conservada', setor: 'MKT' },
    { nome: 'Leitura de QR Code funcionando', setor: 'MKT' },
    { nome: 'Sinalização de acesso restrito adequada', setor: 'OBRA' },
  ]},
];

const normalizePdvType = (tipo) => String(tipo || 'PDV').toUpperCase();

const getCategoriasByPdvType = (tipo) => {
  const normalizedType = normalizePdvType(tipo);

  if (normalizedType === 'DECORADO') {
    return categoriasDefault.filter((categoria) => categoria.nome === 'DECORADO');
  }

  if (normalizedType === 'TAPUME') {
    return categoriasTapume;
  }

  return categoriasDefault.filter((categoria) => categoria.nome !== 'DECORADO');
};

const buildItensFromCategorias = (categorias, previousItens = []) => {
  const previousMap = new Map(
    previousItens.map((item) => [`${item.categoria}::${item.item}`, item])
  );

  const itens = [];

  categorias.forEach((categoria) => {
    categoria.itens.forEach((itemObj) => {
      const key = `${categoria.nome}::${itemObj.nome}`;
      const previousItem = previousMap.get(key);

      itens.push({
        categoria: categoria.nome,
        item: itemObj.nome,
        setor: itemObj.setor,
        nota: previousItem?.nota ?? 5,
        conforme: previousItem?.conforme ?? true,
        observacao: previousItem?.observacao ?? '',
        imagens: previousItem?.imagens ?? []
      });
    });
  });

  return itens;
};

export default function NovoRelatorio() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  // now expect `pdv_id` in query string (numeric or string) so reports are linked by primary key
  const rawPdvId = urlParams.get('pdv_id');
  const pdvIdFromUrl = rawPdvId != null ? Number(rawPdvId) : null;
  const pdvNomeFromUrl = urlParams.get('pdv_nome'); // kept for backward compatibility in case older links still use it

  const [formData, setFormData] = useState({
    pdv_id: pdvIdFromUrl != null ? pdvIdFromUrl : (pdvNomeFromUrl || ''),
    pdv_nome: pdvNomeFromUrl || '',
    data_visita: format(new Date(), 'yyyy-MM-dd'),
    auditor: '',
    status: 'rascunho',
    resultado: 'pendente',
    nota_geral: 0,
    itens_avaliacao: [],
    observacoes_gerais: '',
    plano_acao: '',
    visivel_comercial: true,
  });

  const [activeTab, setActiveTab] = useState('info');
  const [error, setError] = useState(null);
  const { user, role, profile } = useAuth();
  const normalizedRole = normalizeRole(role);
  const allowedStates = normalizeAllowedStates(profile?.estados);
  const canSetCommercialVisibility = canFlagCommercialVisibility(normalizedRole);

  const { data: pdvs = [] } = useQuery({
    queryKey: ['pdvs'],
    queryFn: () => mockAPI.pdvs.list(),
  });

  const visiblePdvs = useMemo(
    () => filterPdvsByAccess({ role: normalizedRole, allowedStates, pdvs }),
    [normalizedRole, allowedStates, pdvs]
  );

  useEffect(() => {
    if (user && !formData.auditor) {
      setFormData(prev => ({ ...prev, auditor: user.name || user.email }));
    }
  }, [user]);

  useEffect(() => {
    // if url provided id or name, look up pdv and populate nome field
    if ((pdvIdFromUrl || pdvNomeFromUrl) && visiblePdvs.length > 0) {
      let pdv;
      if (pdvIdFromUrl) {
        pdv = visiblePdvs.find(p => String(p.id) === String(pdvIdFromUrl));
      }
      if (!pdv && pdvNomeFromUrl) {
        pdv = visiblePdvs.find(p => p.nome === pdvNomeFromUrl);
      }
      if (pdv) {
        setFormData(prev => ({
          ...prev,
          pdv_id: pdv.id,
          pdv_nome: pdv.nome
        }));
      }
    }
  }, [pdvIdFromUrl, pdvNomeFromUrl, visiblePdvs]);

  useEffect(() => {
    if (!formData.pdv_id) return;

    const isVisible = visiblePdvs.some((pdv) => String(pdv.id) === String(formData.pdv_id));

    if (!isVisible) {
      setFormData((prev) => ({
        ...prev,
        pdv_id: '',
        pdv_nome: '',
      }));
    }
  }, [visiblePdvs, formData.pdv_id]);

  const selectedPdv = visiblePdvs.find((pdv) => String(pdv.id) === String(formData.pdv_id));
  const selectedPdvType = normalizePdvType(selectedPdv?.tipo);



  useEffect(() => {
    const categorias = getCategoriasByPdvType(selectedPdvType);

    setFormData((prev) => {
      const nextItens = buildItensFromCategorias(categorias, prev.itens_avaliacao);
      const sameItems =
        prev.itens_avaliacao.length === nextItens.length &&
        prev.itens_avaliacao.every(
          (item, index) =>
            item.categoria === nextItens[index]?.categoria &&
            item.item === nextItens[index]?.item &&
            item.setor === nextItens[index]?.setor
        );

      if (sameItems) {
        return prev;
      }

      return {
        ...prev,
        itens_avaliacao: nextItens
      };
    });
  }, [selectedPdvType]);

  const createMutation = useMutation({
    mutationFn: (data) => mockAPI.relatorios.create(data),
    onSuccess: (result) => {
      setError(null);
      // Ir para o dashboard após criação do relatório
      navigate(createPageUrl('Dashboard'));
    },
    onError: (err) => {
      console.error('Erro ao criar relatório:', err);
      setError(err.message || 'Erro ao criar relatório. Tente novamente.');
    }
  });

  const calculateNotaGeral = () => {
    const aplicaveis = formData.itens_avaliacao.filter(item => item.conforme);
    if (aplicaveis.length === 0) return 0;
    const soma = aplicaveis.reduce((acc, item) => acc + (item.nota || 0), 0);
    return soma / aplicaveis.length;
  };

  const calculateResultado = (nota) => {
    if (nota >= 4) return 'aprovado';
    if (nota >= 2) return 'pendente';
    return 'reprovado';
  };

  const handlePDVChange = (selection) => {
    // selection comes from Select, we store the numeric id here
    const pdv = visiblePdvs.find(p => String(p.id) === String(selection));
    setFormData(prev => ({
      ...prev,
      pdv_id: pdv?.id || selection,
      pdv_nome: pdv?.nome || prev.pdv_nome
    }));
  };

  const handleItemUpdate = (index, updatedItem) => {
    const newItens = [...formData.itens_avaliacao];
    newItens[index] = updatedItem;
    setFormData(prev => ({ ...prev, itens_avaliacao: newItens }));
  };

  const handleSubmit = (status) => {
    const notaGeral = calculateNotaGeral();
    const resultado = calculateResultado(notaGeral);
    
    // make sure pdv_id is a number when it looks like one
    const pdvIdValue = formData.pdv_id;
    const normalizedPdvId = pdvIdValue != null && !isNaN(Number(pdvIdValue))
      ? Number(pdvIdValue)
      : pdvIdValue;

    createMutation.mutate({
      ...formData,
      pdv_id: normalizedPdvId,
      visivel_comercial: canSetCommercialVisibility ? formData.visivel_comercial : true,
      status,
      nota_geral: notaGeral,
      resultado
    });
  };

  const groupedItems = formData.itens_avaliacao.reduce((acc, item, index) => {
    const cat = item.categoria;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...item, originalIndex: index });
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl('PDVs')}>
            <Button variant="ghost" size="icon" className="hover:bg-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-800">Nova Avaliação</h1>
            <p className="text-slate-600">Preencha o formulário de qualidade do PDV</p>
          </div>
        </div>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Erro:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white shadow-sm border">
            <TabsTrigger value="info" className="data-[state=active]:bg-orange-50 data-[state=active]:text-[#ff7800]">
              Informações
            </TabsTrigger>
            <TabsTrigger value="avaliacao" className="data-[state=active]:bg-orange-50 data-[state=active]:text-[#ff7800]">
              Avaliação
            </TabsTrigger>
            <TabsTrigger value="conclusao" className="data-[state=active]:bg-orange-50 data-[state=active]:text-[#ff7800]">
              Conclusão
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Store className="w-5 h-5 text-[#ff7800]" />
                  Informações da Visita
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-slate-400" />
                      Ponto de Venda *
                    </Label>
                    <Select
                      value={formData.pdv_id ? String(formData.pdv_id) : ''}
                      onValueChange={handlePDVChange}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione um PDV" />
                      </SelectTrigger>
                      <SelectContent>
                        {visiblePdvs.map(pdv => (
                          <SelectItem key={pdv.id} value={String(pdv.id)}>
                            {pdv.nome} - {pdv.cidade}/{pdv.estado}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {normalizedRole === 'comercial' && allowedStates.length === 0 && (
                      <p className="text-xs text-amber-700 mt-2">
                        Seu usuário comercial não possui estados configurados. Peça ao admin para definir os UFs em Usuários.
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Data da Visita *
                    </Label>
                    <Input
                      type="date"
                      value={formData.data_visita}
                      onChange={(e) => setFormData({...formData, data_visita: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      Auditor/Avaliador *
                    </Label>
                    <Input
                      value={formData.auditor}
                      onChange={(e) => setFormData({...formData, auditor: e.target.value})}
                      placeholder="Nome do avaliador"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab('avaliacao')} className="bg-[#ff7800] hover:bg-[#e66a00]">
                    Próximo: Avaliação
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="avaliacao">
            <div className="space-y-6">
              {/* Informativo de Níveis */}
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-slate-800">
                    <Info className="w-5 h-5 text-blue-600" />
                    Níveis de Avaliação
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-red-100 border-l-4 border-red-600 p-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-red-800 mb-1">0-1</p>
                      <p className="text-xs text-red-700">CORREÇÃO URGENTE</p>
                    </div>
                    <div className="bg-yellow-100 border-l-4 border-yellow-600 p-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-yellow-800 mb-1">2-3</p>
                      <p className="text-xs text-yellow-700">CUIDADOS PERIÓDICOS</p>
                    </div>
                    <div className="bg-emerald-100 border-l-4 border-emerald-600 p-3 rounded-r-lg">
                      <p className="text-xs font-semibold text-emerald-800 mb-1">4-5</p>
                      <p className="text-xs text-emerald-700">EXCELENTE</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {Object.entries(groupedItems).map(([categoria, items]) => (
                <Card key={categoria} className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-slate-800">{categoria}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <ItemAvaliacao
                        key={item.originalIndex}
                        item={item}
                        index={item.originalIndex}
                        onUpdate={handleItemUpdate}
                        categoria={categoria}
                      />
                    ))}
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab('info')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <Button onClick={() => setActiveTab('conclusao')} className="bg-[#ff7800] hover:bg-[#e66a00]">
                  Próximo: Conclusão
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conclusao">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Resumo e Observações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Preview */}
                <div className="bg-gradient-to-br from-[#ff7800] to-[#e66a00] rounded-2xl p-6 text-white text-center">
                  <p className="text-orange-100 mb-2">Nota Geral Calculada</p>
                  <p className="text-5xl font-bold">{calculateNotaGeral().toFixed(1)} / 5</p>
                  <p className="text-blue-100 mt-2">
                    Resultado: <span className="font-semibold text-white uppercase">{calculateResultado(calculateNotaGeral())}</span>
                  </p>
                </div>

                <div>
                  <Label>Observações Gerais</Label>
                  <Textarea
                    value={formData.observacoes_gerais}
                    onChange={(e) => setFormData({...formData, observacoes_gerais: e.target.value})}
                    placeholder="Observações sobre a visita..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label>Plano de Ação</Label>
                  <Textarea
                    value={formData.plano_acao}
                    onChange={(e) => setFormData({...formData, plano_acao: e.target.value})}
                    placeholder="Ações corretivas necessárias..."
                    className="mt-1 min-h-[100px]"
                  />
                </div>

                {canSetCommercialVisibility && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="visivel-comercial"
                        checked={formData.visivel_comercial}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            visivel_comercial: checked === true,
                          }))
                        }
                      />
                      <div>
                        <Label htmlFor="visivel-comercial" className="font-medium text-slate-700">
                          Permitir visualização para o time comercial
                        </Label>
                        <p className="text-xs text-slate-500 mt-1">
                          Quando desmarcado, apenas Arquitetura e Admin poderão visualizar este relatório.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('avaliacao')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSubmit('rascunho')}
                      disabled={createMutation.isPending}
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Salvar Rascunho
                    </Button>
                    <Button 
                      onClick={() => handleSubmit('finalizado')}
                      disabled={createMutation.isPending || !formData.pdv_id}
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                    >
                      {createMutation.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Finalizar Relatório
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}