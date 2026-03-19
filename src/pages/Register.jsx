import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const passwordStrength = (value) => {
  if (!value) return { valid: false, message: 'Senha é obrigatória.' };
  if (value.length < 8) return { valid: false, message: 'A senha deve ter ao menos 8 caracteres.' };
  if (!/[A-Z]/.test(value)) return { valid: false, message: 'Inclua ao menos uma letra maiúscula.' };
  if (!/[0-9]/.test(value)) return { valid: false, message: 'Inclua ao menos um número.' };
  if (!/[!@#$%^&*()\[\]{}\-_+=~`|:/;"'<>,.?]/.test(value)) {
    return { valid: false, message: 'Inclua ao menos um caractere especial.' };
  }
  return { valid: true };
};

export default function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    const strength = passwordStrength(password);
    if (!strength.valid) {
      toast({
        title: 'Senha fraca',
        description: strength.message,
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await signUp({ email, password, full_name: name });
      toast({
        title: 'Cadastrado com sucesso',
        description: 'Verifique seu e-mail para confirmar sua conta.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Erro ao cadastrar',
        description:
          error?.message ||
          'Não foi possível criar sua conta. Tente novamente mais tarde.',
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
          <CardTitle>Cadastrar</CardTitle>
          <p className="text-sm text-slate-500">Crie sua conta para acessar o sistema.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Seu nome completo"
              />
            </div>

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

            <div>
              <Label htmlFor="confirmPassword">Confirmar senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            Já tem conta?{' '}
            <Link to="/login" className="text-[#ff7800] hover:text-[#e66a00]">
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
