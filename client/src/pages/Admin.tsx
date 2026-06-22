import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Users, CheckCircle, TrendingUp, UserCheck, UserX, Loader2, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Admin() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  const usersQuery = trpc.users.listAll.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  const approveUser = trpc.users.setApproval.useMutation({
    onSuccess: () => usersQuery.refetch(),
  });

  const setRole = trpc.users.setRole.useMutation({
    onSuccess: () => usersQuery.refetch(),
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#192E78]" />
        </div>
      </DashboardLayout>
    );
  }

  if (user?.role !== "admin") {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-64 gap-4">
          <AlertTriangle className="w-12 h-12 text-yellow-500" />
          <h2 className="text-xl font-bold text-[#192E78]">Acesso Negado</h2>
          <p className="text-slate-500">Você não tem permissão para acessar esta área.</p>
          <Button onClick={() => setLocation("/dashboard")} className="bg-[#192E78]">
            Voltar ao Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const users = usersQuery.data ?? [];
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.approvalStatus === "approved").length;
  const pendingUsers = users.filter(u => u.approvalStatus === "pending").length;
  const adminUsers = users.filter(u => u.role === "admin").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#8966D2]/10 rounded-lg">
            <Shield className="w-6 h-6 text-[#8966D2]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#192E78]">Administração</h1>
            <p className="text-slate-500 text-sm">Gerencie usuários, permissões e o sistema</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-[#22BFEC]">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Usuários</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#192E78]">{totalUsers}</span>
                <Users className="w-5 h-5 text-[#22BFEC] mb-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#305ACF]">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs text-slate-500 font-medium uppercase tracking-wide">Aprovados</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#192E78]">{activeUsers}</span>
                <UserCheck className="w-5 h-5 text-green-500 mb-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-400">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs text-slate-500 font-medium uppercase tracking-wide">Pendentes</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#192E78]">{pendingUsers}</span>
                <AlertTriangle className="w-5 h-5 text-yellow-500 mb-1" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#8966D2]">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-xs text-slate-500 font-medium uppercase tracking-wide">Admins</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-[#192E78]">{adminUsers}</span>
                <Shield className="w-5 h-5 text-[#8966D2] mb-1" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[#192E78] flex items-center gap-2">
              <Users className="w-5 h-5" />
              Todos os Usuários
            </CardTitle>
          </CardHeader>
          <CardContent>
            {usersQuery.isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#192E78]" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Nenhum usuário encontrado</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(u => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium text-[#192E78]">{u.name || "-"}</TableCell>
                        <TableCell className="text-slate-500 text-sm">{u.email || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {u.userType === "patient" ? "Aluno" : u.userType === "professional" ? "Profissional" : "Admin"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`text-xs ${
                              u.approvalStatus === "approved"
                                ? "bg-green-100 text-green-700"
                                : u.approvalStatus === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {u.approvalStatus === "approved" ? "Aprovado" : u.approvalStatus === "pending" ? "Pendente" : "Rejeitado"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${u.role === "admin" ? "bg-[#8966D2] text-white" : "bg-slate-100 text-slate-600"}`}>
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs">
                          {u.createdAt ? format(new Date(u.createdAt), "dd/MM/yyyy", { locale: ptBR }) : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {u.approvalStatus !== "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 text-green-600 border-green-300 hover:bg-green-50"
                                onClick={() => approveUser.mutate({ userId: u.id, status: "approved" })}
                                disabled={approveUser.isPending}
                              >
                                <UserCheck className="w-3 h-3 mr-1" />
                                Aprovar
                              </Button>
                            )}
                            {u.approvalStatus === "approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 text-red-500 border-red-300 hover:bg-red-50"
                                onClick={() => approveUser.mutate({ userId: u.id, status: "rejected" })}
                                disabled={approveUser.isPending}
                              >
                                <UserX className="w-3 h-3 mr-1" />
                                Suspender
                              </Button>
                            )}
                            {u.role !== "admin" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 text-[#8966D2] border-[#8966D2]/30 hover:bg-[#8966D2]/10"
                                onClick={() => setRole.mutate({ userId: u.id, role: "admin" })}
                                disabled={setRole.isPending}
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </Button>
                            )}
                            {u.role === "admin" && u.id !== user?.id && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-7 text-slate-500"
                                onClick={() => setRole.mutate({ userId: u.id, role: "user" })}
                                disabled={setRole.isPending}
                              >
                                Remover Admin
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature checklist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-[#192E78] flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { label: "Autenticação email/senha", done: true },
                { label: "ReabiCheck — check-in diário", done: true },
                { label: "Dashboard do aluno", done: true },
                { label: "Gamificação — pontos e medalhas", done: true },
                { label: "Perfil do aluno", done: true },
                { label: "Painel de administração", done: true },
                { label: "Ranking entre alunos", done: false },
                { label: "Treinos personalizados", done: false },
                { label: "Nutrição e hábitos", done: false },
                { label: "Feed social", done: false },
                { label: "Desafios", done: false },
                { label: "Saúde mental", done: false },
                { label: "Upload de fotos de treino", done: false },
                { label: "Notificações push (PWA)", done: false },
                { label: "Exportação PDF/Excel", done: false },
                { label: "Integração WhatsApp", done: false },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? "bg-green-100" : "bg-slate-100"}`}>
                    {item.done ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className={`text-sm ${item.done ? "text-slate-700" : "text-slate-400"}`}>{item.label}</span>
                  {item.done && <span className="ml-auto text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full">✓ Pronto</span>}
                  {!item.done && <span className="ml-auto text-[10px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Em breve</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
