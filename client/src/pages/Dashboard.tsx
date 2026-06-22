import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Activity, Heart, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { data: dashboardData, isLoading } = trpc.dashboard.getDashboard.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: evolutionData } = trpc.dashboard.getEvolutionChart.useQuery(undefined, {
    enabled: !!user,
  });
  const { data: qualityScore } = trpc.dashboard.getQualityOfLifeScore.useQuery(undefined, {
    enabled: !!user,
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#305ACF]" />
      </div>
    );
  }

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#192E78] mb-2">Dashboard</h1>
          <p className="text-slate-600">Seu preditor de qualidade de vida</p>
        </div>

        {/* Quality of Life Score */}
        <Card className="mb-8 bg-gradient-to-r from-[#22BFEC] to-[#305ACF] text-white border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Índice de Qualidade de Vida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-2">Pontuação geral (últimos 7 dias)</p>
                <p className="text-5xl font-bold">{qualityScore || 0}/100</p>
              </div>
              <div className="text-right">
                <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-3xl font-bold">{qualityScore || 0}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-[#22BFEC]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Total de Treinos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#305ACF]">{dashboardData?.totalWorkouts || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Todos os tempos</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#305ACF]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Sequência Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#305ACF]">{dashboardData?.currentStreak || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Dias consecutivos</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#8966D2]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Melhor Sequência</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#8966D2]">{dashboardData?.bestStreak || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Recorde pessoal</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#22BFEC]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Treinos do Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#22BFEC]">{dashboardData?.monthlyWorkouts || 0}</p>
              <p className="text-xs text-slate-500 mt-1">Este mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weight Evolution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#192E78] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#305ACF]" />
                Evolução de Peso
              </CardTitle>
              <CardDescription>Últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              {evolutionData && evolutionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(date) => new Date(date).toLocaleDateString("pt-BR", { month: "short", day: "numeric" })}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => value ? value.toString() : "N/A"}
                      labelFormatter={(label) => new Date(label).toLocaleDateString("pt-BR")}
                    />
                    <Line type="monotone" dataKey="weight" stroke="#305ACF" strokeWidth={2} dot={{ fill: "#305ACF" }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-80 flex items-center justify-center text-slate-500">
                  Nenhum dado de peso registrado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Weekly Workouts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#192E78] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#22BFEC]" />
                Treinos da Semana
              </CardTitle>
              <CardDescription>Últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.weeklyWorkouts || 0 > 0 ? (
                  <div>
                    <p className="text-2xl font-bold text-[#22BFEC]">{dashboardData?.weeklyWorkouts || 0}</p>
                    <p className="text-sm text-slate-600">treinos realizados</p>
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-slate-500">
                    Nenhum treino esta semana
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Body Evolution Summary */}
        {dashboardData?.bodyEvolution && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-[#192E78]">Evolução Corporal</CardTitle>
              <CardDescription>Última medição</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dashboardData.bodyEvolution.weight && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Peso</p>
                    <p className="text-2xl font-bold text-[#305ACF]">{dashboardData.bodyEvolution.weight} kg</p>
                  </div>
                )}
                {dashboardData.bodyEvolution.imc && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">IMC</p>
                    <p className="text-2xl font-bold text-[#305ACF]">{dashboardData.bodyEvolution.imc}</p>
                  </div>
                )}
                {dashboardData.bodyEvolution.bodyFatPercentage && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Gordura</p>
                    <p className="text-2xl font-bold text-[#8966D2]">{dashboardData.bodyEvolution.bodyFatPercentage}%</p>
                  </div>
                )}
                {dashboardData.bodyEvolution.muscleMass && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">Massa Muscular</p>
                    <p className="text-2xl font-bold text-[#22BFEC]">{dashboardData.bodyEvolution.muscleMass} kg</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Missions */}
        {dashboardData?.activeMissions && dashboardData.activeMissions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[#192E78] flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Missões Ativas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData.activeMissions.map((mission) => (
                  <div key={mission.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{mission.missionName}</p>
                      <p className="text-sm text-slate-500">{mission.missionType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#305ACF]">{mission.progress}/{mission.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </DashboardLayout>
  );
}

