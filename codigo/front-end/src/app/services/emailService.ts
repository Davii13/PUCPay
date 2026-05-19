import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

/**
 * Helper method to check if EmailJS is configured.
 */
function isConfigured(): boolean {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
}

/**
 * Generic function to send email via EmailJS.
 */
async function sendEmail(templateParams: Record<string, any>) {
  if (!isConfigured()) {
    console.warn(
      `[EmailJS] Configuração incompleta. Preencha o arquivo .env com as chaves do EmailJS.\n` +
      `Dados simulados do e-mail que seria enviado:\n`,
      templateParams
    );
    return;
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );
    console.log("[EmailJS] E-mail enviado com sucesso!", response.status, response.text);
  } catch (error: any) {
    console.error("[EmailJS] Falha ao enviar e-mail:", error);
    toast.error(`Falha ao enviar e-mail de notificação: ${error.text || error.message || error}`);
  }
}

/**
 * Caso de Uso 1: Empresa recebe e-mail quando o aluno resgata/compra uma vantagem.
 */
export async function sendBenefitPurchaseEmail(params: {
  companyName: string;
  companyEmail: string;
  studentName: string;
  studentEmail: string;
  benefitTitle: string;
  cost: number;
  couponCode?: string;
}) {
  const subject = `[PUCPay] Nova Vantagem Resgatada - ${params.benefitTitle}`;
  const message = `Olá, ${params.companyName}!

O estudante ${params.studentName} (${params.studentEmail}) resgatou a vantagem "${params.benefitTitle}" oferecida por sua empresa.

Detalhes da transação:
- Valor debitado: ${params.cost} PUCCoins
${params.couponCode ? `- Código do Cupom: ${params.couponCode}\n` : ""}
Por favor, prepare a entrega/validação da vantagem correspondente.

Atenciosamente,
Equipe PUCPay`;

  await sendEmail({
    to_name: params.companyName,
    to_email: params.companyEmail,
    from_name: params.studentName,
    subject,
    message,
    value: params.cost,
    extra_info: params.couponCode || "",
  });
}

/**
 * Caso de Uso 2: Professor recebe e-mail ao receber moedas do administrador.
 */
export async function sendProfessorCoinsEmail(params: {
  professorName: string;
  professorEmail: string;
  amount: number;
}) {
  const subject = `[PUCPay] Você recebeu ${params.amount} moedas do Administrador!`;
  const message = `Olá, Prof. ${params.professorName}!

Você recebeu um crédito de ${params.amount} PUCCoins do administrador do sistema.
Essas moedas estão disponíveis em seu painel para serem distribuídas aos alunos como reconhecimento por seu mérito acadêmico.

Acesse o sistema para conferir seu saldo atualizado.

Atenciosamente,
Equipe PUCPay`;

  await sendEmail({
    to_name: params.professorName,
    to_email: params.professorEmail,
    from_name: "Administrador",
    subject,
    message,
    value: params.amount,
    extra_info: "",
  });
}

/**
 * Caso de Uso 3: Aluno recebe e-mail ao receber moedas de um professor.
 */
export async function sendStudentCoinsEmail(params: {
  studentName: string;
  studentEmail: string;
  professorName: string;
  amount: number;
  message: string;
}) {
  const subject = `[PUCPay] Você recebeu ${params.amount} PUCCoins do Prof. ${params.professorName}!`;
  const message = `Olá, ${params.studentName}!

Parabéns! O professor ${params.professorName} enviou ${params.amount} PUCCoins para você.

Mensagem de reconhecimento do professor:
"${params.message}"

Acesse o PUCPay para ver seu saldo atualizado e trocá-las por vantagens incríveis no nosso marketplace!

Atenciosamente,
Equipe PUCPay`;

  await sendEmail({
    to_name: params.studentName,
    to_email: params.studentEmail,
    from_name: params.professorName,
    subject,
    message,
    value: params.amount,
    extra_info: params.message,
  });
}
