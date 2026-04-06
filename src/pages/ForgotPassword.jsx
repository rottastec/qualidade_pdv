import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function ForgotPassword() {
  const { sendPasswordResetEmail } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(email);
      toast({
        title: 'E-mail enviado',
        description: 'Cheque a sua caixa de entrada para redefinir a senha.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao enviar e-mail',
        description:
          error?.message ||
          'Não foi possível enviar o e-mail de recuperação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-0">
          <CardTitle>Recuperar senha</CardTitle>
          <p className="text-sm text-slate-500">Informe seu e-mail para receber o link de redefinição.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@exemplo.com"
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Aguarde...' : 'Enviar link'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            <Link to="/Login" className="text-[#ff7800] hover:text-[#e66a00]">
              Voltar ao login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
