import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, TrendingUp, Users, Zap, Award } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

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
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">REABILITE</h1>
            <p className="text-xl text-blue-100 mb-2">Saúde Integrativa, Performance e Evolução</p>
            <p className="text-lg text-blue-100">Transformando consistência em resultados</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <CheckCircle className="w-8 h-8 mb-2 text-[#22BFEC]" />
                <CardTitle>ReabiCheck</CardTitle>
                <CardDescription className="text-blue-100">Check-in inteligente</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Registre seus treinos, fotos de evolução e mantenha seu streak de consistência.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <TrendingUp className="w-8 h-8 mb-2 text-[#22BFEC]" />
                <CardTitle>Dashboard Unificado</CardTitle>
                <CardDescription className="text-blue-100">Preditor de qualidade de vida</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Visualize todos os dados de saúde em um único lugar: treinos, nutrição, sono e muito mais.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <Award className="w-8 h-8 mb-2 text-[#22BFEC]" />
                <CardTitle>Gamificação</CardTitle>
                <CardDescription className="text-blue-100">Medalhas e ranking</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Desbloqueie medalhas, suba de nível e compita no ranking com outros usuários.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-blue-300 text-white">
              <CardHeader>
                <Users className="w-8 h-8 mb-2 text-[#22BFEC]" />
                <CardTitle>Comunidade Social</CardTitle>
                <CardDescription className="text-blue-100">Conecte-se com outros</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Compartilhe conquistas, receba apoio e inspire outros em sua jornada.</p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <p className="text-white text-lg mb-6">Comece sua jornada para uma vida melhor</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-[#22BFEC] hover:bg-[#305ACF] text-white"
              >
                <a href={getLoginUrl()}>Entrar / Cadastrar</a>
              </Button>
            </div>
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
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>ReabiCheck - Check-in diário</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Dashboard - Preditor de qualidade de vida</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Perfil - Dados pessoais</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Gamificação - Medalhas e XP</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#192E78]">Em Breve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Treinos personalizados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Nutrição e hábitos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Feed social</span>
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span>Assistente IA</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
