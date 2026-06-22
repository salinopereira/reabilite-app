import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, Calendar, Flame } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function ReabiCheck() {
  const { user, loading: authLoading } = useAuth();
  const [photoUrl, setPhotoUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [checkinDate, setCheckinDate] = useState(new Date().toISOString().split("T")[0]);

  const { mutate: createCheckin, isPending } = trpc.reabiCheck.createCheckin.useMutation({
    onSuccess: () => {
      toast.success("Check-in realizado com sucesso!");
      setPhotoUrl("");
      setNotes("");
      setCheckinDate(new Date().toISOString().split("T")[0]);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao realizar check-in");
    },
  });

  const { data: checkins, isLoading: checkinsLoading } = trpc.reabiCheck.getCheckins.useQuery(
    {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date().toISOString(),
    },
    { enabled: !!user }
  );

  const { data: streak } = trpc.reabiCheck.getCurrentStreak.useQuery(undefined, { enabled: !!user });
  const { data: totalWorkouts } = trpc.reabiCheck.getTotalWorkouts.useQuery(undefined, { enabled: !!user });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCheckin({
      checkinDate,
      photoUrl: photoUrl || undefined,
      notes: notes || undefined,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#305ACF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#192E78] mb-2">ReabiCheck</h1>
          <p className="text-slate-600">Registre seu treino e mantenha sua sequência de consistência</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-l-4 border-l-[#22BFEC]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600 flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" />
                Sequência Atual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#305ACF]">{streak?.streak || 0}</p>
              <p className="text-xs text-slate-500 mt-1">dias consecutivos</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#8966D2]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Melhor Sequência</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#8966D2]">{streak?.bestStreak || 0}</p>
              <p className="text-xs text-slate-500 mt-1">recorde pessoal</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#22BFEC]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-slate-600">Total de Treinos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-[#22BFEC]">{totalWorkouts?.total || 0}</p>
              <p className="text-xs text-slate-500 mt-1">todos os tempos</p>
            </CardContent>
          </Card>
        </div>

        {/* Check-in Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-[#192E78]">Novo Check-in</CardTitle>
            <CardDescription>Registre seu treino de hoje</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="checkinDate" className="text-[#192E78]">
                  Data do Treino
                </Label>
                <Input
                  id="checkinDate"
                  type="date"
                  value={checkinDate}
                  onChange={(e) => setCheckinDate(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="photoUrl" className="text-[#192E78]">
                  URL da Foto (opcional)
                </Label>
                <Input
                  id="photoUrl"
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="mt-2"
                />
                <p className="text-xs text-slate-500 mt-2">Cole a URL de uma foto de comprovação do treino</p>
              </div>

              <div>
                <Label htmlFor="notes" className="text-[#192E78]">
                  Anotações (opcional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Como foi seu treino? Algo importante a registrar?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-[#22BFEC] to-[#305ACF] hover:from-[#305ACF] hover:to-[#192E78] text-white"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirmar Check-in
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Checkins History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#192E78] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Histórico de Treinos
            </CardTitle>
            <CardDescription>Check-ins deste mês</CardDescription>
          </CardHeader>
          <CardContent>
            {checkinsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#305ACF]" />
              </div>
            ) : checkins && checkins.length > 0 ? (
              <div className="space-y-3">
                {checkins.map((checkin) => (
                  <div key={checkin.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="font-medium text-slate-900">
                        {new Date(checkin.checkinDate).toLocaleDateString("pt-BR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      {checkin.notes && <p className="text-sm text-slate-600 mt-1">{checkin.notes}</p>}
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">Nenhum check-in registrado este mês</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
