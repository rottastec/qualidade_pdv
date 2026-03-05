import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Eye, Calendar, User, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { cn } from "@/lib/utils";

const statusConfig = {
  aprovado: { label: "Aprovado", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  reprovado: { label: "Reprovado", className: "bg-red-100 text-red-700 border-red-200" },
  pendente: { label: "Pendente", className: "bg-amber-100 text-amber-700 border-amber-200" }
};

const documentoConfig = {
  rascunho: { label: "Rascunho", className: "bg-slate-100 text-slate-600" },
  finalizado: { label: "Finalizado", className: "bg-blue-100 text-blue-700" }
};

export default function RelatorioCard({ relatorio }) {
  const status = statusConfig[relatorio.resultado] || statusConfig.pendente;
  const documento = documentoConfig[relatorio.status] || documentoConfig.rascunho;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden">
      <div className={cn(
        "h-1",
        relatorio.resultado === 'aprovado' && "bg-emerald-500",
        relatorio.resultado === 'reprovado' && "bg-red-500",
        relatorio.resultado === 'pendente' && "bg-amber-500"
      )} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={documento.className}>
                {documento.label}
              </Badge>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
              {relatorio.pdv_nome || 'PDV não identificado'}
            </h3>
          </div>
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff7800] to-[#e66a00] text-white">
            <div className="text-center">
              <p className="text-lg font-bold leading-none">{relatorio.nota_geral?.toFixed(0) || '0'}</p>
              <p className="text-[10px] opacity-80">pts</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>
              {relatorio.data_visita 
                ? format(new Date(relatorio.data_visita), "dd 'de' MMM, yyyy", { locale: ptBR })
                : 'Data não informada'
              }
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <span>{relatorio.auditor || 'Auditor não informado'}</span>
          </div>
          {relatorio.itens_avaliacao && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-400" />
              <span>{relatorio.itens_avaliacao.length} itens avaliados</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100">
          {(
            relatorio.id &&
            relatorio.id !== 'null' &&
            relatorio.id !== 'undefined'
          ) ? (
            <Link to={createPageUrl(`VisualizarRelatorio?id=${relatorio.id}`)}>
              <Button variant="outline" className="w-full group-hover:bg-orange-50 group-hover:border-orange-200 group-hover:text-[#ff7800] transition-all">
                <Eye className="w-4 h-4 mr-2" />
                Visualizar
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled className="w-full text-slate-400">
              <Eye className="w-4 h-4 mr-2" />
              Sem ID
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}