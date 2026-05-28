export const emailTemplates = {
  benefitPurchase: (params: {
    companyName: string;
    studentName: string;
    studentEmail: string;
    benefitTitle: string;
    cost: number;
    couponCode?: string;
  }) => `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
          padding: 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
          color: #333;
        }
        .content h2 {
          color: #9333ea;
          margin-top: 0;
        }
        .info-box {
          background-color: #f8f7ff;
          border-left: 4px solid #9333ea;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .info-box strong {
          color: #9333ea;
        }
        .coupon-box {
          background-color: #fff3cd;
          border: 2px dashed #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          text-align: center;
        }
        .coupon-code {
          font-size: 24px;
          font-weight: bold;
          color: #856404;
          font-family: monospace;
        }
        .footer {
          background-color: #f8f7ff;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          margin: 20px 0;
          font-weight: bold;
        }
        .social-links {
          margin-top: 15px;
          font-size: 12px;
        }
        .social-links a {
          color: #9333ea;
          text-decoration: none;
          margin: 0 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💜</div>
          <h1>PUCPay</h1>
          <p>Nova Vantagem Resgatada!</p>
        </div>

        <div class="content">
          <h2>Olá, ${params.companyName}! 👋</h2>

          <p>Ótimas notícias! Um estudante resgatou uma de suas vantagens.</p>

          <div class="info-box">
            <strong>Detalhes da Transação:</strong><br>
            <strong>Estudante:</strong> ${params.studentName}<br>
            <strong>Email:</strong> ${params.studentEmail}<br>
            <strong>Vantagem:</strong> ${params.benefitTitle}<br>
            <strong>Valor:</strong> ${params.cost} PUCCoins
          </div>

          ${params.couponCode ? `
            <div class="coupon-box">
              <strong>Código do Cupom:</strong><br>
              <div class="coupon-code">${params.couponCode}</div>
              <p style="margin: 10px 0 0 0; font-size: 12px;">Use este código para validar o resgate</p>
            </div>
          ` : ''}

          <p>Por favor, prepare a entrega/validação da vantagem correspondente para nosso aluno.</p>

          <div style="text-align: center;">
            <a href="https://pucpay.com" class="cta-button">Acessar PUCPay</a>
          </div>
        </div>

        <div class="footer">
          <p><strong>PUCPay</strong> - Plataforma de Gamificação e Recompensas</p>
          <p>© 2026 PUC Minas. Todos os direitos reservados.</p>
          <div class="social-links">
            <a href="#">Instagram</a> |
            <a href="#">Twitter</a> |
            <a href="#">LinkedIn</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `,

  studentCoins: (params: {
    studentName: string;
    professorName: string;
    amount: number;
    message: string;
  }) => `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
          padding: 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
          color: #333;
        }
        .content h2 {
          color: #9333ea;
          margin-top: 0;
        }
        .coins-box {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 30px;
          margin: 20px 0;
          border-radius: 12px;
          text-align: center;
        }
        .coins-amount {
          font-size: 48px;
          font-weight: bold;
          margin: 10px 0;
        }
        .coins-label {
          font-size: 18px;
          opacity: 0.9;
        }
        .message-box {
          background-color: #f8f7ff;
          border-left: 4px solid #9333ea;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          font-style: italic;
        }
        .footer {
          background-color: #f8f7ff;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          margin: 20px 0;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💜</div>
          <h1>PUCPay</h1>
          <p>Você recebeu PUCCoins!</p>
        </div>

        <div class="content">
          <h2>Parabéns, ${params.studentName}! 🎉</h2>

          <p>O Prof. <strong>${params.professorName}</strong> enviou moedas para você!</p>

          <div class="coins-box">
            <div class="coins-label">Você recebeu</div>
            <div class="coins-amount">+${params.amount}</div>
            <div class="coins-label">PUCCoins</div>
          </div>

          ${params.message ? `
            <div class="message-box">
              <strong>Mensagem do Professor:</strong><br><br>
              "${params.message}"
            </div>
          ` : ''}

          <p>Acesse o PUCPay para ver seu saldo atualizado e trocá-las por vantagens incríveis no nosso marketplace!</p>

          <div style="text-align: center;">
            <a href="https://pucpay.com/marketplace" class="cta-button">Ir para Marketplace</a>
          </div>
        </div>

        <div class="footer">
          <p><strong>PUCPay</strong> - Plataforma de Gamificação e Recompensas</p>
          <p>© 2026 PUC Minas. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  professorCoins: (params: {
    professorName: string;
    amount: number;
  }) => `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
          padding: 30px;
          text-align: center;
          color: white;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          padding: 30px;
          color: #333;
        }
        .content h2 {
          color: #9333ea;
          margin-top: 0;
        }
        .coins-box {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          color: white;
          padding: 30px;
          margin: 20px 0;
          border-radius: 12px;
          text-align: center;
        }
        .coins-amount {
          font-size: 48px;
          font-weight: bold;
          margin: 10px 0;
        }
        .footer {
          background-color: #f8f7ff;
          padding: 20px;
          text-align: center;
          color: #666;
          font-size: 12px;
          border-top: 1px solid #eee;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #9333ea 0%, #6366f1 100%);
          color: white;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          margin: 20px 0;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💜</div>
          <h1>PUCPay</h1>
          <p>Crédito Disponível!</p>
        </div>

        <div class="content">
          <h2>Olá, Prof. ${params.professorName}! 👋</h2>

          <p>Você recebeu um crédito do administrador do sistema!</p>

          <div class="coins-box">
            <div style="font-size: 18px; opacity: 0.9;">Saldo adicionado</div>
            <div class="coins-amount">+${params.amount}</div>
            <div style="font-size: 18px; opacity: 0.9;">PUCCoins</div>
          </div>

          <p>Essas moedas estão disponíveis em seu painel para serem distribuídas aos alunos como reconhecimento por seu mérito acadêmico.</p>

          <p><strong>O que você pode fazer agora:</strong></p>
          <ul>
            <li>Distribuir moedas aos alunos como reconhecimento</li>
            <li>Acompanhar o progresso dos seus alunos</li>
            <li>Ver o leaderboard de gamificação</li>
          </ul>

          <div style="text-align: center;">
            <a href="https://pucpay.com/dashboard" class="cta-button">Ir para Dashboard</a>
          </div>
        </div>

        <div class="footer">
          <p><strong>PUCPay</strong> - Plataforma de Gamificação e Recompensas</p>
          <p>© 2026 PUC Minas. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `
};
