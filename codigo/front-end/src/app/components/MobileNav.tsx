import { Link, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Home, Store, Receipt, User } from "lucide-react";
import { motion } from "motion/react";

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
      case "student":
        return [
          { path: "/student", label: "Início", icon: Home },
          ...commonItems,
        ];
      case "professor":
        return [
          { path: "/professor", label: "Início", icon: Home },
          ...commonItems,
        ];
      case "company":
        return [
          { path: "/company", label: "Início", icon: Home },
          ...commonItems,
        ];
      default:
        return commonItems;
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 md:hidden z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className="flex-1">
              <motion.div
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
