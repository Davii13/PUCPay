# 🎮 Sistema de Gamificação - Guia de Configuração

## ✅ O que foi implementado

### Backend
1. **Modelos JPA**
   - `Badge.java` - 8 tipos de badges diferentes
   - `AlunoBadge.java` - Relacionamento aluno-badges
   - Campos adicionados em `Aluno.java`: xpTotal, nivel, totalResgates, totalMoedasRecebidas

2. **DAOs**
   - BadgeDAO, BadgeDAOImpl
   - AlunoBadgeDAO, AlunoBadgeDAOImpl
   - AlunoDAO.getLeaderboard()

3. **Service**
   - GamificacaoService com lógica completa

4. **Controller**
   - GamificacaoController com 3 endpoints

5. **Integração**
   - TransacaoService integrado (resgate vantagem + receber moedas)
   - AuthService retorna dados de gamificação no login

### Frontend
1. **Páginas**
   - `/conquistas` - Página de badges e progresso
   - `/leaderboard` - Ranking de alunos

2. **Dashboard**
   - Cards de Conquistas e Ranking no menu rápido

3. **AuthContext**
   - Campos de gamificação adicionados ao User

## 🚀 Como Testar

### 1. Iniciar Backend
```bash
cd back-end/WebSystem/WebSystem
mvn spring-boot:run
```

### 2. Iniciar Frontend
```bash
cd front-end
npm run dev
```

### 3. Testar Gamificação

1. **Login como aluno**
   - Email: qualquer aluno existente
   - Os campos de gamificação serão carregados

2. **Ir ao Marketplace**
   - Resgatar uma vantagem
   - Sistema ganha +10 XP automaticamente

3. **Verificar Conquistas**
   - Clique em "Conquistas" no Dashboard
   - Veja seu nível, XP e badges desbloqueados

4. **Ver Leaderboard**
   - Clique em "Ranking" no Dashboard
   - Veja sua posição e de outros alunos

## 📊 Badges Disponíveis

| Badge | Critério | XP |
|-------|----------|-----|
| 🎯 Primeiros Passos | 1º resgate | 50 |
| 🎁 Colecionador | 5 resgates | 100 |
| 🛍️ Viciado em Descontos | 10 resgates | 150 |
| ⭐ Especialista em Ofertas | 25 resgates | 250 |
| 💯 Centenas | 100 moedas recebidas | 100 |
| 💰 Milionário | 500 moedas recebidas | 200 |
| 👑 Super Milionário | 1000 moedas recebidas | 300 |
| 🏆 Lenda | 5000 moedas recebidas | 500 |

## 🔧 Endpoints API

```
GET  /api/gamificacao/aluno/{id}/badges      → Lista de badges do aluno
GET  /api/gamificacao/aluno/{id}/progresso   → XP, nível, resgates
GET  /api/gamificacao/leaderboard            → Top 50 alunos
```

## ❓ Troubleshooting

### Gamificação não aparece
1. Verifique se o backend está rodando
2. Abra o DevTools (F12) e veja a aba Console
3. Procure por erros de rede ou JavaScript

### Badges não desbloqueiam
1. Verifique nos logs do backend: `[GAMIFICACAO]`
2. Confirme que a tabela `badges` foi criada
3. Resgate uma vantagem para gerar logs

### Leaderboard vazio
1. Verifique se há alunos com XP > 0
2. Resgatar vantagens para ganhar XP
3. Atualizar a página (F5)

## 📝 Notas

- Nível é calculado como: (XP Total / 100) + 1
- XP mínimo por ação: 10 (resgate de vantagem)
- XP máximo por ação: 50 (recebimento de moedas)
- Badges são desbloqueados automaticamente ao atingir critérios
