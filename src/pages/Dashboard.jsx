import { useQuery } from '@tanstack/react-query';
import { mockAPI } from '@/lib/mock-data';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ClipboardCheck,
  Store,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react";
import RelatorioCard from "@/components/relatorio/RelatorioCard";

export default function Dashboard() {
  const { data: relatorios = [], isLoading: loadingRelatorios } = useQuery({
    queryKey: ['relatorios'],
    queryFn: () => mockAPI.relatorios.list('-created_date', 50),
  });

  const { data: pdvs = [], isLoading: loadingPDVs } = useQuery({
    queryKey: ['pdvs'],
    queryFn: () => mockAPI.pdvs.list(),
  });

  const stats = {
    total: relatorios.length,
    aprovados: relatorios.filter(r => r.resultado === 'aprovado').length,
    reprovados: relatorios.filter(r => r.resultado === 'reprovado').length,
    pendentes: relatorios.filter(r => r.resultado === 'pendente').length,
    mediaGeral: relatorios.length > 0 
      ? (relatorios.reduce((acc, r) => acc + (r.nota_geral || 0), 0) / relatorios.length).toFixed(1)
      : 0
  };

  const recentRelatorios = relatorios.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-600 mt-1">Visão geral dos relatórios de qualidade</p>
          </div>
          <Link to={createPageUrl('PDVs')}>
            <Button className="bg-gradient-to-r from-[#ff7800] to-[#e66a00] hover:from-[#e66a00] hover:to-[#cc5e00] shadow-lg shadow-orange-500/25">
              <Plus className="w-4 h-4 mr-2" />
              Nova Avaliação
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total</p>
                  {loadingRelatorios ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <ClipboardCheck className="w-6 h-6 text-[#ff7800]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Aprovados</p>
                  {loadingRelatorios ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-emerald-600">{stats.aprovados}</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Reprovados</p>
                  {loadingRelatorios ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-red-600">{stats.reprovados}</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Pendentes</p>
                  {loadingRelatorios ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold text-amber-600">{stats.pendentes}</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#ff7800] to-[#e66a00] border-0 shadow-lg shadow-orange-500/25 col-span-2 lg:col-span-1">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100">Média Geral</p>
                  {loadingRelatorios ? (
                    <Skeleton className="h-8 w-16 mt-1 bg-orange-400/30" />
                  ) : (
                    <p className="text-2xl font-bold text-white">{stats.mediaGeral}</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <Store className="w-6 h-6 text-[#ff7800]" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">PDVs Cadastrados</p>
                  {loadingPDVs ? (
                    <Skeleton className="h-6 w-12 mt-1" />
                  ) : (
                    <p className="text-xl font-bold text-slate-800">{pdvs.length}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Requer Atenção</p>
                  {loadingRelatorios ? (
                    <Skeleton className="h-6 w-12 mt-1" />
                  ) : (
                    <p className="text-xl font-bold text-slate-800">
                      {relatorios.filter(r => r.nota_geral && r.nota_geral < 60).length}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Taxa de Aprovação</p>
                  {loadingRelatorios ? (
                    <Skeleton className="h-6 w-12 mt-1" />
                  ) : (
                    <p className="text-xl font-bold text-slate-800">
                      {stats.total > 0 ? ((stats.aprovados / stats.total) * 100).toFixed(0) : 0}%
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">Relatórios Recentes</h2>
            <Link to={createPageUrl('Relatorios')}>
              <Button variant="ghost" className="text-[#ff7800] hover:text-[#e66a00] hover:bg-orange-50">
                Ver todos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loadingRelatorios ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Card key={i} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <Skeleton className="h-4 w-24 mb-3" />
                    <Skeleton className="h-6 w-full mb-4" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-28" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recentRelatorios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentRelatorios.map(relatorio => (
                <RelatorioCard key={relatorio.id} relatorio={relatorio} />
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-sm">
              <CardContent className="py-16 text-center">
                <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-700 mb-2">Nenhum relatório ainda</h3>
                <p className="text-slate-500 mb-4">Comece cadastrando um PDV e criando sua primeira avaliação</p>
                <Link to={createPageUrl('PDVs')}>
                  <Button className="bg-[#ff7800] hover:bg-[#e66a00]">
                    <Plus className="w-4 h-4 mr-2" />
                    Começar
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}