export interface Transaction {
  id: string;
  type: "receive" | "send" | "redeem";
  amount: number;
  description: string;
  date: Date;
  from?: string;
  to?: string;
  message?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  image: string;
  cost: number;
  company: string;
  category: string;
  available: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  avatar: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "receive",
    amount: 100,
    description: "Participação em projeto de pesquisa",
    date: new Date(2026, 3, 28),
    from: "Prof. João Santos",
    message: "Excelente trabalho no projeto de IA!",
  },
  {
    id: "2",
    type: "receive",
    amount: 50,
    description: "Colaboração em aula",
    date: new Date(2026, 3, 25),
    from: "Prof. Ana Costa",
    message: "Ótima apresentação sobre algoritmos",
  },
  {
    id: "3",
    type: "redeem",
    amount: -200,
    description: "Desconto na cantina - 50% OFF",
    date: new Date(2026, 3, 22),
    to: "Cantina Universitária",
  },
  {
    id: "4",
    type: "receive",
    amount: 75,
    description: "Monitoria de Programação",
    date: new Date(2026, 3, 20),
    from: "Prof. João Santos",
    message: "Continue com o bom trabalho!",
  },
  {
    id: "5",
    type: "redeem",
    amount: -150,
    description: "Livro técnico com desconto",
    date: new Date(2026, 3, 18),
    to: "Livraria Acadêmica",
  },
  {
    id: "6",
    type: "receive",
    amount: 120,
    description: "Participação em hackathon",
    date: new Date(2026, 3, 15),
    from: "Coordenação do Curso",
    message: "Parabéns pela colocação!",
  },
];

export const mockBenefits: Benefit[] = [
  {
    id: "1",
    title: "50% de desconto na cantina",
    description: "Válido para qualquer item do cardápio durante o mês",
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400",
    cost: 200,
    company: "Cantina Universitária",
    category: "Alimentação",
    available: true,
  },
  {
    id: "2",
    title: "Livro técnico grátis",
    description: "Escolha qualquer livro do catálogo de tecnologia",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400",
    cost: 300,
    company: "Livraria Acadêmica",
    category: "Educação",
    available: true,
  },
  {
    id: "3",
    title: "1 mês de academia grátis",
    description: "Acesso completo à academia e aulas coletivas",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    cost: 500,
    company: "Academia FitPUC",
    category: "Saúde",
    available: true,
  },
  {
    id: "4",
    title: "Curso online de programação",
    description: "Acesso vitalício a curso completo de desenvolvimento web",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
    cost: 400,
    company: "TechCorp Academy",
    category: "Educação",
    available: true,
  },
  {
    id: "5",
    title: "Kit material escolar",
    description: "Cadernos, canetas e materiais de qualidade premium",
    image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400",
    cost: 150,
    company: "Papelaria Central",
    category: "Materiais",
    available: true,
  },
  {
    id: "6",
    title: "Ingresso para evento tech",
    description: "Entrada VIP para conferência de tecnologia",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400",
    cost: 350,
    company: "TechEvents",
    category: "Eventos",
    available: true,
  },
];

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria.silva@puc.br",
    course: "Ciência da Computação",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: "2",
    name: "Pedro Santos",
    email: "pedro.santos@puc.br",
    course: "Engenharia de Software",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana.costa@puc.br",
    course: "Sistemas de Informação",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
  },
  {
    id: "4",
    name: "Lucas Oliveira",
    email: "lucas.oliveira@puc.br",
    course: "Ciência da Computação",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
  },
  {
    id: "5",
    name: "Julia Ferreira",
    email: "julia.ferreira@puc.br",
    course: "Engenharia de Software",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julia",
  },
];
