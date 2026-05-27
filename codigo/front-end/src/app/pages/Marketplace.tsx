import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { 
  Search, 
  Store, 
  Check, 
  Coins, 
  Tag, 
  Clock, 
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Info,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { fetchApi } from "../services/api";
import { sendBenefitPurchaseEmail } from "../services/emailService";

const CATEGORIES = [
  { id: "all", label: "Todos", icon: ShoppingBag },
  { id: "food", label: "Alimentação", icon: Tag },
  { id: "tech", label: "Tecnologia", icon: Tag },
  { id: "education", label: "Educação", icon: Tag },
  { id: "leisure", label: "Lazer", icon: Tag },
];

export function Marketplace() {
  const { user, updateLocalBalance } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [benefits, setBenefits] = useState<any[]>([]);
  const [selectedBenefit, setSelectedBenefit] = useState<any>(null);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchApi("/vantagens")
      .then(setBenefits)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredBenefits = benefits.filter((benefit) => {
    const matchesSearch =
      benefit.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.empresa?.nome.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Simplificando: como o banco não tem categoria ainda, filtramos apenas por busca
    // Mas deixamos a UI preparada para categorias futuras
    return matchesSearch;
  });

  const handleRedeem = async () => {
    if (!selectedBenefit) return;

    if ((user?.balance || 0) < selectedBenefit.custo) {
      toast.error("Saldo insuficiente para este resgate");
      return;
    }

    setIsRedeeming(true);
    try {
      const res = await fetchApi("/transacoes/resgatar", {
        method: "POST",
        body: JSON.stringify({
          alunoId: user?.id,
          vantagemId: selectedBenefit.id
        })
      });

      if (selectedBenefit.empresa) {
        sendBenefitPurchaseEmail({
          companyName: selectedBenefit.empresa.nome,
          companyEmail: selectedBenefit.empresa.email,
          studentName: user?.name || user?.nome || "Estudante",
          studentEmail: user?.email || "",
          benefitTitle: selectedBenefit.titulo,
          cost: selectedBenefit.custo,
          couponCode: res?.codigoCupom,
        }).catch((err) => {
          console.error("Erro ao enviar email:", err);
          toast.warning("Vantagem resgatada, mas erro ao notificar empresa");
        });
      }

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#9333ea", "#6366f1", "#f43f5e"]
      });

      toast.success(`Vantagem resgatada com sucesso! 🎉`);
      
      if (updateLocalBalance) {
        updateLocalBalance((user?.balance || 0) - selectedBenefit.custo);
      }

      setShowRedeemDialog(false);
      setSelectedBenefit(null);
    } catch (error: any) {
      toast.error(error.message || "Erro ao resgatar vantagem");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-purple-600 to-indigo-700 rounded-[2rem] p-8 md:p-12 text-white overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl -ml-20 -mb-20" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-lg">
              <Badge className="bg-white/20 text-white border-none backdrop-blur-md mb-4 px-4 py-1.5 text-sm font-semibold">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
                Vantagens Exclusivas
              </Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                Troque seu mérito por <span className="text-purple-200 underline decoration-yellow-400 underline-offset-8">experiências</span>
              </h1>
              <p className="text-purple-100 text-lg font-medium opacity-90">
                Explore centenas de benefícios oferecidos por empresas parceiras da PUC.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 flex flex-col items-center">
              <p className="text-xs uppercase font-bold tracking-widest text-purple-200 mb-2">Seu Saldo Atual</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
                  <Coins className="w-6 h-6 text-yellow-900" />
                </div>
                <span className="text-4xl font-black tabular-nums">{user?.balance}</span>
              </div>
              <p className="text-[10px] text-purple-200 mt-2 font-bold uppercase tracking-widest">PUCCoins Disponíveis</p>
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full lg:w-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                className={`rounded-2xl px-6 h-12 transition-all shrink-0 ${
                  selectedCategory === cat.id 
                    ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 dark:shadow-none" 
                    : "bg-white border-gray-200 dark:border-gray-800"
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="w-4 h-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>

          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Pesquisar por vantagem ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-white border-gray-200 dark:border-gray-800 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
            />
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Tag className="w-6 h-6 text-purple-600" />
              Todas as Vantagens
            </h2>
            <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredBenefits.length} disponíveis</span>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-[2rem]" />
              ))}
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredBenefits.map((benefit, index) => {
                    const canAfford = (user?.balance || 0) >= benefit.custo;

                    return (
                      <motion.div
                        key={benefit.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8 }}
                        layout
                      >
                        <Card className="group relative overflow-hidden rounded-[2rem] border-none bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col">
                          {/* Image Section */}
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={benefit.fotoUrl || `https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?q=80&w=400&auto=format&fit=crop`}
                              alt={benefit.titulo}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/90 text-purple-600 border-none backdrop-blur-md px-3 py-1 font-black shadow-lg">
                                {benefit.custo} PUCCoins
                              </Badge>
                            </div>
                            
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center gap-2 text-white/90 mb-1">
                                <Store className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold uppercase tracking-wider">{benefit.empresa?.nome || "Empresa Parceira"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <CardContent className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors">
                              {benefit.titulo}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 leading-relaxed">
                              {benefit.descricao}
                            </p>
                            
                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
                              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                Disponível
                              </div>
                              <Button
                                size="sm"
                                disabled={!canAfford}
                                onClick={() => {
                                  setSelectedBenefit(benefit);
                                  setShowRedeemDialog(true);
                                }}
                                className={`rounded-xl px-4 h-9 font-bold transition-all ${
                                  canAfford
                                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-100"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-100"
                                }`}
                              >
                                {canAfford ? (
                                  <>Resgatar <ChevronRight className="w-4 h-4 ml-1" /></>
                                ) : (
                                  "Saldo Insuficiente"
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {filteredBenefits.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 bg-white dark:bg-gray-900 rounded-[3rem] shadow-sm"
                >
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Nenhuma vantagem encontrada
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                    Não encontramos nada com esse nome. Tente pesquisar por termos como "alimentação", "curso" ou o nome de uma empresa.
                  </p>
                  <Button 
                    variant="outline" 
                    className="rounded-xl border-gray-200"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                    }}
                  >
                    Limpar todos os filtros
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Redemption Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <AnimatePresence>
            {selectedBenefit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col"
              >
                <div className="relative h-48">
                  <img
                    src={selectedBenefit.fotoUrl || "https://images.unsplash.com/photo-1513128034602-7814ccaddd4e?q=80&w=400&auto=format&fit=crop"}
                    alt={selectedBenefit.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Badge className="bg-yellow-400 text-yellow-950 border-none mb-2 font-black">
                      CONFIRMAÇÃO DE RESGATE
                    </Badge>
                    <h3 className="text-2xl font-bold text-white">
                      {selectedBenefit.titulo}
                    </h3>
                  </div>
                </div>

                <div className="p-8 space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex items-start gap-3 border border-gray-100 dark:border-gray-800">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Ao confirmar, o valor de <strong>{selectedBenefit.custo} moedas</strong> será debitado de sua conta permanentemente e um cupom será gerado.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Saldo atual</span>
                      <span className="font-bold text-gray-900 dark:text-white tabular-nums">{user?.balance} PUCCoins</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Custo do benefício</span>
                      <span className="font-bold text-rose-600 tabular-nums">-{selectedBenefit.custo} PUCCoins</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
                    <div className="flex items-center justify-between text-lg">
                      <span className="font-bold text-gray-900 dark:text-white">Saldo final</span>
                      <span className="font-black text-purple-600 tabular-nums">{(user?.balance || 0) - selectedBenefit.custo} PUCCoins</span>
                    </div>
                  </div>

                  <DialogFooter className="flex gap-3 sm:gap-0">
                    <Button
                      variant="ghost"
                      className="flex-1 h-12 rounded-2xl font-bold text-gray-500"
                      onClick={() => setShowRedeemDialog(false)}
                      disabled={isRedeeming}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1 h-12 rounded-2xl font-black bg-purple-600 hover:bg-purple-700 shadow-xl shadow-purple-100 dark:shadow-none"
                      onClick={handleRedeem}
                      disabled={isRedeeming}
                    >
                      {isRedeeming ? (
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>Confirmar Resgate <ArrowRight className="w-5 h-5 ml-2" /></>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
