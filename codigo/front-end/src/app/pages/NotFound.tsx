import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-purple-600 dark:text-purple-400 mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Página não encontrada
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </motion.div>

        <div className="flex gap-4 justify-center">
          <Link to="/">
            <Button className="bg-gradient-to-r from-purple-500 to-purple-700">
              <Home className="w-4 h-4 mr-2" />
              Ir para Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
