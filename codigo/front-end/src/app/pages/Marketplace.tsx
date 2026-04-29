import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { mockBenefits, Benefit } from "../data/mockData";
import { Search, Filter, Store, Check, Coins } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

export function Marketplace() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);

  const categories = Array.from(new Set(mockBenefits.map((b) => b.category)));

  const filteredBenefits = mockBenefits.filter((benefit) => {
    const matchesSearch =
      benefit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benefit.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? benefit.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const handleRedeem = () => {
    if (!selectedBenefit) return;

    if ((user?.balance || 0) < selectedBenefit.cost) {
      toast.error("Saldo insuficiente para este resgate");
      return;
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    toast.success(`Vantagem resgatada com sucesso! 🎉`);
    setShowRedeemDialog(false);
    setSelectedBenefit(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Store className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Marketplace
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Troque suas moedas por vantagens incríveis
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar vantagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className={
                selectedCategory === null
                  ? "bg-purple-600 hover:bg-purple-700"
                  : ""
              }
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-purple-600 hover:bg-purple-700"
                    : ""
                }
              >
                {category}
              </Button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {filteredBenefits.length} vantagens encontradas
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredBenefits.map((benefit, index) => {
                const canAfford = (user?.balance || 0) >= benefit.cost;

                return (
                  <motion.div
                    key={benefit.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="relative overflow-hidden">
                        <img
                          src={benefit.image}
                          alt={benefit.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white backdrop-blur-sm">
                            {benefit.category}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                            {benefit.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {benefit.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Store className="w-4 h-4" />
                          {benefit.company}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              {benefit.cost}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              moedas
                            </span>
                          </div>

                          <Button
                            size="sm"
                            disabled={!canAfford}
                            className={
                              canAfford
                                ? "bg-gradient-to-r from-purple-500 to-purple-700"
                                : ""
                            }
                            onClick={() => {
                              setSelectedBenefit(benefit);
                              setShowRedeemDialog(true);
                            }}
                          >
                            {canAfford ? "Resgatar" : "Saldo insuficiente"}
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
              className="text-center py-16"
            >
              <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Nenhuma vantagem encontrada
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar resgate</DialogTitle>
            <DialogDescription>
              Você está prestes a resgatar esta vantagem
            </DialogDescription>
          </DialogHeader>

          {selectedBenefit && (
            <div className="space-y-4">
              <img
                src={selectedBenefit.image}
                alt={selectedBenefit.title}
                className="w-full h-48 object-cover rounded-lg"
              />

              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                  {selectedBenefit.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedBenefit.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Custo
                </span>
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="font-bold text-lg text-gray-900 dark:text-white">
                    {selectedBenefit.cost} moedas
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Saldo após resgate
                </span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {(user?.balance || 0) - selectedBenefit.cost} moedas
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowRedeemDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-700"
                  onClick={handleRedeem}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Confirmar resgate
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
