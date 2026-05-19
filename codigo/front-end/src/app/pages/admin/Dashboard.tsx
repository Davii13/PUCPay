import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Coins, Send, Users } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { toast } from "sonner";
import { fetchApi } from "../../services/api";
import { sendProfessorCoinsEmail } from "../../services/emailService";

export function AdminDashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [amount, setAmount] = useState("");
  const [professors, setProfessors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApi("/admin/professores").then(setProfessors).catch(console.error);
  }, []);

  const handleSendCoins = async () => {
    if (!selectedProfessor || !amount) {
      toast.error("Preencha todos os campos");
      return;
    }

    const professor = professors.find((p) => p.id.toString() === selectedProfessor);
    if (!professor) return;

    try {
      setLoading(true);
      await fetchApi("/admin/creditar", {
        method: "POST",
        body: JSON.stringify({
          professorId: professor.id,
          valor: parseFloat(amount)
        })
      });

      sendProfessorCoinsEmail({
        professorName: professor.nome,
        professorEmail: professor.email,
        amount: parseFloat(amount)
      }).catch(console.error);

      toast.success(`${amount} moedas creditadas para o professor ${professor.nome}!`);

      // Update local state to reflect the balance change immediately
      setProfessors(professors.map(p => 
        p.id === professor.id ? { ...p, saldo: (p.saldo || 0) + parseFloat(amount) } : p
      ));

      setSelectedProfessor("");
      setAmount("");
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Erro ao creditar moedas");
    } finally {
      setLoading(false);
    }
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
              Painel do Administrador
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Controle o sistema e gerencie o saldo dos professores
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800">
                <Coins className="w-4 h-4 mr-2" />
                Creditar Moedas
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Creditar moedas para professor</DialogTitle>
                <DialogDescription>
                  Adicione fundos para os professores distribuírem
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="professor">Selecione o professor</Label>
                  <Select value={selectedProfessor} onValueChange={setSelectedProfessor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um professor" />
                    </SelectTrigger>
                    <SelectContent>
                      {professors.map((professor) => (
                        <SelectItem key={professor.id} value={professor.id.toString()}>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${professor.nome}`} />
                              <AvatarFallback>{professor.nome.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{professor.nome}</p>
                              <p className="text-xs text-gray-500">{professor.departamento}</p>
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
                    placeholder="Ex: 500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                  />
                </div>

                <Button
                  onClick={handleSendCoins}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Creditar moedas
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-500 to-blue-700 border-none text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-100">Professores Cadastrados</p>
                  <Users className="w-6 h-6 text-blue-200" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold">{professors.length}</h2>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Professores da Instituição</CardTitle>
              <CardDescription>Saldos atuais e informações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {professors.map((professor) => (
                <motion.div
                  key={professor.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <Avatar className="w-10 h-10 border shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${professor.nome}`} />
                    <AvatarFallback>{professor.nome.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {professor.nome}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {professor.departamento} | {professor.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {professor.saldo} moedas
                    </p>
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
