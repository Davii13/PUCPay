import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { StudentDashboard } from "./pages/student/Dashboard";
import { ProfessorDashboard } from "./pages/professor/Dashboard";
import { CompanyDashboard } from "./pages/company/Dashboard";
import { Marketplace } from "./pages/Marketplace";
import { Transactions } from "./pages/Transactions";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "forgot-password", Component: ForgotPassword },
    ],
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: StudentDashboard },
      { path: "student", Component: StudentDashboard },
      { path: "professor", Component: ProfessorDashboard },
      { path: "company", Component: CompanyDashboard },
      { path: "marketplace", Component: Marketplace },
      { path: "transactions", Component: Transactions },
      { path: "profile", Component: Profile },
      { path: "*", Component: NotFound },
    ],
  },
]);
