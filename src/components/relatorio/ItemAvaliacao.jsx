import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Camera, X, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ItemAvaliacao({ item, index, onUpdate, categoria }) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newImages = [...(item.imagens || [])];

    for (const file of files) {
      // Convert file to data URL for local storage
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        onUpdate(index, { ...item, imagens: newImages });
      };
      reader.readAsDataURL(file);
    }

    setUploading(false);
  };

  const removeImage = (imgIndex) => {
    const newImages = item.imagens.filter((_, i) => i !== imgIndex);
    onUpdate(index, { ...item, imagens: newImages });
  };

  return (
    <Card className={cn(
      "border-l-4 transition-all duration-300",
      item.conforme ? "border-l-emerald-500 bg-emerald-50/30" : "border-l-amber-500 bg-amber-50/30"
    )}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{categoria}</p>
              {item.setor && (
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  item.setor === 'PDV' ? "bg-blue-100 text-blue-700" : item.setor === 'COMERCIAL' ? "bg-amber-100 text-amber-700" : "bg-purple-100 text-purple-700"
                )}>
                  {item.setor}
                </span>
              )}
            </div>
            <h4 className="font-semibold text-slate-800 mt-1">{item.item}</h4>
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={`conforme-${index}`} className="text-sm text-slate-600">
              {item.conforme ? "Conforme" : "Não conforme"}
            </Label>
            <Switch
              id={`conforme-${index}`}
              checked={item.conforme}
              onCheckedChange={(checked) => onUpdate(index, { ...item, conforme: checked })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-slate-600">Nota (0-10)</Label>
            <Input
              type="number"
              min="0"
              max="10"
              value={item.nota || ''}
              onChange={(e) => onUpdate(index, { ...item, nota: parseFloat(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm text-slate-600">Observação</Label>
            <Textarea
              value={item.observacao || ''}
              onChange={(e) => onUpdate(index, { ...item, observacao: e.target.value })}
              placeholder="Adicione observações..."
              className="mt-1 min-h-[60px]"
            />
          </div>
        </div>

        {/* Imagens */}
        <div className="space-y-2">
          <Label className="text-sm text-slate-600 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Imagens anexadas
          </Label>
          
          <div className="flex flex-wrap gap-2">
            {(item.imagens || []).map((img, imgIndex) => (
              <div key={imgIndex} className="relative group">
                <img
                  src={img}
                  alt={`Imagem ${imgIndex + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                />
                <button
                  onClick={() => removeImage(imgIndex)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            
            <label className="w-20 h-20 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#ff7800] hover:bg-orange-50 transition-all">
              {uploading ? (
                <Loader2 className="w-5 h-5 text-[#ff7800] animate-spin" />
              ) : (
                <>
                  <Camera className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-400 mt-1">Adicionar</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}