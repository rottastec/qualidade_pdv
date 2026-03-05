import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockAPI } from '@/lib/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Store, MapPin } from "lucide-react";
import PDVCard from "@/components/pdv/PDVCard";

const estados = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const emptyForm = {
  nome: '',
  endereco: '',
  cidade: '',
  estado: '',
  responsavel_pdv: '',
  responsavel_mkt: '',
  responsavel_comercial: '',
  telefone: '',
  status: 'ativo'
};

export default function PDVs() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [editingPDV, setEditingPDV] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const queryClient = useQueryClient();

  const { data: pdvs = [], isLoading } = useQuery({
    queryKey: ['pdvs'],
    queryFn: () => mockAPI.pdvs.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => mockAPI.pdvs.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdvs'] });
      handleCloseDialog();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ nome, data }) => mockAPI.pdvs.update(nome, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdvs'] });
      handleCloseDialog();
    }
  });

  const handleCloseDialog = () => {
    setIsOpen(false);
    setEditingPDV(null);
    setFormData(emptyForm);
  };

  const handleEdit = (pdv) => {
    setEditingPDV(pdv);
    setFormData({
      nome: pdv.nome || '',
      endereco: pdv.endereco || '',
      cidade: pdv.cidade || '',
      estado: pdv.estado || '',
      responsavel_pdv: pdv.responsavel || '',
      responsavel_mkt: '',
      responsavel_comercial: '',
      telefone: pdv.telefone || '',
      status: pdv.status || 'ativo'
    });
    setIsOpen(true);
  };

  const filteredPDVs = pdvs.filter(pdv => 
    pdv.nome?.toLowerCase().includes(search.toLowerCase()) ||
    pdv.cidade?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = {
      nome: formData.nome,
      endereco: formData.endereco || null,
      cidade: formData.cidade,
      estado: formData.estado,
      responsavel: formData.responsavel_pdv,
      telefone: formData.telefone || null,
      status: formData.status
    };
    
    if (editingPDV) {
      updateMutation.mutate({ nome: editingPDV.nome, data: dataToSend });
    } else {
      createMutation.mutate(dataToSend);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Pontos de Venda</h1>
            <p className="text-slate-600 mt-1">Gerencie seus PDVs e inicie avaliações</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleCloseDialog(); else setIsOpen(true); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#ff7800] to-[#e66a00] hover:from-[#e66a00] hover:to-[#cc5e00] shadow-lg shadow-orange-500/25">
                <Plus className="w-4 h-4 mr-2" />
                Novo PDV
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#ff7800]" />
                  {editingPDV ? 'Editar Ponto de Venda' : 'Cadastrar Ponto de Venda'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label>Nome do PDV *</Label>
                  <Input
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: Loja Centro"
                    required
                  />
                </div>
                <div>
                  <Label>Endereço</Label>
                  <Input
                    value={formData.endereco}
                    onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    placeholder="Rua, número, bairro"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Cidade *</Label>
                    <Input
                      value={formData.cidade}
                      onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                      placeholder="Cidade"
                      required
                    />
                  </div>
                  <div>
                    <Label>Estado *</Label>
                    <Select
                      value={formData.estado}
                      onValueChange={(value) => setFormData({...formData, estado: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        {estados.map(uf => (
                          <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-3">
                                      <Label className="text-sm font-medium">Responsáveis por Setor</Label>
                                      <div className="grid grid-cols-1 gap-3">
                                        <div>
                                          <Label className="text-xs text-blue-600">PDV</Label>
                                          <Input
                                            value={formData.responsavel_pdv}
                                            onChange={(e) => setFormData({...formData, responsavel_pdv: e.target.value})}
                                            placeholder="Responsável PDV"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs text-purple-600">MKT</Label>
                                          <Input
                                            value={formData.responsavel_mkt}
                                            onChange={(e) => setFormData({...formData, responsavel_mkt: e.target.value})}
                                            placeholder="Responsável MKT"
                                          />
                                        </div>
                                        <div>
                                          <Label className="text-xs text-amber-600">Comercial</Label>
                                          <Input
                                            value={formData.responsavel_comercial}
                                            onChange={(e) => setFormData({...formData, responsavel_comercial: e.target.value})}
                                            placeholder="Responsável Comercial"
                                          />
                                        </div>
                                      </div>
                                    </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                {editingPDV && (
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-[#ff7800] hover:bg-[#e66a00]"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {(createMutation.isPending || updateMutation.isPending) ? 'Salvando...' : editingPDV ? 'Salvar Alterações' : 'Cadastrar PDV'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar PDV por nome ou cidade..."
              className="pl-10 bg-white border-slate-200"
            />
          </div>
        </div>

        {/* PDV Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <Skeleton className="h-6 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-28 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredPDVs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPDVs.map(pdv => (
              <PDVCard key={pdv.nome} pdv={pdv} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">
                {search ? 'Nenhum PDV encontrado' : 'Nenhum PDV cadastrado'}
              </h3>
              <p className="text-slate-500 mb-4">
                {search ? 'Tente buscar com outros termos' : 'Cadastre seu primeiro ponto de venda'}
              </p>
              {!search && (
                <Button onClick={() => setIsOpen(true)} className="bg-[#ff7800] hover:bg-[#e66a00]">
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar PDV
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}