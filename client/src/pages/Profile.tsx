import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, User, Mail, FileText, Calendar, ArrowLeft } from "lucide-react";

interface UserData {
  id: number;
  name: string;
  email: string;
  cpf: string;
  createdAt: string;
}

export default function Profile({ 
  token, 
  onBack,
  onLogout 
}: { 
  token: string; 
  onBack: () => void;
  onLogout: () => void;
}) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Decodificar JWT para obter userId
      const parts = token.split(".");
      if (parts.length !== 3) {
        toast.error("Token inválido");
        return;
      }

      const decoded = JSON.parse(atob(parts[1]));
      const userId = decoded.userId;

      // Buscar dados do usuário (você pode criar um endpoint específico para isso)
      // Por enquanto, vamos usar localStorage ou criar um endpoint
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const formatCPF = (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-500" />
            <span className="text-lg sm:text-xl font-bold text-white">Meu Perfil</span>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("authToken");
              localStorage.removeItem("userData");
              onLogout();
            }}
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300 hover:text-white text-xs sm:text-sm"
          >
            <LogOut className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {userData ? (
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg sm:text-2xl flex items-center gap-2">
                  <User className="w-6 h-6 text-emerald-500" />
                  Dados Cadastrados
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Informações da sua conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nome */}
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nome Completo
                  </Label>
                  <div className="bg-slate-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {userData.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <div className="bg-slate-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-white font-semibold text-sm sm:text-base break-all">
                      {userData.email}
                    </p>
                  </div>
                </div>

                {/* CPF */}
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    CPF
                  </Label>
                  <div className="bg-slate-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {formatCPF(userData.cpf)}
                    </p>
                  </div>
                </div>

                {/* Data de Cadastro */}
                <div className="space-y-2">
                  <Label className="text-slate-300 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Membro desde
                  </Label>
                  <div className="bg-slate-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-white font-semibold text-sm sm:text-base">
                      {formatDate(userData.createdAt)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ações */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-base sm:text-lg">
                  Ações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={onBack}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2"
                >
                  Voltar ao Dashboard
                </Button>
                <Button
                  onClick={() => {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("userData");
                    onLogout();
                  }}
                  variant="outline"
                  className="w-full border-red-600 text-red-400 hover:text-red-300 text-sm py-2"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Fazer Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="py-8 text-center">
              <p className="text-slate-400">Erro ao carregar dados do perfil</p>
              <Button
                onClick={onBack}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700"
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Label component (se não existir)
function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
