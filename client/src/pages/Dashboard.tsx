import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { LogOut, Plus, TrendingUp, Wallet, PieChart } from "lucide-react";

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

export default function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [financialInfo, setFinancialInfo] = useState<FinancialInfo | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [investmentData, setInvestmentData] = useState({ name: "", type: "", amount: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load financial info
      const finResponse = await fetch("/api/trpc/financial.getInfo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const finData = await finResponse.json();
      if (finData.result?.data) {
        setFinancialInfo(finData.result.data);
      }

      // Load investments
      const invResponse = await fetch("/api/trpc/investments.list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const invData = await invResponse.json();
      if (invData.result?.data) {
        setInvestments(invData.result.data);
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
      if (txData.result?.data) {
        setTransactions(txData.result.data);
      }
    } catch (error) {
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
      if (data.result?.data?.success) {
        toast.success("Depósito realizado!");
        setDepositAmount("");
        loadData();
      } else {
        toast.error(data.result?.error?.message || "Erro ao depositar");
      }
    } catch (error) {
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
      if (data.result?.data?.success) {
        toast.success("Investimento realizado!");
        setInvestmentData({ name: "", type: "", amount: "" });
        loadData();
      } else {
        toast.error(data.result?.error?.message || "Erro ao investir");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-emerald-500" />
            <span className="text-2xl font-bold text-white">WealthChain</span>
          </div>
          <Button
            onClick={() => {
              localStorage.removeItem("authToken");
              onLogout();
            }}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Financial Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Saldo Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                R$ {financialInfo?.balance.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Total Investido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                R$ {financialInfo?.totalInvested.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-slate-300 text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Ganho Acumulado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${financialInfo?.totalGain! >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                R$ {financialInfo?.totalGain.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Fazer Depósito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount" className="text-slate-300">Valor (R$)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button
                onClick={handleDeposit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Depositar
              </Button>
            </CardContent>
          </Card>

          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-slate-800 border-slate-700 cursor-pointer hover:border-slate-600 transition">
                <CardHeader>
                  <CardTitle className="text-white">Novo Investimento</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-24">
                  <Plus className="w-8 h-8 text-emerald-500" />
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Novo Investimento</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Escolha um ativo e o valor que deseja investir
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inv-name" className="text-slate-300">Nome do Ativo</Label>
                  <Input
                    id="inv-name"
                    placeholder="Ex: PETR4"
                    value={investmentData.name}
                    onChange={(e) => setInvestmentData({ ...investmentData, name: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-type" className="text-slate-300">Tipo</Label>
                  <Input
                    id="inv-type"
                    placeholder="Ex: Ações"
                    value={investmentData.type}
                    onChange={(e) => setInvestmentData({ ...investmentData, type: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inv-amount" className="text-slate-300">Valor (R$)</Label>
                  <Input
                    id="inv-amount"
                    type="number"
                    placeholder="0.00"
                    value={investmentData.amount}
                    onChange={(e) => setInvestmentData({ ...investmentData, amount: e.target.value })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <Button
                  onClick={handleBuyInvestment}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Investir
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Investments List */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white">Meus Investimentos</CardTitle>
            <CardDescription className="text-slate-400">
              {investments.length} ativo(s) no portfólio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {investments.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhum investimento ainda</p>
            ) : (
              <div className="space-y-4">
                {investments.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-white">{inv.name}</h4>
                      <p className="text-sm text-slate-400">{inv.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">R$ {inv.currentValue.toFixed(2)}</p>
                      <p className={`text-sm ${inv.profit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {inv.profit >= 0 ? "+" : ""}{inv.profit.toFixed(2)} ({inv.profitPercentage}%)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transactions */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-slate-400 text-center py-8">Nenhuma transação</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                    <div>
                      <p className="text-white font-medium">{tx.description}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <p className={`font-semibold ${tx.type.includes("deposit") || tx.type.includes("sell") ? "text-emerald-400" : "text-red-400"}`}>
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
