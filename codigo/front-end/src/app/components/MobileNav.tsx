import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Home, Store, Receipt, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const commonItems = [
      { path: "/marketplace", label: "Loja", icon: Store },
      { path: "/transactions", label: "Extrato", icon: Receipt },
      { path: "/profile", label: "Perfil", icon: User },
    ];

    switch (user?.role) {
      case "student": return [{ path: "/student", label: "Início", icon: Home }, ...commonItems];
      case "professor": return [{ path: "/professor", label: "Início", icon: Home }, ...commonItems];
      case "company": return [{ path: "/company", label: "Início", icon: Home }, ...commonItems];
      default: return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-gray-800/50 md:hidden z-50 rounded-[2rem] shadow-2xl shadow-purple-500/10 overflow-hidden">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className="relative flex-1 group">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                  isActive ? "text-purple-600 scale-110" : "text-gray-400"
                }`}
              >
                <div className="relative">
                  <item.icon className={`w-6 h-6 ${isActive ? "fill-purple-600/10" : ""}`} />
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="absolute -top-1 -right-1 w-2 h-2 bg-purple-600 rounded-full border-2 border-white dark:border-gray-900"
                    />
                  )}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "opacity-100" : "opacity-0"}`}>
                  {item.label}
                </span>
              </motion.div>
              
              {isActive && (
                <motion.div
                  layoutId="mobileActiveTab"
                  className="absolute inset-0 bg-purple-50 dark:bg-purple-900/20 -z-10 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
