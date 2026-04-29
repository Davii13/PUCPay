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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { motion } from "motion/react";

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
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  const getRoleIcon = () => {
    switch (user?.role) {
      case "student":
        return <GraduationCap className="w-4 h-4" />;
      case "professor":
        return <Coins className="w-4 h-4" />;
      case "company":
        return <Building2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case "student":
        return "Aluno";
      case "professor":
        return "Professor";
      case "company":
        return "Empresa Parceira";
      default:
        return "";
    }
  };

  return (
    <aside className="hidden md:flex w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-white">
              PUCPAY
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PUCCoin
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.name}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              {getRoleIcon()}
              <span>{getRoleLabel()}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className="block">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 mr-3" />
          ) : (
            <Moon className="w-5 h-5 mr-3" />
          )}
          {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
