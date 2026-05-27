import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2, Trophy, Medal, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchApi } from "../../services/api";
import { toast } from "sonner";

interface RankingItem {
  id: number;
  nome: string;
  xpTotal: number;
  nivel: number;
  totalResgates: number;
  saldo: number;
}

export function Leaderboard() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchApi("/gamificacao/leaderboard")
      .then((data) => {
        setRanking(data || []);
        const userPos = data?.findIndex((item: RankingItem) => item.id === parseInt(user?.id || "0")) ?? -1;
        if (userPos >= 0) {
          setUserRank(userPos + 1);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar ranking:", err);
        toast.error("Erro ao carregar ranking");
        setRanking([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const getMedalIcon = (posicao: number) => {
    if (posicao === 1) return "🥇";
    if (posicao === 2) return "🥈";
    if (posicao === 3) return "🥉";
    return null;
  };

  const getNivelColor = (nivel: number) => {
    if (nivel <= 2) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
    if (nivel <= 5) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
    if (nivel <= 10) return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
    return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
            <Trophy className="w-7 h-7 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">Leaderboard</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Descubra os melhores alunos</p>
          </div>
        </motion.div>

        {/* Posição do Usuário */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-2 border-purple-300 dark:border-purple-900/50 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Sua Posição</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-purple-600">#{userRank}</span>
                      <span className="text-lg text-gray-600 dark:text-gray-400 font-bold">no ranking</span>
                    </div>
                  </div>
                  <Flame className="w-16 h-16 text-purple-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Ranking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
              <CardTitle className="text-2xl font-black">Top 50 Alunos</CardTitle>
              <CardDescription>Classificados por XP e Saldo</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  <AnimatePresence>
                    {ranking.map((item, idx) => {
                      const posicao = idx + 1;
                      const isCurrent = item.id === parseInt(user?.id || "0");
                      const medal = getMedalIcon(posicao);

                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.02 }}
                          className={`p-6 transition-all ${
                            isCurrent
                              ? "bg-purple-50 dark:bg-purple-900/10 border-l-4 border-l-purple-600"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-center gap-6">
                            {/* Posição */}
                            <div className="flex items-center justify-center w-12 h-12 rounded-full font-black text-lg shrink-0">
                              {medal ? (
                                <span className="text-2xl">{medal}</span>
                              ) : (
                                <span className="text-gray-600 dark:text-gray-400">#{posicao}</span>
                              )}
                            </div>

                            {/* Info do Aluno */}
                            <div className="flex-1 min-w-0">
                              <p className={`font-black truncate ${isCurrent ? "text-purple-600" : "text-gray-900 dark:text-white"}`}>
                                {item.nome}
                                {isCurrent && " (você)"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${getNivelColor(item.nivel)}`}>
                                  Nível {item.nivel}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.totalResgates} resgates
                                </span>
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="text-right shrink-0">
                              <p className="font-black text-lg text-purple-600">{item.xpTotal}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">XP</p>
                            </div>

                            <div className="text-right shrink-0 border-l border-gray-200 dark:border-gray-800 pl-6">
                              <p className="font-black text-lg text-green-600">{item.saldo.toFixed(0)}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Saldo</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
