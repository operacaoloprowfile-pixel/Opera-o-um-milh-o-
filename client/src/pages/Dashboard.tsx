import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Plus, TrendingUp, Wallet, PieChart, X, User } from "lucide-react";

interface FinancialInfo {
  balance: number;
  totalInvested: number;
  totalGain: number;
}

interface Investment {
  id: number;
  name: string;
  type: string;
  amountInvested: number;
  currentValue: number;
  profit: number;
  profitPercentage: string;
}

interface Transaction {
  id: number;
  type: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
}

export default function Dashboard({ token, onLogout, onViewProfile }: { token: string; onLogout: () => void; onViewProfile: () => void }) {
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [investmentData, setInvestmentData] = useState({ name: "", type: "", amount: "" });
  const [openDialog, setOpenDialog] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");
    if (savedUser) setUserData(JSON.parse(savedUser));
    loadData();
  }, []);
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load financial info
      const finResponse = await fetch("/api/trpc/financial.getInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const finData = await finResponse.json();
      const finResult = finData.result?.data?.json || finData.result?.data;
      if (finResult) {
        setFinancialInfo(finResult);
      }

      // Load investments
      const invResponse = await fetch("/api/trpc/investments.list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const invData = await invResponse.json();
      const invResult = invData.result?.data?.json || invData.result?.data;
      if (invResult) {
        setInvestments(invResult);
      }

      // Load transactions
      const txResponse = await fetch("/api/trpc/financial.getTransactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ json: { limit: 10 } }),
      });
      const txData = await txResponse.json();
      const txResult = txData.result?.data?.json || txData.result?.data;
      if (txResult) {
        setTransactions(txResult);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount) {
      toast.error("Digite um valor");
      return;
    }

    try {
      const response = await fetch("/api/trpc/financial.deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ json: { amount: parseFloat(depositAmount) } }),
      });

      const data = await response.json();
      const result = data.result?.data?.json || data.result?.data;
      if (result?.success) {
        toast.success("Depósito realizado!");
        setDepositAmount("");
        loadData();
      } else {
        toast.error(data.error?.json?.message || "Erro ao depositar");
      }
    } catch (error) {
      console.error("Deposit error:", error);
      toast.error("Erro na conexão");
    }
  };

  const handleBuyInvestment = async () => {
    if (!investmentData.name || !investmentData.type || !investmentData.amount) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("/api/trpc/investments.buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          json: {
            name: investmentData.name,
            type: investmentData.type,
            amount: parseFloat(investmentData.amount),
          },
        }),
      });

      const data = await response.json();
      const result = data.result?.data?.json || data.result?.data;
      if (result?.success) {
        toast.success("Investimento realizado!");
        setInvestmentData({ name: "", type: "", amount: "" });
        setOpenDialog(false);
        loadData();
      } else {
        toast.error(data.error?.json?.message || "Erro ao investir");
      }
    } catch (error) {
      console.error("Investment error:", error);
      toast.error("Erro na conexão");
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) {
      toast.error("Digite um valor");
      return;
    }

    try {
      const response = await fetch("/api/trpc/financial.withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ json: { amount: parseFloat(withdrawAmount) } }),
      });

      const data = await response.json();
      const result = data.result?.data?.json || data.result?.data;
      if (result?.success) {
        toast.success("Saque realizado!");
        setWithdrawAmount("");
        loadData();
      } else {
        toast.error(data.error?.json?.message || "Erro ao sacar");
      }
    } catch (error) {
      console.error("Withdraw error:", error);
      toast.error("Erro na conexão");
    }
  };

  const handleSellInvestment = async (investmentId: number, amount: number) => {
    try {
      const response = await fetch("/api/trpc/investments.sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          json: {
            investmentId,
            amount,
          },
        }),
      });

      const data = await response.json();
      const result = data.result?.data?.json || data.result?.data;
      if (result?.success) {
        toast.success("Resgate realizado!");
        loadData();
      } else {
        toast.error(data.error?.json?.message || "Erro ao resgatar");
      }
    } catch (error) {
      console.error("Sell error:", error);
      toast.error("Erro na conexão");
    }
  };

  const handleSimulateYield = async () => {
    try {
      const response = await fetch("/api/trpc/financial.simulateYield", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ json: {} }),
      });
      const data = await response.json();
      if (data.result?.data?.json?.success) {
        toast.success("Rendimentos processados!");
        loadData();
      }
    } catch (error) {
      toast.error("Erro ao simular rendimentos");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Carregando...</p>
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
            <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
            <span className="text-lg sm:text-2xl font-bold text-white">WealthChain</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={onViewProfile}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:text-white text-xs sm:text-sm"
            >
              <User className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Perfil</span>
            </Button>
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
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Financial Summary - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
                Saldo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-bold text-white">
                R$ {financialInfo?.balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                <PieChart className="w-3 h-3 sm:w-4 sm:h-4" />
                Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-3xl font-bold text-white">
                R$ {financialInfo?.totalInvested.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-xs sm:text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                Ganho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl sm:text-3xl font-bold ${financialInfo?.totalGain! >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                R$ {financialInfo?.totalGain.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section */}
        <Card className="bg-slate-800 border-emerald-500/30 border mb-6 sm:mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-500" />
              Programa de Afiliados (10% de Bônus)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <div className="flex-1 w-full p-2 bg-slate-900 rounded border border-slate-700 text-emerald-400 font-mono text-sm break-all">
                {window.location.origin}/?ref={userData?.referralCode || "..."}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/?ref=${userData?.referralCode}`);
                  toast.success("Link copiado!");
                }}
              >
                Copiar Link
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base text-white">Depósito / Saque</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="deposit-amount" className="text-xs sm:text-sm text-slate-300">Depósito (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="deposit-amount"
                      type="number"
                      placeholder="0.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Button
                      onClick={handleDeposit}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-4"
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="withdraw-amount" className="text-xs sm:text-sm text-slate-300">Saque (R$)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="withdraw-amount"
                      type="number"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Button
                      onClick={handleWithdraw}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-sm px-4"
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base text-white">Novo Investimento</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-16">
                    <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
                  </CardContent>
                </Card>
              </DialogTrigger>
              {/* ... dialog content ... */}
            </Dialog>
            <Button 
              variant="ghost" 
              className="text-slate-500 text-xs hover:text-emerald-500"
              onClick={handleSimulateYield}
            >
              Simular Rendimento Diário (Demo)
            </Button>
          </div>
            <DialogContent className="bg-slate-800 border-slate-700 max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-white">Novo Investimento</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Escolha um ativo e o valor que deseja investir
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="inv-name" className="text-xs sm:text-sm text-slate-300">Nome do Ativo</Label>
                  <Input
                    id="inv-name"
                    placeholder="Ex: PETR4"
                    value={investmentData.name}
                    onChange={(e) => setInvestmentData({ ...investmentData, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="inv-type" className="text-xs sm:text-sm text-slate-300">Tipo</Label>
                  <Input
                    id="inv-type"
                    placeholder="Ex: Ações"
                    value={investmentData.type}
                    onChange={(e) => setInvestmentData({ ...investmentData, type: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="inv-amount" className="text-xs sm:text-sm text-slate-300">Valor (R$)</Label>
                  <Input
                    id="inv-amount"
                    type="number"
                    placeholder="0.00"
                    value={investmentData.amount}
                    onChange={(e) => setInvestmentData({ ...investmentData, amount: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white text-sm"
                  />
                </div>
                <Button
                  onClick={handleBuyInvestment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-2"
                >
                  Investir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Investments List - Mobile Optimized */}
        <Card className="bg-slate-800 border-slate-700 mb-6 sm:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base text-white">Meus Investimentos</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-slate-400">
              {investments.length} ativo(s) no portfólio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <p className="text-slate-400 text-center py-6 sm:py-8 text-sm">Nenhum investimento ainda</p>
            ) : (
              <div className="space-y-2 sm:space-y-4">
                {investments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 sm:p-4 bg-slate-700 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white text-sm sm:text-base truncate">{inv.name}</h4>
                      <p className="text-xs sm:text-sm text-slate-400">{inv.type}</p>
                    </div>
                    <div className="text-right ml-2 flex flex-col items-end gap-1">
                      <div>
                        <p className="text-white font-semibold text-sm sm:text-base">R$ {inv.currentValue.toFixed(2)}</p>
                        <p className={`text-xs sm:text-sm ${inv.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {inv.profit >= 0 ? "+" : ""}{inv.profit.toFixed(2)}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 text-xs text-slate-400 hover:text-red-400"
                        onClick={() => handleSellInvestment(inv.id, inv.currentValue)}
                      >
                        Resgatar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions - Mobile Optimized */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm sm:text-base text-white">Histórico</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-center py-6 sm:py-8 text-sm">Nenhuma transação</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2 sm:p-3 bg-slate-700 rounded text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-medium truncate text-xs sm:text-sm">{tx.description}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <p className={`font-semibold ml-2 text-xs sm:text-sm whitespace-nowrap ${tx.type.includes("deposit") || tx.type.includes("sell") ? "text-emerald-400" : "text-red-400"}`}>
                      {tx.type.includes("deposit") || tx.type.includes("sell") ? "+" : "-"}R$ {tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
