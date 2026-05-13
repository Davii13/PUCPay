import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function Layout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-500 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
