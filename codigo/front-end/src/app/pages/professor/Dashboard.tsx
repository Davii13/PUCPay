import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import {
  Coins,
  Send,
  TrendingUp,
  ArrowUpRight,
  Users,
  Calendar,
  Sparkles,
  Search,
  History,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  Plus,
  Loader2,
  BarChart3,
  Award,
  Zap,
  AlertCircle,
  X,
  Star,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { toast } from "sonner";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, LineChart, Line, BarChart, Bar } from "recharts";
import { fetchApi } from "../../services/api";
import { sendStudentCoinsEmail } from "../../services/emailService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function ProfessorDashboard() {
  const { user, updateLocalBalance } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [sentTransactions, setSentTransactions] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any>(null);
  const [showStudentAnalysis, setShowStudentAnalysis] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      Promise.all([
        fetchApi(`/transacoes/professor/${user.id}`),
        fetchApi("/alunos")
      ])
      .then(([txs, stds]) => {
        setSentTransactions(txs);
        setStudents(stds);
      })
      .catch((err) => {
        console.error("Erro ao carregar dashboard:", err);
        toast.error("Erro ao carregar dados do dashboard");
      })
      .finally(() => setLoading(false));
    }
  }, [user]);

  const distributionData = [
    { name: "Seg", distributed: 120 },
    { name: "Ter", distributed: 450 },
    { name: "Qua", distributed: 300 },
    { name: "Qui", distributed: 680 },
    { name: "Sex", distributed: 520 },
    { name: "Sáb", distributed: 100 },
    { name: "Dom", distributed: 40 },
  ];

  const handleSendCoins = async () => {
    if (!selectedStudent || !amount || !message) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    const student = students.find((s) => s.id.toString() === selectedStudent);
    if (!student) return;

    if (parseFloat(amount) > (user?.balance || 0)) {
      toast.error("Você não possui saldo suficiente para esta premiação");
      return;
    }

    try {
      setIsSending(true);
      const transaction = await fetchApi("/transacoes/enviar", {
        method: "POST",
        body: JSON.stringify({
          professorId: user?.id,
          alunoId: student.id,
          valor: parseFloat(amount),
          mensagem: message
        })
      });

      setSentTransactions([transaction, ...sentTransactions]);
      if (updateLocalBalance) {
        updateLocalBalance((user?.balance || 0) - parseFloat(amount));
      }

      sendStudentCoinsEmail({
        studentName: student.nome,
        studentEmail: student.email,
        professorName: user?.name || user?.nome || "Professor",
        amount: parseFloat(amount),
        message: message
      }).catch(console.error);

      toast.success(`Premiação de ${amount} moedas enviada para ${student.nome}! ✨`);

      setSelectedStudent("");
      setAmount("");
      setMessage("");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar envio");
    } finally {
      setIsSending(false);
    }
  };

  // Calcular estatísticas de alunos
  const studentStats = students.map(student => {
    const studentTransactions = sentTransactions.filter((t: any) => t.destinatario?.id === student.id);
    const totalReceived = studentTransactions.reduce((sum: number, t: any) => sum + (t.valor || 0), 0);
    const lastReward = studentTransactions.length > 0 ? new Date(studentTransactions[0].dataHora) : null;
    const daysSinceReward = lastReward ? Math.floor((new Date().getTime() - lastReward.getTime()) / (1000 * 60 * 60 * 24)) : null;

    return {
      ...student,
      totalCoinsReceived: totalReceived,
      rewardCount: studentTransactions.length,
      daysSinceReward,
      trend: Math.floor(Math.random() * 30) + 5,
      progressionData: [
        { week: "Sem 1", coins: totalReceived * 0.2 },
        { week: "Sem 2", coins: totalReceived * 0.35 },
        { week: "Sem 3", coins: totalReceived * 0.6 },
        { week: "Sem 4", coins: totalReceived }
      ]
    };
  });

  // Recomendador inteligente
  const recommendations = studentStats
    .filter(s => !s.daysSinceReward || s.daysSinceReward > 7)
    .sort((a, b) => {
      if (!a.daysSinceReward) return -1;
      return b.daysSinceReward - a.daysSinceReward;
    })
    .slice(0, 3)
    .map(student => {
      let reason = "";
      if (!student.daysSinceReward) {
        reason = "Nunca recebeu uma premiação";
      } else if (student.daysSinceReward > 30) {
        reason = `${student.daysSinceReward} dias sem receber moedas`;
      } else {
        reason = `${student.daysSinceReward} dias sem reconhecimento`;
      }
      return { student, reason };
    });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                Painel do <span className="text-purple-600">Professor</span>
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium ml-1">
              Reconheça o mérito acadêmico distribuindo incentivos para seus alunos.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-xl shadow-purple-100 dark:shadow-none transition-all active:scale-95 group">
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                Premiar Aluno
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-8 border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white">Premiar Estudante</DialogTitle>
                <DialogDescription className="text-gray-500 font-medium">
                  Selecione o aluno e defina a quantidade de moedas baseada no mérito.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Selecionar Aluno</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="h-14 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                      <SelectValue placeholder="Busque por nome ou curso..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-gray-100 shadow-2xl">
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()} className="h-12">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} />
                              <AvatarFallback>{student.nome[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold">{student.nome}</span>
                            <span className="text-xs text-gray-400 font-medium">({student.curso})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Quantidade de PUCCoins</Label>
                  <div className="relative">
                    <Coins className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500" />
                    <Input
                      type="number"
                      placeholder="Ex: 50"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="h-14 pl-12 rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 font-black text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Mensagem de Reconhecimento</Label>
                  <Textarea
                    placeholder="Parabéns pela excelente participação em aula!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px] rounded-xl border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50 resize-none"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className="rounded-xl h-12 px-6 text-gray-500 font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendCoins}
                  disabled={isSending}
                  className="flex-1 rounded-xl h-12 bg-purple-600 hover:bg-purple-700 text-white font-black shadow-lg"
                >
                  {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirmar Envio"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none shadow-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Coins className="w-32 h-32" />
              </div>
              <CardContent className="pt-8 pb-8">
                <p className="text-purple-100 text-xs font-black uppercase tracking-widest mb-2 opacity-80">Saldo para Distribuição</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl font-black tabular-nums">{user?.balance}</h2>
                  <span className="text-purple-200 font-bold">PUCCoins</span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  Renovação mensal automática
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-xl bg-white dark:bg-gray-900 overflow-hidden h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-emerald-500" />
                      Engajamento dos Alunos
                    </CardTitle>
                    <CardDescription className="text-xs">Moedas distribuídas nos últimos 7 dias</CardDescription>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900 dark:text-white">1,240</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">+12.5% vs semana anterior</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-40 p-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={distributionData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorDist" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="distributed" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorDist)" />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* History List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <History className="w-6 h-6 text-purple-600" />
                Histórico de Premiações
              </h2>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {loading ? (
                  [1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-[2rem]" />)
                ) : sentTransactions.length === 0 ? (
                  <Card className="border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2.5rem] py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold">Nenhum envio realizado</h3>
                    <p className="text-gray-500">Comece a premiar seus alunos clicando no botão acima.</p>
                  </Card>
                ) : (
                  sentTransactions.map((tx, idx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group p-6 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple-200 hover:shadow-xl transition-all"
                    >
                      <div className="flex items-start gap-6">
                        <Avatar className="w-14 h-14 rounded-2xl border-2 border-purple-50">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${tx.destinatario?.email}`} />
                          <AvatarFallback className="font-black bg-purple-50 text-purple-600">{tx.destinatario?.nome[0]}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                              Recompensa para {tx.destinatario?.nome}
                            </h4>
                            <span className="text-2xl font-black text-emerald-600">-{tx.valor}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {format(new Date(tx.dataHora), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5" />
                              {tx.destinatario?.curso}
                            </div>
                          </div>
                          <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex items-start gap-3 border border-gray-100 dark:border-gray-800">
                            <MessageSquare className="w-4 h-4 text-purple-400 mt-1" />
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                              "{tx.mensagem}"
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar - Recommendations & Students */}
          <div className="space-y-6">
            {/* Smart Recommendations */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-500" />
                Recomendações
              </h2>

              <AnimatePresence>
                {recommendations.length > 0 && recommendations.map((rec, idx) => (
                  <motion.div
                    key={rec.student.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3 mb-3">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-amber-900 dark:text-amber-100">{rec.reason}</p>
                            <p className="text-xs text-amber-700/70 dark:text-amber-200/70 mt-1">{rec.student.nome}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-9 text-xs"
                          onClick={() => {
                            setSelectedStudent(rec.student.id.toString());
                            setOpen(true);
                          }}
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Premiar Agora
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* TOP Students */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <Award className="w-5 h-5 text-purple-600" />
                Alunos Destaque
              </h2>

              <Card className="border-none shadow-xl bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-6 space-y-3">
                  {studentStats
                    .sort((a, b) => b.totalCoinsReceived - a.totalCoinsReceived)
                    .slice(0, 5)
                    .map((student, idx) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => {
                          setSelectedStudentDetail(student);
                          setShowStudentAnalysis(true);
                        }}
                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group cursor-pointer"
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs flex-shrink-0">
                          {idx + 1}
                        </div>
                        <Avatar className="w-10 h-10 border-2 border-transparent group-hover:border-purple-200 transition-all flex-shrink-0">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.email}`} />
                          <AvatarFallback>{student.nome[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{student.nome}</p>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{student.totalCoinsReceived} moedas</p>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs flex-shrink-0">
                          <TrendingUp className="w-3 h-3" />
                          {student.trend}%
                        </div>
                      </motion.div>
                    ))}
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-xl bg-indigo-600 text-white rounded-[2.5rem] p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Meta de Distribuição</p>
              <h4 className="text-xl font-black mb-4">Recompense mais alunos para bater sua meta semanal!</h4>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mb-6">
                <div className="bg-white h-full w-[65%]" />
              </div>
              <Button className="w-full bg-white text-indigo-600 hover:bg-white/90 font-black rounded-xl h-12">
                Ver Detalhes
              </Button>
            </Card>
          </div>
        </div>

        {/* Student Analysis Modal */}
        <AnimatePresence>
          {showStudentAnalysis && selectedStudentDetail && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowStudentAnalysis(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14 rounded-2xl">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedStudentDetail.email}`} />
                      <AvatarFallback>{selectedStudentDetail.nome[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">{selectedStudentDetail.nome}</h2>
                      <p className="text-sm text-gray-500">{selectedStudentDetail.curso}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl h-10 w-10"
                    onClick={() => setShowStudentAnalysis(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-8 space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        label: "Total Recebido",
                        value: selectedStudentDetail.totalCoinsReceived,
                        icon: Coins,
                        color: "bg-purple-50 text-purple-600"
                      },
                      {
                        label: "Premiações",
                        value: selectedStudentDetail.rewardCount,
                        icon: Award,
                        color: "bg-amber-50 text-amber-600"
                      },
                      {
                        label: "Última Premiação",
                        value: selectedStudentDetail.daysSinceReward ? `${selectedStudentDetail.daysSinceReward}d atrás` : "Nunca",
                        icon: Calendar,
                        color: "bg-blue-50 text-blue-600"
                      }
                    ].map((metric) => (
                      <div key={metric.label} className={`${metric.color} p-6 rounded-2xl`}>
                        <div className="flex items-center gap-2 mb-2">
                          <metric.icon className="w-5 h-5" />
                          <p className="text-xs font-black uppercase tracking-widest opacity-75">{metric.label}</p>
                        </div>
                        <p className="text-2xl font-black">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Progression Chart */}
                  <Card className="border-none shadow-lg rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-lg font-black flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                        Evolução Mensal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={selectedStudentDetail.progressionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="week" stroke="#9ca3af" />
                          <YAxis stroke="#9ca3af" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#1f2937",
                              border: "none",
                              borderRadius: "12px",
                              color: "#fff"
                            }}
                          />
                          <Bar dataKey="coins" fill="#9333ea" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Recent Transactions */}
                  <Card className="border-none shadow-lg rounded-[2rem]">
                    <CardHeader>
                      <CardTitle className="text-lg font-black flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-600" />
                        Histórico de Premiações
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {sentTransactions
                        .filter((t: any) => t.destinatario?.id === selectedStudentDetail.id)
                        .slice(0, 5)
                        .map((tx: any, idx: number) => (
                          <div key={tx.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-bold text-gray-900 dark:text-white">{tx.valor} moedas</p>
                              <p className="text-sm text-gray-500 italic mt-1">"{tx.mensagem}"</p>
                              <p className="text-xs text-gray-400 mt-2">{format(new Date(tx.dataHora), "dd 'de' MMM, HH:mm", { locale: ptBR })}</p>
                            </div>
                          </div>
                        ))}
                    </CardContent>
                  </Card>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl h-12"
                    onClick={() => {
                      setShowStudentAnalysis(false);
                      setSelectedStudent(selectedStudentDetail.id.toString());
                      setOpen(true);
                    }}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Premiar Este Aluno
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
