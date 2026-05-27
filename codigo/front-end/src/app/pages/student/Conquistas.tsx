import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge, BadgeIcon } from "../../components/ui/badge";
import { Loader2, Trophy, Zap, Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { fetchApi } from "../../services/api";
import { toast } from "sonner";

interface BadgeData {
  id: number;
  badge: {
    id: number;
    nome: string;
    descricao: string;
    iconeUrl: string;
    tipo: string;
    xpRecompensa: number;
  };
  dataConquista: string;
}

interface Progresso {
  xpTotal: number;
  nivel: number;
  xpProximoNivel: number;
  totalResgates: number;
  totalMoedasRecebidas: number;
  ranking: number;
}

export function Conquistas() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [progresso, setProgresso] = useState<Progresso | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([
        fetchApi(`/gamificacao/aluno/${user.id}/badges`),
        fetchApi(`/gamificacao/aluno/${user.id}/progresso`)
      ])
        .then(([badgesData, progressoData]) => {
          setBadges(badgesData);
          setProgresso(progressoData);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Erro ao carregar conquistas");
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  const nivelColor = (nivel: number) => {
    if (nivel <= 2) return "from-blue-400 to-blue-600";
    if (nivel <= 5) return "from-purple-400 to-purple-600";
    if (nivel <= 10) return "from-orange-400 to-orange-600";
    return "from-red-400 to-red-600";
  };

  const nivelLabel = (nivel: number) => {
    if (nivel <= 2) return "Iniciante";
    if (nivel <= 5) return "Intermediário";
    if (nivel <= 10) return "Avançado";
    return "Lenda";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
      <div className="max-w-5xl mx-auto p-6 space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Trophy className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white">Conquistas</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Desbloqueie badges e suba de nível</p>
          </div>
        </motion.div>

        {/* Nível e Progresso */}
        {progresso && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-none shadow-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-black uppercase tracking-widest">Seu Nível</p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h2 className="text-6xl font-black">{progresso.nivel}</h2>
                      <span className="text-xl font-bold text-purple-200">{nivelLabel(progresso.nivel)}</span>
                    </div>
                  </div>
                  <Sparkles className="w-20 h-20 text-purple-200" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Progresso para Nível {progresso.nivel + 1}</span>
                    <span>{progresso.xpProximoNivel} XP</span>
                  </div>
                  <div className="w-full h-3 bg-purple-700/50 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, ((progresso.xpTotal % 100) / 100) * 100)}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full bg-yellow-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-400/30">
                  <div>
                    <p className="text-purple-100 text-xs font-black uppercase">XP Total</p>
                    <p className="text-2xl font-black">{progresso.xpTotal}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs font-black uppercase">Ranking</p>
                    <p className="text-2xl font-black">#{progresso.ranking}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-400/30">
                  <div>
                    <p className="text-purple-100 text-xs font-black uppercase">Resgates</p>
                    <p className="text-2xl font-black">{progresso.totalResgates}</p>
                  </div>
                  <div>
                    <p className="text-purple-100 text-xs font-black uppercase">Moedas Ganhas</p>
                    <p className="text-2xl font-black">{progresso.totalMoedasRecebidas.toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
            <CardHeader className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
              <CardTitle className="text-2xl font-black flex items-center gap-2">
                <Badge className="w-5 h-5 text-purple-600">
                  <BadgeIcon className="w-5 h-5" />
                </Badge>
                Seus Badges
              </CardTitle>
              <CardDescription>Você desbloqueou {badges.length} badge(s)</CardDescription>
            </CardHeader>

            <CardContent className="p-8">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : badges.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <Lock className="w-16 h-16 mx-auto text-gray-300" />
                  <p className="text-gray-500 font-medium">Nenhum badge desbloqueado ainda</p>
                  <p className="text-sm text-gray-400">Resgate vantagens e receba moedas para desbloquear badges!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {badges.map((badgeItem, idx) => (
                      <motion.div
                        key={badgeItem.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative"
                      >
                        <Card className="border-2 border-purple-200 dark:border-purple-900/30 bg-white dark:bg-gray-800 hover:shadow-lg transition-all cursor-pointer overflow-hidden">
                          <CardContent className="p-6 space-y-4">
                            <div className="text-5xl text-center">{badgeItem.badge.iconeUrl}</div>
                            <div className="text-center space-y-2">
                              <h3 className="font-black text-lg text-gray-900 dark:text-white">{badgeItem.badge.nome}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{badgeItem.badge.descricao}</p>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                              <span className="flex items-center gap-1 text-purple-600">
                                <Zap className="w-3 h-3" />
                                +{badgeItem.badge.xpRecompensa} XP
                              </span>
                              <span className="text-gray-400 text-[10px] uppercase tracking-widest">
                                {new Date(badgeItem.dataConquista).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
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
