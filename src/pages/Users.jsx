import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ROLE_OPTIONS = ['user', 'admin'];

export default function Users() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Perfil atualizado', description: 'Permissões atualizadas com sucesso.' });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error?.message || 'Não foi possível atualizar o usuário.',
        variant: 'destructive',
      });
    },
  });

  const handleRoleChange = (id, newRole) => {
    updateRoleMutation.mutate({ id, role: newRole });
  };

  const rows = useMemo(() => users || [], [users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Usuários</h1>
            <p className="text-slate-600 mt-1">Gerencie permissões e perfis do sistema.</p>
          </div>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Nome</TableHead>
                    <TableHead className="font-semibold text-slate-700">E-mail</TableHead>
                    <TableHead className="font-semibold text-slate-700">Função</TableHead>
                    <TableHead className="font-semibold text-slate-700">Criado em</TableHead>
                    <TableHead className="font-semibold text-slate-700 text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-800">{user.full_name || '-'}</TableCell>
                      <TableCell className="text-slate-600">{user.email}</TableCell>
                      <TableCell className="text-slate-600">{user.role}</TableCell>
                      <TableCell className="text-slate-600">
                        {user.created_at ? new Date(user.created_at).toLocaleString() : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {ROLE_OPTIONS.map((role) => (
                            <Button
                              key={role}
                              variant={user.role === role ? 'secondary' : 'outline'}
                              size="sm"
                              onClick={() => handleRoleChange(user.id, role)}
                              disabled={updateRoleMutation.isLoading}
                            >
                              {role}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {(!isLoading && rows.length === 0) && (
          <div className="mt-8 text-center text-slate-500">
            Nenhum usuário encontrado.
          </div>
        )}
      </div>
    </div>
  );
}
