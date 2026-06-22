import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trophy, Star, Zap, Award } from "lucide-react";

const BADGES = [
  { id: "7workouts", name: "Iniciante", workouts: 7, icon: "🌟", color: "text-blue-500" },
  { id: "30workouts", name: "Consistência", workouts: 30, icon: "⭐", color: "text-purple-500" },
  { id: "50workouts", name: "Guerreiro", workouts: 50, icon: "🔥", color: "text-orange-500" },
  { id: "100workouts", name: "Elite Reabilite", workouts: 100, icon: "👑", color: "text-yellow-500" },
  { id: "200workouts", name: "Lenda Reabilite", workouts: 200, icon: "💎", color: "text-cyan-500" },
  { id: "500workouts", name: "Imortal Reabilite", workouts: 500, icon: "🌠", color: "text-pink-500" },
];

export default function Gamification() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#305ACF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#192E78] mb-2 flex items-center gap-2">
            <Trophy className="w-8 h-8" />
            Gamificação
          </h1>
          <p className="text-slate-600">Desbloqueie medalhas e suba de nível</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-[#22BFEC]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Nível Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#305ACF]">1</p>
              <p className="text-xs text-slate-500 mt-1">Iniciante</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#8966D2]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-500" />
                XP Acumulado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#8966D2]">0</p>
              <p className="text-xs text-slate-500 mt-1">pontos de experiência</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#22BFEC]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" />
                Pontos Totais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#22BFEC]">0</p>
              <p className="text-xs text-slate-500 mt-1">pontos conquistados</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#305ACF]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Medalhas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#305ACF]">0</p>
              <p className="text-xs text-slate-500 mt-1">de 6 desbloqueadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#192E78]">Medalhas Disponíveis</CardTitle>
            <CardDescription>Desbloqueie medalhas ao atingir marcos de treinos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BADGES.map((badge) => (
                <div key={badge.id} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 hover:border-[#305ACF] transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{badge.icon}</div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Desbloqueável em</p>
                      <p className="text-lg font-bold text-[#305ACF]">{badge.workouts}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-slate-900">{badge.name}</p>
                  <p className="text-sm text-slate-600 mt-1">Treinos necessários</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Level Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#192E78]">Progressão de Nível</CardTitle>
            <CardDescription>Suba de nível ao acumular XP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22BFEC] to-[#305ACF] flex items-center justify-center text-white font-bold">
                    {level}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">Nível {level}</p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-[#22BFEC] to-[#305ACF] h-2 rounded-full"
                        style={{ width: level === 1 ? "0%" : "0%" }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500">{level * 100} XP</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Ranking Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#192E78]">Top Ranking</CardTitle>
            <CardDescription>Veja como você se compara com outros usuários</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Top Jogador</p>
                    <p className="text-sm text-slate-600">150 treinos</p>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Segundo Lugar</p>
                    <p className="text-sm text-slate-600">120 treinos</p>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-gray-500" />
              </div>

              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Terceiro Lugar</p>
                    <p className="text-sm text-slate-600">100 treinos</p>
                  </div>
                </div>
                <Trophy className="w-5 h-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
