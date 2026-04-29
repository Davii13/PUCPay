# PUCPAY - Sistema de Moeda Estudantil 🪙

Sistema completo de moeda virtual acadêmica com design moderno inspirado em Apple e bancos digitais (Nubank, Inter, C6).

## 🎨 Design

- **Estilo**: Minimalista, moderno e elegante (Apple-like)
- **Cores**: Base neutra com roxo suave (Nubank-style)
- **UX/UI**: Inspirado em bancos digitais modernos
- **Responsivo**: Mobile-first com navegação adaptativa
- **Dark Mode**: Suporte completo a tema escuro
- **Animações**: Microinterações e transições suaves com Motion

## 🚀 Funcionalidades

### 👨‍🎓 Área do Aluno
- Dashboard com saldo em destaque (estilo banco digital)
- Gráfico de evolução do saldo
- Transações recentes
- Vantagens recomendadas
- Marketplace completo com filtros
- Extrato detalhado

### 👨‍🏫 Área do Professor
- Envio de moedas para alunos
- Mensagem obrigatória ao enviar
- Histórico de distribuições
- Gráfico de distribuição mensal
- Controle de saldo

### 🏢 Área da Empresa
- Cadastro de vantagens
- Gerenciamento de ofertas
- Histórico de resgates
- Estatísticas de alcance

### 🛍️ Marketplace
- Busca inteligente
- Filtros por categoria
- Cards com imagens
- Sistema de resgate com confirmação
- Animação de confetti ao resgatar

### 📊 Extrato
- Organização por data
- Filtros por tipo (recebimento, envio, resgate)
- Filtros por período (semana, mês, tudo)
- Design inspirado em apps bancários
- Exportação de dados

## 🔐 Autenticação

### Usuários de Demonstração

**Aluno:**
- Email: `student@puc.br`
- Senha: `demo123`

**Professor:**
- Email: `professor@puc.br`
- Senha: `demo123`

**Empresa:**
- Email: `empresa@parceiro.com`
- Senha: `demo123`

## 🛠️ Tecnologias

- **React 18** - Framework UI
- **React Router 7** - Navegação
- **TypeScript** - Tipagem
- **Tailwind CSS v4** - Estilização
- **Motion (Framer Motion)** - Animações
- **Recharts** - Gráficos
- **Radix UI** - Componentes acessíveis
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **date-fns** - Manipulação de datas
- **Canvas Confetti** - Efeitos de confetti
- **next-themes** - Gerenciamento de tema

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── ui/               # Componentes de UI (Radix/shadcn)
│   │   ├── Layout.tsx        # Layout principal
│   │   ├── Sidebar.tsx       # Navegação desktop
│   │   └── MobileNav.tsx     # Navegação mobile
│   ├── context/
│   │   └── AuthContext.tsx   # Contexto de autenticação
│   ├── data/
│   │   └── mockData.ts       # Dados de demonstração
│   ├── pages/
│   │   ├── auth/             # Páginas de autenticação
│   │   ├── student/          # Dashboard do aluno
│   │   ├── professor/        # Dashboard do professor
│   │   ├── company/          # Dashboard da empresa
│   │   ├── Marketplace.tsx   # Marketplace de vantagens
│   │   ├── Transactions.tsx  # Extrato de transações
│   │   ├── Profile.tsx       # Perfil e configurações
│   │   └── NotFound.tsx      # Página 404
│   ├── routes.tsx            # Configuração de rotas
│   └── App.tsx               # Componente raiz
└── styles/
    ├── theme.css             # Tema e variáveis CSS
    └── fonts.css             # Importação de fontes
```

## 🎯 Destaques de UX/UI

### Design System
- Componentes reutilizáveis com Radix UI
- Sistema de cores consistente
- Tipografia hierárquica
- Espaçamento padronizado

### Microinterações
- Hover states suaves
- Animações de entrada (fade in, slide up)
- Feedback visual imediato
- Estados de loading elegantes

### Responsividade
- Layout adaptativo para mobile e desktop
- Navegação em bottom tab bar no mobile
- Sidebar fixa no desktop
- Cards e grids responsivos

### Acessibilidade
- Componentes Radix UI (ARIA compliant)
- Contraste de cores adequado
- Navegação por teclado
- Labels semânticos

## 📱 Experiência Mobile

- Bottom navigation bar intuitiva
- Touch-friendly buttons (min 44px)
- Swipe gestures suaves
- Otimizado para telas pequenas

## 🌙 Dark Mode

Suporte completo a tema escuro com:
- Cores otimizadas para baixa luminosidade
- Contraste adequado
- Transições suaves entre temas
- Toggle no sidebar

## 🎨 Paleta de Cores

### Light Mode
- Background: Branco/Cinza claro
- Primary: Roxo (#9333ea)
- Success: Verde
- Error: Vermelho

### Dark Mode
- Background: Cinza escuro/Preto
- Primary: Roxo claro
- Bordas: Cinza médio

## 💡 Próximos Passos (Produção)

1. **Backend Integration**
   - Conectar com Supabase ou API REST
   - Autenticação real com JWT
   - Persistência de dados

2. **Features Adicionais**
   - Notificações push
   - Chat entre usuários
   - Sistema de badges/conquistas
   - Ranking de alunos

3. **Otimizações**
   - Code splitting
   - Lazy loading de imagens
   - PWA (Progressive Web App)
   - Analytics

## 📄 Licença

Este é um projeto de demonstração para fins educacionais.

---

**Desenvolvido com ❤️ usando React + Tailwind CSS**
