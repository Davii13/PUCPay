import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";
import { 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  Lock, 
  Save, 
  Camera, 
  Loader2,
  MapPin,
  FileText,
  ShieldCheck,
  ChevronRight,
  Edit3,
  X,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

export function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || user?.nome || "",
    email: user?.email || "",
    telefone: user?.telefone || "",
    institution: user?.institution || "",
    course: user?.course || user?.curso || "",
    department: user?.department || "",
    companyName: user?.companyName || "",
    cpf: user?.cpf || "",
    rg: user?.rg || "",
    endereco: user?.endereco || "",
    cnpj: user?.cnpj || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.nome || "",
        email: user.email || "",
        telefone: user.telefone || "",
        institution: user.institution || "",
        course: user.course || user.curso || "",
        department: user.department || "",
        companyName: user.companyName || "",
        cpf: user.cpf || "",
        rg: user.rg || "",
        endereco: user.endereco || "",
        cnpj: user.cnpj || "",
      });
    }
  }, [user]);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(formData);
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao atualizar o perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres");
      return;
    }
    toast.success("Senha alterada com sucesso!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "student": return "Aluno";
      case "professor": return "Professor";
      case "company": return "Empresa Parceira";
      default: return "Usuário";
    }
  };

  const renderField = (label: string, icon: any, value: string, name: string, placeholder?: string) => (
    <div className="space-y-2">
      <Label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
        {icon && <span className="text-purple-500">{icon}</span>}
        {label}
      </Label>
      <div className="relative group">
        <Input
          name={name}
          value={value}
          onChange={(e) => setFormData(prev => ({ ...prev, [name]: e.target.value }))}
          disabled={!isEditing}
          placeholder={placeholder}
          className={`h-12 rounded-xl transition-all border-gray-100 dark:border-gray-800 ${
            isEditing 
            ? "bg-white dark:bg-gray-900 border-purple-200 focus:ring-purple-500" 
            : "bg-gray-50/50 dark:bg-gray-950/50 cursor-not-allowed opacity-80"
          }`}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-20">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-none shadow-2xl overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-900">
            <div className="h-40 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 relative">
              <div className="absolute inset-0 bg-black/10" />
            </div>
            <CardContent className="px-8 pb-8 -mt-20 relative z-10">
              <div className="flex flex-col md:flex-row items-end gap-6">
                <div className="relative group">
                  <Avatar className="w-40 h-40 border-[6px] border-white dark:border-gray-900 shadow-2xl rounded-3xl overflow-hidden">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                    <AvatarFallback className="text-4xl font-black bg-purple-100 text-purple-600">
                      {user?.name?.[0] || user?.nome?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-4 right-4 p-2.5 bg-white dark:bg-gray-800 text-purple-600 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex-1 pb-2">
                  <Badge className="bg-purple-500/10 text-purple-600 border-none mb-3 px-3 py-1 font-black text-[10px] uppercase tracking-widest">
                    {getRoleLabel()}
                  </Badge>
                  <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">
                    {user?.name || user?.nome}
                  </h1>
                  <p className="text-gray-500 font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                </div>

                <div className="pb-2">
                  {!isEditing ? (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-purple-100 dark:shadow-none"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="rounded-2xl h-12 px-6 font-bold text-gray-500"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="bg-purple-600 hover:bg-purple-700 text-white rounded-2xl h-12 px-8 font-black shadow-lg shadow-purple-100 dark:shadow-none"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Salvar Alterações
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-gray-900 overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black">Informações Pessoais</CardTitle>
                      <CardDescription>Seus dados básicos de identificação</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 grid md:grid-cols-2 gap-6">
                  {renderField("Nome Completo", <User className="w-3 h-3" />, formData.name, "name")}
                  {renderField("E-mail", <Mail className="w-3 h-3" />, formData.email, "email")}
                  {renderField("WhatsApp", <Phone className="w-3 h-3" />, formData.telefone, "telefone", "5531999999999")}
                  
                  {user?.role === "student" && (
                    <>
                      {renderField("Curso", <GraduationCap className="w-3 h-3" />, formData.course, "course")}
                      {renderField("Instituição", <Building2 className="w-3 h-3" />, formData.institution, "institution")}
                      {renderField("CPF", <FileText className="w-3 h-3" />, formData.cpf, "cpf")}
                      {renderField("RG", <FileText className="w-3 h-3" />, formData.rg, "rg")}
                    </>
                  )}

                  {user?.role === "professor" && (
                    <>
                      {renderField("Departamento", <Building2 className="w-3 h-3" />, formData.department, "department")}
                      {renderField("Instituição", <Building2 className="w-3 h-3" />, formData.institution, "institution")}
                    </>
                  )}

                  {user?.role === "company" && (
                    <>
                      {renderField("Nome da Empresa", <Building2 className="w-3 h-3" />, formData.companyName, "companyName")}
                      {renderField("CNPJ", <FileText className="w-3 h-3" />, formData.cnpj, "cnpj")}
                    </>
                  )}
                  
                  <div className="md:col-span-2">
                    {renderField("Endereço", <MapPin className="w-3 h-3" />, formData.endereco, "endereco", "Rua, número, bairro, cidade - UF")}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-gray-900 overflow-hidden">
                <CardHeader className="p-8 border-b border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-black">Segurança da Conta</CardTitle>
                      <CardDescription>Mantenha sua conta protegida com uma senha forte</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Senha Atual</Label>
                      <Input 
                        type="password" 
                        className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-950/50"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                    </div>
                    <div className="hidden md:block" />
                    
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Nova Senha</Label>
                      <Input 
                        type="password" 
                        className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-950/50"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirmar Nova Senha</Label>
                      <Input 
                        type="password" 
                        className="h-12 rounded-xl bg-gray-50/50 dark:bg-gray-950/50"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button 
                      onClick={handleChangePassword}
                      variant="outline" 
                      className="rounded-xl h-12 px-8 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold"
                    >
                      Alterar Senha
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar Info Section */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-none shadow-xl rounded-[2rem] bg-white dark:bg-gray-900 overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    Verificação
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-700">Conta Verificada</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Acesso PUC Confirmado</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Acesso Rápido</p>
                    {[
                      { label: "Privacidade", icon: ShieldCheck },
                      { label: "Notificações", icon: User },
                      { label: "Dispositivos", icon: Lock },
                    ].map((item) => (
                      <button key={item.label} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </button>
                    ))}
                  </div>

                  <Separator className="bg-gray-100 dark:bg-gray-800" />

                  <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-100 dark:border-purple-900/20">
                    <p className="text-sm font-black text-purple-700 dark:text-purple-400 mb-2">Dica de Segurança</p>
                    <p className="text-xs text-purple-600 dark:text-purple-300 leading-relaxed font-medium">
                      Nunca compartilhe sua senha do PUCPay com terceiros. Nossos administradores nunca solicitarão seus dados de acesso.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
