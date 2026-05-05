import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { TrendingUp, Lock, Zap, BarChart3 } from "lucide-react";
import Dashboard from "./Dashboard";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({ cpf: "", password: "" });

  // Register form
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    cpf: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/trpc/auth.login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: { cpf: loginData.cpf, password: loginData.password },
        }),
      });

      const data = await response.json();
      if (data.result?.data?.token) {
        setToken(data.result.data.token);
        setIsLoggedIn(true);
        localStorage.setItem("authToken", data.result.data.token);
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error(data.result?.error?.message || "Erro ao fazer login");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/trpc/auth.register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          json: registerData,
        }),
      });

      const data = await response.json();
      if (data.result?.data?.token) {
        setToken(data.result.data.token);
        setIsLoggedIn(true);
        localStorage.setItem("authToken", data.result.data.token);
        toast.success("Cadastro realizado com sucesso!");
      } else {
        toast.error(data.result?.error?.message || "Erro ao cadastrar");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn && token) {
    return <Dashboard token={token} onLogout={() => setIsLoggedIn(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-white">WealthChain</span>
          </div>
          <span className="text-slate-400 text-sm">Investimentos Inteligentes</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Features */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                Invista com Inteligência
              </h1>
              <p className="text-xl text-slate-300">
                Plataforma segura para gerenciar seus investimentos com controle total do seu saldo e rentabilidade em tempo real.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Lock className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Segurança de Verdade</h3>
                  <p className="text-slate-400">Autenticação com criptografia bcrypt e JWT</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <BarChart3 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Controle Total</h3>
                  <p className="text-slate-400">Acompanhe seu saldo e investimentos em tempo real</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Zap className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Operações Rápidas</h3>
                  <p className="text-slate-400">Compre, venda e resgate seus investimentos instantaneamente</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Bem-vindo ao WealthChain</CardTitle>
              <CardDescription className="text-slate-400">
                Faça login ou crie sua conta para começar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-slate-700">
                  <TabsTrigger value="login" className="text-slate-300 data-[state=active]:text-white">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-slate-300 data-[state=active]:text-white">
                    Cadastro
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4 mt-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-cpf" className="text-slate-300">CPF</Label>
                      <Input
                        id="login-cpf"
                        placeholder="000.000.000-00"
                        value={loginData.cpf}
                        onChange={(e) => setLoginData({ ...loginData, cpf: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-slate-300">Senha</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {loading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register" className="space-y-4 mt-4">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name" className="text-slate-300">Nome Completo</Label>
                      <Input
                        id="register-name"
                        placeholder="Seu nome"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-slate-300">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-cpf" className="text-slate-300">CPF</Label>
                      <Input
                        id="register-cpf"
                        placeholder="000.000.000-00"
                        value={registerData.cpf}
                        onChange={(e) => setRegisterData({ ...registerData, cpf: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-slate-300">Senha</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {loading ? "Criando conta..." : "Criar Conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
