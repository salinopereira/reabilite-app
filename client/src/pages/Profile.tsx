import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Save } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    photoUrl: "",
    height: "" as string,
    weight: "" as string,
    objective: "",
    age: "",
    gender: "",
    observations: "",
  });

  const { data: profile, isLoading: profileLoading } = trpc.users.getProfile.useQuery(undefined, {
    enabled: !!user,
  });

  const { mutate: updateProfile, isPending } = trpc.users.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao atualizar perfil");
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        photoUrl: profile.photoUrl || "",
        height: profile.height ? profile.height.toString() : "",
        weight: profile.weight ? profile.weight.toString() : "",
        objective: profile.objective || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        observations: profile.observations || "",
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      photoUrl: formData.photoUrl || undefined,
      height: formData.height ? formData.height : undefined,
      weight: formData.weight ? formData.weight : undefined,
      objective: formData.objective || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      gender: (formData.gender as "male" | "female" | "other") || undefined,
      observations: formData.observations || undefined,
    });
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#305ACF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#192E78] mb-2 flex items-center gap-2">
            <User className="w-8 h-8" />
            Meu Perfil
          </h1>
          <p className="text-slate-600">Atualize suas informações pessoais e objetivos</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-[#192E78] to-[#305ACF] text-white border-0">
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="opacity-80">Nome:</span> {user?.name}
              </p>
              <p>
                <span className="opacity-80">Email:</span> {user?.email}
              </p>
              <p>
                <span className="opacity-80">Tipo:</span> {user?.userType === "patient" ? "Paciente" : "Profissional"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-[#192E78]">Dados Pessoais</CardTitle>
            <CardDescription>Complete seu perfil para uma melhor experiência</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Photo URL */}
              <div>
                <Label htmlFor="photoUrl" className="text-[#192E78]">
                  Foto de Perfil (URL)
                </Label>
                <Input
                  id="photoUrl"
                  type="url"
                  placeholder="https://exemplo.com/foto.jpg"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-slate-500 mt-2">Cole a URL de uma foto sua</p>
              </div>

              {/* Height and Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height" className="text-[#192E78]">
                    Altura (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="170"
                    step="0.01"
                    value={formData.height || ""}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-[#192E78]">
                    Peso (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="75"
                    step="0.01"
                    value={formData.weight || ""}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Age and Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="text-[#192E78]">
                    Idade
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="30"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="gender" className="text-[#192E78]">
                    Gênero
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Objective */}
              <div>
                <Label htmlFor="objective" className="text-[#192E78]">
                  Objetivo Principal
                </Label>
                <Input
                  id="objective"
                  type="text"
                  placeholder="Ex: Perder peso, ganhar massa muscular, melhorar saúde"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Observations */}
              <div>
                <Label htmlFor="observations" className="text-[#192E78]">
                  Observações
                </Label>
                <Textarea
                  id="observations"
                  placeholder="Informações adicionais relevantes para seu acompanhamento"
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="mt-2"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-gradient-to-r from-[#22BFEC] to-[#305ACF] hover:from-[#305ACF] hover:to-[#192E78] text-white"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Perfil
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
