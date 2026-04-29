import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Benefit } from "../../data/mockData";
import { Plus, Gift, Eye, Edit, Trash2, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Badge } from "../../components/ui/badge";

export function CompanyDashboard() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [benefits, setBenefits] = useState<Benefit[]>([
    {
      id: "1",
      title: "50% de desconto em produtos",
      description: "Válido para qualquer produto da loja durante o mês",
      image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400",
      cost: 200,
      company: user?.companyName || "Sua Empresa",
      category: "Desconto",
      available: true,
    },
  ]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    cost: "",
    category: "",
  });

  const [redemptions] = useState([
    { id: "1", benefit: "50% de desconto em produtos", student: "Maria Silva", date: new Date(2026, 3, 28) },
    { id: "2", benefit: "50% de desconto em produtos", student: "Pedro Santos", date: new Date(2026, 3, 25) },
  ]);

  const handleCreateBenefit = () => {
    if (!formData.title || !formData.description || !formData.cost) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newBenefit: Benefit = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title,
      description: formData.description,
      image: formData.image || "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400",
      cost: parseInt(formData.cost),
      company: user?.companyName || "Sua Empresa",
      category: formData.category || "Geral",
      available: true,
    };

    setBenefits([...benefits, newBenefit]);
    toast.success("Vantagem cadastrada com sucesso!");

    setFormData({
      title: "",
      description: "",
      image: "",
      cost: "",
      category: "",
    });
    setOpen(false);
  };

  const handleDeleteBenefit = (id: string) => {
    setBenefits(benefits.filter((b) => b.id !== id));
    toast.success("Vantagem removida");
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
              Painel da Empresa
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie suas vantagens oferecidas
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar vantagem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cadastrar nova vantagem</DialogTitle>
                <DialogDescription>
                  Crie uma oferta atrativa para os alunos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da vantagem *</Label>
                  <Input
                    id="title"
                    placeholder="Ex: 50% de desconto"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva os detalhes da vantagem..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Custo em moedas *</Label>
                  <Input
                    id="cost"
                    type="number"
                    placeholder="Ex: 200"
                    value={formData.cost}
                    onChange={(e) =>
                      setFormData({ ...formData, cost: e.target.value })
                    }
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    placeholder="Ex: Alimentação, Educação..."
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL da imagem (opcional)</Label>
                  <Input
                    id="image"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleCreateBenefit}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar vantagem
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
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-400">Vantagens ativas</p>
                  <Gift className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {benefits.length}
                  </h2>
                  <span className="text-lg text-gray-600 dark:text-gray-400">ofertas</span>
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
                  <p className="text-gray-600 dark:text-gray-400">Total de resgates</p>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {redemptions.length}
                  </h2>
                  <span className="text-lg text-gray-600 dark:text-gray-400">resgates</span>
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
                  <p className="text-gray-600 dark:text-gray-400">Alunos alcançados</p>
                  <Eye className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {redemptions.length}
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
              <CardTitle>Suas vantagens</CardTitle>
              <CardDescription>Gerencie as ofertas cadastradas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {benefits.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Nenhuma vantagem cadastrada ainda
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Clique em "Cadastrar vantagem" para começar
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {benefits.map((benefit) => (
                    <motion.div
                      key={benefit.id}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
                    >
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {benefit.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{benefit.category}</Badge>
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                              {benefit.cost} moedas
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteBenefit(benefit.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
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
              <CardTitle>Resgates recentes</CardTitle>
              <CardDescription>Vantagens resgatadas por alunos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {redemptions.map((redemption) => (
                <div
                  key={redemption.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {redemption.benefit}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Resgatado por {redemption.student}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {redemption.date.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
