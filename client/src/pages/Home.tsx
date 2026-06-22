import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, TrendingUp, Users, Zap, Award } from "lucide-react";
import { Link } from "wouter";

type AuthMode = "login" | "register";

export default function Home() {
  const { user, loading, isAuthenticated, refresh } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body: Record<string, string> = { email, password };
      if (mode === "register") body.name = name;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro desconhecido");
      } else {
        refresh();
      }
    } catch {
      setError("Erro de conexão com o servidor");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#192E78] to-[#305ACF]">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#192E78] to-[#305ACF]">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-white mb-4">REABILITE</h1>
            <p className="text-xl text-blue-100 mb-2">Saúde Integrativa, Performance e Evolução</p>
            <p className="text-lg text-blue-100">Transformando consistência em resultados</p>
          </div>

          <div className="max-w-md mx-auto mb-10">
            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <CardTitle className="text-center text-white">
                  {mode === "login" ? "Entrar" : "Criar conta"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1">
                    <Label className="text-blue-100">Nome</Label>
                    <Input
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Seu nome"
                      className="bg-white/20 border-blue-300 text-white placeholder:text-blue-200"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-blue-100">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-white/20 border-blue-300 text-white placeholder:text-blue-200"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-blue-100">Senha</Label>
                  <Input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••"
                    className="bg-white/20 border-blue-300 text-white placeholder:text-blue-200"
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  />
                </div>
                {error && <p className="text-red-300 text-sm">{error}</p>}
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-[#22BFEC] hover:bg-[#305ACF] text-white"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : mode === "login" ? "Entrar" : "Cadastrar"}
                </Button>
                <p className="text-center text-blue-200 text-sm">
                  {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
                  <button
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
                    className="underline text-[#22BFEC] hover:text-white"
                  >
                    {mode === "login" ? "Cadastre-se" : "Entrar"}
                  </button>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <CheckCircle className="w-6 h-6 mb-1 text-[#22BFEC]" />
                <CardTitle className="text-base">ReabiCheck</CardTitle>
                <CardDescription className="text-blue-200 text-xs">Check-in inteligente</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <TrendingUp className="w-6 h-6 mb-1 text-[#22BFEC]" />
                <CardTitle className="text-base">Dashboard</CardTitle>
                <CardDescription className="text-blue-200 text-xs">Preditor de qualidade de vida</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <Award className="w-6 h-6 mb-1 text-[#22BFEC]" />
                <CardTitle className="text-base">Gamificação</CardTitle>
                <CardDescription className="text-blue-200 text-xs">Medalhas e ranking</CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <Users className="w-6 h-6 mb-1 text-[#22BFEC]" />
                <CardTitle className="text-base">Comunidade</CardTitle>
                <CardDescription className="text-blue-200 text-xs">Conecte-se com outros</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#192E78] mb-2">Bem-vindo, {user?.name}!</h1>
          <p className="text-slate-600">Sua jornada para uma vida melhor começa aqui</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard">
            <a className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#22BFEC]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-[#192E78]">Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#305ACF]">Visão Geral</p>
                </CardContent>
              </Card>
            </a>
          </Link>
          <Link href="/reabicheck">
            <a className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#305ACF]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-[#192E78]">ReabiCheck</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#305ACF]">Check-in</p>
                </CardContent>
              </Card>
            </a>
          </Link>
          <Link href="/profile">
            <a className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#8966D2]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-[#192E78]">Perfil</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#8966D2]">Dados</p>
                </CardContent>
              </Card>
            </a>
          </Link>
          <Link href="/gamification">
            <a className="block">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-[#22BFEC]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-[#192E78]">Gamificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#22BFEC]">Medalhas</p>
                </CardContent>
              </Card>
            </a>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#192E78]">Módulos Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>ReabiCheck — Check-in diário</span></li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>Dashboard — Preditor de qualidade de vida</span></li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>Perfil — Dados pessoais</span></li>
                <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span>Gamificação — Medalhas e XP</span></li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-[#192E78]">Em Breve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /><span>Treinos personalizados</span></li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /><span>Nutrição e hábitos</span></li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /><span>Feed social</span></li>
                <li className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" /><span>Assistente IA</span></li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
