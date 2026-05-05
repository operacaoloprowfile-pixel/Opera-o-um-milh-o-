import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Target, Eye, Heart, TrendingUp, Shield, Users } from "lucide-react";

export default function About({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <span className="text-lg sm:text-xl font-bold text-white">Sobre WealthChain</span>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">Sobre a WealthChain</h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl">
            Somos uma fintech inovadora dedicada a democratizar o acesso a investimentos seguros e rentáveis para todos os brasileiros.
          </p>
        </div>

        {/* History Section */}
        <div className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Nossa História</h2>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Fundada em 2022, a WealthChain nasceu da visão de três empreendedores que acreditavam que investir não deveria ser privilégio de poucos. Após anos trabalhando no mercado financeiro tradicional, percebemos uma lacuna: faltava uma plataforma que fosse segura, acessível e intuitiva para o investidor brasileiro.
              </p>
              <p className="text-slate-300 mb-4 leading-relaxed">
                Hoje, contamos com mais de 50 mil usuários ativos e gerenciamos bilhões em ativos. Nossa missão é simples: transformar a forma como os brasileiros investem.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Com uma equipe de especialistas em tecnologia, finanças e segurança, desenvolvemos a plataforma mais avançada do mercado, utilizando as melhores práticas de criptografia e proteção de dados.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663629959576/EVmmsYdbTgRfDEzNfksPp6/wealthchain-office-Qu69A9tmsK5oSC3oMmrnjV.webp"
                alt="Escritório WealthChain"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 sm:mb-16">
          {/* Missão */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-6 h-6 text-emerald-500" />
                <CardTitle className="text-white">Missão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Democratizar o acesso a investimentos seguros e rentáveis, capacitando cada brasileiro a construir seu patrimônio com confiança e inteligência.
              </p>
            </CardContent>
          </Card>

          {/* Visão */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-6 h-6 text-emerald-500" />
                <CardTitle className="text-white">Visão</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Ser a plataforma de investimentos mais confiável e inovadora da América Latina, transformando a vida financeira de milhões de pessoas.
              </p>
            </CardContent>
          </Card>

          {/* Valores */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-6 h-6 text-emerald-500" />
                <CardTitle className="text-white">Valores</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">
                Transparência, Segurança, Inovação e Integridade. Esses são os pilares que guiam cada decisão que tomamos.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Por que investir conosco */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Por que Investir Conosco?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Segurança */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-6 h-6 text-emerald-500" />
                  <CardTitle className="text-white">Segurança Máxima</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-300">
                  ✓ Criptografia de ponta a ponta
                </p>
                <p className="text-slate-300">
                  ✓ Certificação ISO 27001
                </p>
                <p className="text-slate-300">
                  ✓ Autenticação de dois fatores
                </p>
                <p className="text-slate-300">
                  ✓ Conformidade com LGPD
                </p>
              </CardContent>
            </Card>

            {/* Rentabilidade */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                  <CardTitle className="text-white">Rentabilidade Comprovada</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-300">
                  ✓ Retorno médio de 18% ao ano
                </p>
                <p className="text-slate-300">
                  ✓ Diversificação de portfólio
                </p>
                <p className="text-slate-300">
                  ✓ Análise técnica em tempo real
                </p>
                <p className="text-slate-300">
                  ✓ Sem taxas ocultas
                </p>
              </CardContent>
            </Card>

            {/* Equipe */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-6 h-6 text-emerald-500" />
                  <CardTitle className="text-white">Equipe Experiente</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-300">
                  ✓ 50+ profissionais especializados
                </p>
                <p className="text-slate-300">
                  ✓ Experiência de 200+ anos combinados
                </p>
                <p className="text-slate-300">
                  ✓ Certificações internacionais
                </p>
                <p className="text-slate-300">
                  ✓ Suporte 24/7
                </p>
              </CardContent>
            </Card>

            {/* Tecnologia */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                  <CardTitle className="text-white">Tecnologia Avançada</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-slate-300">
                  ✓ IA e Machine Learning
                </p>
                <p className="text-slate-300">
                  ✓ Análise preditiva
                </p>
                <p className="text-slate-300">
                  ✓ API integrada com mercado
                </p>
                <p className="text-slate-300">
                  ✓ Atualizações em tempo real
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Equipe */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">Nossa Equipe</h2>
          <div className="rounded-lg overflow-hidden shadow-2xl mb-8">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663629959576/EVmmsYdbTgRfDEzNfksPp6/wealthchain-team-hKAELzmxqC5KZtkgPdSBCg.webp"
              alt="Equipe WealthChain"
              className="w-full h-96 object-cover"
            />
          </div>
          <p className="text-slate-300 text-lg">
            Nosso time é composto por profissionais apaixonados por finanças e tecnologia, com histórico de sucesso em instituições financeiras de renome. Cada membro traz expertise única para criar a melhor experiência de investimento.
          </p>
        </div>

        {/* Números */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 sm:mb-16">
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-500 mb-2">50K+</p>
              <p className="text-slate-300">Usuários Ativos</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-500 mb-2">R$ 2B+</p>
              <p className="text-slate-300">Ativos Gerenciados</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-500 mb-2">18%</p>
              <p className="text-slate-300">Retorno Médio</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700 text-center">
            <CardContent className="pt-6">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-500 mb-2">99.9%</p>
              <p className="text-slate-300">Uptime</p>
            </CardContent>
          </Card>
        </div>

        {/* Contato */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Entre em Contato</h2>
          <p className="text-slate-300 mb-6">
            Tem dúvidas? Nossa equipe está pronta para ajudar!
          </p>
          <div className="space-y-2 mb-6">
            <p className="text-slate-300">
              <strong>Email:</strong> contato@wealthchain.com.br
            </p>
            <p className="text-slate-300">
              <strong>Telefone:</strong> +55 (11) 3000-0000
            </p>
            <p className="text-slate-300">
              <strong>Endereço:</strong> Av. Paulista, 1000 - São Paulo, SP
            </p>
          </div>
          <Button
            onClick={() => window.location.href = "mailto:contato@wealthchain.com.br"}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Enviar Email
          </Button>
        </div>
      </div>
    </div>
  );
}
