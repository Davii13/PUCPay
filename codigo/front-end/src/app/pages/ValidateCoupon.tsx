import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { CheckCircle2, Loader2, ShieldCheck, Store, Ticket, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { fetchApi } from "../services/api";

export function ValidateCoupon() {
  const { codigo } = useParams();
  const [coupon, setCoupon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!codigo) return;

    const loadAndValidate = async () => {
      setLoading(true);
      try {
        const couponData = await fetchApi(`/transacoes/cupom/${codigo}`);

        if (couponData.statusCupom !== "USADO") {
          try {
            const validatedCoupon = await fetchApi(`/transacoes/cupom/${codigo}/validar`, {
              method: "POST",
            });
            setCoupon(validatedCoupon);
            toast.success("Vantagem resgatada com sucesso!");
          } catch (err: any) {
            setCoupon(couponData);
            toast.error(err.message || "Erro ao validar cupom");
          }
        } else {
          setCoupon(couponData);
        }
      } catch (err: any) {
        setError(err.message || "Cupom não encontrado");
      } finally {
        setLoading(false);
      }
    };

    loadAndValidate();
  }, [codigo]);


  const isUsed = coupon?.statusCupom === "USADO";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 flex items-center justify-center p-6">
      <Card className="w-full max-w-lg border-none shadow-2xl rounded-[2rem] overflow-hidden bg-white dark:bg-gray-900">
        <CardHeader className="p-8 bg-purple-600 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-black">Validação de cupom</CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : error ? (
            <div className="text-center py-10 space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-rose-500" />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Cupom inválido</h2>
              <p className="text-gray-500">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-lg text-sm font-black ${isUsed ? "bg-gray-100 text-gray-600" : "bg-emerald-100 text-emerald-700"}`}>
                  {isUsed ? "Já utilizado" : "Disponível"}
                </span>
                <span className="font-mono font-black text-purple-700 dark:text-purple-400">{coupon.codigoCupom}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Ticket className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-xs uppercase font-black tracking-widest text-gray-400">Vantagem</p>
                    <p className="text-lg font-black text-gray-900 dark:text-white">{coupon.vantagem?.titulo}</p>
                    <p className="text-sm text-gray-500">{coupon.vantagem?.descricao}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Store className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-xs uppercase font-black tracking-widest text-gray-400">Empresa</p>
                    <p className="font-bold text-gray-900 dark:text-white">{coupon.vantagem?.empresa?.nome}</p>
                  </div>
                </div>
              </div>

              {isUsed ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <p className="font-black text-emerald-700 dark:text-emerald-400">Cupom validado com sucesso!</p>
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">
                    Validado em {new Date(coupon.dataValidacaoCupom).toLocaleString("pt-BR")}
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  <p className="text-sm font-black text-blue-600 dark:text-blue-400">Validando cupom...</p>
                </div>
              )}
            </>
          )}

          <Button asChild variant="ghost" className="w-full rounded-xl">
            <Link to="/auth/login">Voltar para o PUCPay</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
