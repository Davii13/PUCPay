import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Store,
  Receipt,
  User,
  LogOut,
  Coins,
  Building2,
  GraduationCap,
  Moon,
  Sun,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const getNavItems = () => {
    const commonItems = [
      { path: "/marketplace", label: "Marketplace", icon: Store },
      { path: "/transactions", label: "Extrato", icon: Receipt },
      { path: "/profile", label: "Perfil", icon: User },
    ];

    switch (user?.role) {
      case "student":
        return [
          { path: "/student", label: "Dashboard", icon: Home },
          ...commonItems,
        ];
      case "professor":
        return [
          { path: "/professor", label: "Dashboard", icon: Home },
          ...commonItems,
        ];
      case "company":
        return [
          { path: "/company", label: "Dashboard", icon: Home },
          ...commonItems,
        ];
      case "admin":
        return [
          { path: "/admin", label: "Dashboard", icon: Home },
          ...commonItems,
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = () => {
    switch (user?.role) {
      case "student": return "Aluno";
      case "professor": return "Professor";
      case "company": return "Empresa Parceira";
      case "admin": return "Administrador";
      default: return "Usuário";
    }
  };

  return (
    <aside className="hidden md:flex w-72 bg-[#F8FAFC] dark:bg-gray-950 flex-col h-screen sticky top-0 border-r border-gray-100 dark:border-gray-900">
      {/* Brand Section */}
      <div className="p-8">
        <div className="flex items-center gap-4 group cursor-pointer">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-200 dark:shadow-none"
          >
            <Coins className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
              PUCPAY
            </h1>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sistema Oficial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
        <p className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 mt-2">Menu Principal</p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? "bg-white dark:bg-gray-900 text-purple-600 shadow-lg shadow-gray-200/50 dark:shadow-none"
                    : "text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900/50"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute left-0 w-1.5 h-8 bg-purple-600 rounded-r-full"
                  />
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-purple-600" : "text-gray-400 group-hover:text-purple-500"}`} />
                <span className={`font-bold text-sm tracking-tight ${isActive ? "text-gray-900 dark:text-white" : ""}`}>
                  {item.label}
                </span>
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-purple-600/50" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 space-y-4">
        {/* Theme Toggle & Promo Card */}
        <div className="p-4 rounded-[2rem] bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-900 border border-purple-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3 h-3" />
              Modo Visual
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 text-purple-600 shadow-sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-[11px] text-purple-600 dark:text-gray-400 font-medium leading-relaxed">
            Personalize sua experiência com o modo escuro premium.
          </p>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-[2rem] bg-white dark:bg-gray-900 shadow-xl border border-gray-50 dark:border-gray-800 group transition-all hover:border-purple-200">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 rounded-2xl border-2 border-purple-100 dark:border-gray-800 transition-transform group-hover:scale-105">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
              <AvatarFallback className="bg-purple-100 text-purple-600 font-black">
                {(user?.name || user?.nome)?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                {user?.name || user?.nome}
              </p>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{getRoleLabel()}</p>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            className="w-full mt-4 h-10 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-black text-xs uppercase tracking-widest transition-all group-hover:translate-y-[-2px]"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair do Sistema
          </Button>
        </div>
      </div>
    </aside>
  );
}
