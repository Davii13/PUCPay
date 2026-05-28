import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { emailTemplates } from "./emailTemplates";

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
  console.log("[EmailJS] Enviando e-mail para:", templateParams.to_email);

  if (!isConfigured()) {
    console.warn(
      `[EmailJS] Configuração incompleta. Preencha o arquivo .env com as chaves do EmailJS.\n` +
      `Dados simulados do e-mail que seria enviado para: ${templateParams.to_email}`
    );
    return;
  }

  try {
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_name: templateParams.to_name,
        to_email: templateParams.to_email,
        subject: templateParams.subject,
        html_body: templateParams.html_body,
        message: templateParams.html_body, // Fallback para texto
        ...templateParams,
      },
      PUBLIC_KEY
    );
    console.log("[EmailJS] E-mail enviado com sucesso!", response.status);
  } catch (error: any) {
    console.error("[EmailJS] Falha ao enviar e-mail:", error);
    toast.error(`Falha ao enviar e-mail de notificação: ${error.text || error.message || error}`);
  }
}

/**
 * Helper function to prepare email with HTML body
 */
function prepareEmailWithHtml(
  toName: string,
  toEmail: string,
  subject: string,
  htmlContent: string,
  additionalParams: Record<string, any> = {}
) {
  return {
    to_name: toName,
    to_email: toEmail,
    subject,
    html_body: htmlContent,
    ...additionalParams,
  };
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
  const htmlContent = emailTemplates.benefitPurchase({
    companyName: params.companyName,
    studentName: params.studentName,
    studentEmail: params.studentEmail,
    benefitTitle: params.benefitTitle,
    cost: params.cost,
    couponCode: params.couponCode,
  });

  await sendEmail(
    prepareEmailWithHtml(
      params.companyName,
      params.companyEmail,
      subject,
      htmlContent,
      {
        reply_to: params.studentEmail,
        from_name: params.studentName,
      }
    )
  );
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
  const htmlContent = emailTemplates.professorCoins({
    professorName: params.professorName,
    amount: params.amount,
  });

  await sendEmail(
    prepareEmailWithHtml(
      params.professorName,
      params.professorEmail,
      subject,
      htmlContent,
      {
        reply_to: params.professorEmail,
        from_name: "Administrador",
      }
    )
  );
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
  const htmlContent = emailTemplates.studentCoins({
    studentName: params.studentName,
    professorName: params.professorName,
    amount: params.amount,
    message: params.message,
  });

  await sendEmail(
    prepareEmailWithHtml(
      params.studentName,
      params.studentEmail,
      subject,
      htmlContent,
      {
        reply_to: params.studentEmail,
        from_name: params.professorName,
      }
    )
  );
}
