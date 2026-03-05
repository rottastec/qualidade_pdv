import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, FileText, Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PDVCard({ pdv, onEdit }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Badge
              variant="outline"
              className={pdv.status === 'ativo'
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-slate-100 text-slate-600"
              }
            >
              {pdv.status === 'ativo' ? 'Ativo' : 'Inativo'}
            </Badge>
            <h3 className="font-semibold text-lg text-slate-800 mt-2 group-hover:text-blue-600 transition-colors">
              {pdv.nome}
            </h3>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{pdv.cidade}, {pdv.estado}</span>
          </div>
          {(pdv.responsavel_pdv || pdv.responsavel_mkt || pdv.responsavel_comercial || pdv.responsavel) && (
            <div className="space-y-1">
              {(pdv.responsavel_pdv || pdv.responsavel) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-600 w-14">PDV:</span>
                  <span>{pdv.responsavel_pdv || pdv.responsavel}</span>
                </div>
              )}
              {pdv.responsavel_mkt && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-600 w-14">MKT:</span>
                  <span>{pdv.responsavel_mkt}</span>
                </div>
              )}
              {pdv.responsavel_comercial && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-600 w-14">Comercial:</span>
                  <span>{pdv.responsavel_comercial}</span>
                </div>
              )}
            </div>
          )}
          {pdv.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400" />
              <span>{pdv.telefone}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(pdv)}
            className="border-slate-200 hover:bg-slate-50"
          >
            <Pencil className="w-4 h-4 text-slate-600" />
          </Button>
          <Link to={createPageUrl(`NovoRelatorio?pdv_id=${pdv.id}&pdv_nome=${encodeURIComponent(pdv.nome)}`)} className="flex-1">
            <Button className="w-full bg-[#ff7800] hover:bg-[#e66a00]">
              Nova Avaliação
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}