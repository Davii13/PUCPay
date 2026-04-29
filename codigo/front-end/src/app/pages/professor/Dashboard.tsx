import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Coins, Send, TrendingDown, ArrowUpRight, Users, Calendar } from "lucide-react";
import { mockStudents, Transaction } from "../../data/mockData";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ProfessorDashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [sentTransactions, setSentTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "send",
      amount: -100,
      description: "Participação em projeto de pesquisa",
      date: new Date(2026, 3, 28),
      to: "Maria Silva",
      message: "Excelente trabalho no projeto de IA!",
    },
    {
      id: "2",
      type: "send",
      amount: -75,
      description: "Monitoria de Programação",
      date: new Date(2026, 3, 25),
      to: "Pedro Santos",
      message: "Continue com o bom trabalho!",
    },
  ]);

  const distributionData = [
    { month: "Jan", distributed: 450 },
    { month: "Fev", distributed: 680 },
    { month: "Mar", distributed: 520 },
    { month: "Abr", distributed: 175 },
  ];

  const thisMonthDistributed = distributionData[3].distributed;

  const handleSendCoins = () => {
    if (!selectedStudent || !amount || !message) {
      toast.error("Preencha todos os campos");
      return;
    }

    const student = mockStudents.find((s) => s.id === selectedStudent);
    if (!student) return;

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: "send",
      amount: -parseInt(amount),
      description: message,
      date: new Date(),
      to: student.name,
      message: message,
    };

    setSentTransactions([newTransaction, ...sentTransactions]);
    toast.success(`${amount} moedas enviadas para ${student.name}!`);

    setSelectedStudent("");
    setAmount("");
    setMessage("");
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Painel do Professor
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie e distribua moedas para seus alunos
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
                <Send className="w-4 h-4 mr-2" />
                Enviar moedas
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Enviar moedas para aluno</DialogTitle>
                <DialogDescription>
                  Reconheça o esforço dos seus alunos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Selecione o aluno</Label>
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um aluno" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{student.name}</p>
                              <p className="text-xs text-gray-500">{student.course}</p>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Quantidade de moedas</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ex: 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max={user?.balance}
                  />
                  <p className="text-xs text-gray-500">
                    Saldo disponível: {user?.balance} moedas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem (obrigatória)</Label>
                  <Textarea
                    id="message"
                    placeholder="Ex: Excelente participação no projeto..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSendCoins}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar moedas
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-500 to-purple-700 border-none text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-purple-100">Saldo disponível</p>
                  <Coins className="w-6 h-6 text-purple-200" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold">{user?.balance}</h2>
                  <span className="text-lg">moedas</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-400">Distribuído este mês</p>
                  <TrendingDown className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {thisMonthDistributed}
                  </h2>
                  <span className="text-lg text-gray-600 dark:text-gray-400">moedas</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-400">Alunos beneficiados</p>
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {sentTransactions.length}
                  </h2>
                  <span className="text-lg text-gray-600 dark:text-gray-400">alunos</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Distribuição mensal</CardTitle>
              <CardDescription>Moedas distribuídas por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "none",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Bar dataKey="distributed" fill="#9333ea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Histórico de envios</CardTitle>
              <CardDescription>Suas transações recentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sentTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                    <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {transaction.to}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.description}
                        </p>
                      </div>
                      <p className="font-semibold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                        {transaction.amount} moedas
                      </p>
                    </div>
                    {transaction.message && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-2">
                        "{transaction.message}"
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {transaction.date.toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
