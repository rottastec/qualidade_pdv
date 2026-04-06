import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [linkLoaded, setLinkLoaded] = useState(false);

  useEffect(() => {
    const loadFromUrl = async () => {
      const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
      if (error) {
        toast({
          title: 'Link inválido',
          description: 'O link de redefinição de senha não é válido ou expirou.',
          variant: 'destructive',
        });
      }
      setLinkLoaded(true);
    };
    loadFromUrl();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: 'Senhas diferentes',
        description: 'As senhas devem ser iguais.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await updatePassword(password);
      toast({
        title: 'Senha atualizada',
        description: 'Agora você pode fazer login com a nova senha.',
      });
      navigate('/Login');
    } catch (error) {
      toast({
        title: 'Não foi possível atualizar',
        description:
          error?.message ||
          'Ocorreu um erro ao atualizar a senha. Tente novamente.',
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
          <CardTitle>Redefinir senha</CardTitle>
          <p className="text-sm text-slate-500">Defina uma nova senha para sua conta.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={!linkLoaded}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={!linkLoaded}
              />
            </div>

            <Button className="w-full" type="submit" disabled={!linkLoaded || isSubmitting}>
              {isSubmitting ? 'Aguarde...' : 'Redefinir senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
