import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" /> Acesso negado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 mb-4">
            Você não tem permissão para acessar esta página. Caso ache que deveria ter acesso,
            entre em contato com o administrador.
          </p>
          <div className="flex justify-end">
            <Link to="/">
              <Button>Voltar ao início</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
