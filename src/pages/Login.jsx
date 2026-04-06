import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await signIn({ email, password, rememberMe });
      toast({ title: 'Bem-vindo!', description: 'Login realizado com sucesso.' });
      navigate(from, { replace: true });
    } catch (error) {
      toast({
        title: 'Não foi possível entrar',
        description:
          error?.message ||
          'Verifique seu e-mail e senha e tente novamente.',
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
          <CardTitle>Entrar</CardTitle>
          <p className="text-sm text-slate-500">Digite suas credenciais para continuar.</p>
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

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                />
                <Label htmlFor="remember" className="text-sm">
                  Lembrar-me
                </Label>
              </div>
              <Link
                to="/ForgotPassword"
                className="text-sm text-[#ff7800] hover:text-[#e66a00]"
              >
                Esqueci minha senha
              </Link>
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            Ainda não tem conta?{' '}
            <Link to="/Register" className="text-[#ff7800] hover:text-[#e66a00]">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
