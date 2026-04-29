# App Scholar — FATEC Jacareí

**Disciplina:** Programação para Dispositivos Móveis I  
**Professor:** André Olímpio  
**Curso:** Desenvolvimento de Software Multiplataforma

---

## ⚙️ Versões utilizadas

### Mobile

- Expo SDK: 54
- React Native: 0.81.5
- React: 19.1.0

### Backend

- Node.js: 18+
- Express: 4.x
- PostgreSQL: 18

---

## 🏗️ Arquitetura

O projeto é dividido em duas partes:

- **Mobile** (`/src`) — React Native + Expo Go
- **Backend** (`/backend`) — Node.js + Express + PostgreSQL

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 18+
- PostgreSQL instalado e rodando
- App **Expo Go** no celular (Android ou iOS)
- Celular e computador na **mesma rede Wi-Fi**

---

### 1. Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar o .env com suas credenciais do PostgreSQL

# Criar o banco de dados
psql -U postgres -c "CREATE DATABASE appscholar;"

# Rodar as migrations
psql -U postgres -d appscholar -f database/migrations.sql

# Gerar hash da senha e atualizar o seed.sql
node -e "const b = require('bcrypt'); b.hash('fatec123', 10).then(console.log)"
# Copiar o hash gerado e colar no seed.sql

# Rodar o seed
psql -U postgres -d appscholar -f database/seed.sql

# Iniciar o servidor
npm run dev
```

O servidor iniciará na porta `3000`.

---

### 2. Mobile

```bash
# Entrar na pasta do projeto
cd AppScholar

# Instalar dependências
npm install

# Configurar o IP do backend em src/services/api.js
# baseURL: 'http://SEU_IP_LOCAL:3000/api'
# Para descobrir seu IP: ipconfig (Windows) ou ifconfig (Mac/Linux)

# Iniciar o servidor de desenvolvimento
npx expo start
```

Escaneie o QR Code com o app **Expo Go** para testar no celular.

> ⚠️ Caso ocorra erro ao rodar:
>
> - Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi
> - Ou utilize: `npx expo start --tunnel`

---

## 🔐 Credenciais de teste

| Login                     | Senha      |
| ------------------------- | ---------- |
| `alisson@fatec.sp.gov.br` | `fatec123` |

---

## 📁 Estrutura do projeto

```
AppScholar/
├── App.js                               # Entry point
├── app.json                             # Config Expo
├── package.json
├── assets/
│   └── icon.png
├── backend/
│   ├── server.js                        # Entry point do backend
│   ├── package.json
│   ├── .env.example                     # Template de variáveis de ambiente
│   ├── database/
│   │   ├── index.js                     # Pool de conexão PostgreSQL
│   │   ├── migrations.sql               # Criação das tabelas
│   │   └── seed.sql                     # Dados iniciais
│   ├── middleware/
│   │   └── auth.js                      # Validação JWT
│   ├── controllers/
│   │   ├── authController.js            # Login + JWT
│   │   ├── alunosController.js
│   │   ├── professoresController.js
│   │   ├── disciplinasController.js
│   │   ├── notasController.js
│   │   └── boletimController.js
│   └── routes/
│       ├── auth.js
│       ├── alunos.js
│       ├── professores.js
│       ├── disciplinas.js
│       ├── notas.js
│       └── boletim.js
└── src/
├── context/
│   └── AppContext.js                # Contexto global
├── hooks/
│   ├── useAuth.js                   # Autenticação + AsyncStorage
│   └── useFetch.js                  # Hook genérico para chamadas de API
├── navigation/
│   └── AppNavigator.js              # React Navigation (Native Stack)
├── screens/
│   ├── LoginScreen.js               # Tela 1
│   ├── DashboardScreen.js           # Tela 2
│   ├── CadastroAlunosScreen.js      # Tela 3
│   ├── CadastroProfessoresScreen.js # Tela 4
│   ├── CadastroDisciplinasScreen.js # Tela 5
│   ├── BoletimScreen.js             # Tela 6
│   ├── AlunosListScreen.js          # Listagem de alunos
│   ├── ProfessoresListScreen.js     # Listagem de professores
│   └── DisciplinasListScreen.js     # Listagem de disciplinas
├── services/
│   ├── api.js                       # Instância Axios + interceptors JWT
│   └── index.js                     # Serviços por entidade + ViaCEP + IBGE
└── styles/
└── theme.js                     # Cores, tipografia, espaçamentos
```

---

## 🌐 APIs implementadas

### Backend (REST)

| Método | Endpoint                  | Descrição                      |
| ------ | ------------------------- | ------------------------------ |
| `POST` | `/api/login`              | Autenticação — retorna JWT     |
| `GET`  | `/api/alunos`             | Lista todos os alunos          |
| `POST` | `/api/alunos`             | Cadastra novo aluno            |
| `GET`  | `/api/professores`        | Lista todos os professores     |
| `POST` | `/api/professores`        | Cadastra novo professor        |
| `GET`  | `/api/disciplinas`        | Lista todas as disciplinas     |
| `POST` | `/api/disciplinas`        | Cadastra nova disciplina       |
| `POST` | `/api/notas`              | Lança notas de um aluno        |
| `PUT`  | `/api/notas/:id`          | Atualiza notas                 |
| `GET`  | `/api/boletim/:matricula` | Consulta boletim por matrícula |

### APIs Externas

| API                  | Uso                                              |
| -------------------- | ------------------------------------------------ |
| **ViaCEP**           | Preenchimento automático de endereço pelo CEP    |
| **IBGE Localidades** | Lista de estados e cidades no cadastro de alunos |

---

## 🧠 Hooks utilizados

| Hook             | Onde                         | Para quê                              |
| ---------------- | ---------------------------- | ------------------------------------- |
| `useState`       | Todos os formulários         | Campos, erros, estados de tela        |
| `useEffect`      | Dashboard, cadastros         | Inicialização e carregamento de dados |
| `useContext`     | Todas as telas               | Estado global via AuthContext         |
| `useCallback`    | `useFetch`, `useFocusEffect` | Otimização de handlers                |
| `useFocusEffect` | Dashboard, listagens         | Atualiza dados ao voltar para a tela  |

---

## 🗄️ Banco de Dados (PostgreSQL)

### Tabelas

| Tabela        | Descrição                                                           |
| ------------- | ------------------------------------------------------------------- |
| `usuarios`    | Autenticação com perfil polimórfico                                 |
| `alunos`      | Dados cadastrais dos alunos                                         |
| `professores` | Dados dos professores                                               |
| `disciplinas` | Disciplinas com FK para professor                                   |
| `notas`       | Notas com `media` e `situacao` como colunas geradas automaticamente |

> `media` e `situacao` são `GENERATED ALWAYS AS` — calculadas pelo PostgreSQL automaticamente no INSERT.

---

## 📱 Telas implementadas

1. **Login** — autenticação real via JWT, mostrar/ocultar senha, logo do app
2. **Dashboard** — totais do banco atualizados com `useFocusEffect`, cards clicáveis
3. **Cadastro de Alunos** — ViaCEP + IBGE, validação, salva no banco
4. **Cadastro de Professores** — todos os campos obrigatórios, salva no banco
5. **Cadastro de Disciplinas** — lista de professores carregada do banco, salva no banco
6. **Boletim** — consulta por matrícula, exibe N1, N2, média e situação do banco
7. **Lista de Alunos** — listagem completa com FAB para novo cadastro
8. **Lista de Professores** — listagem completa com FAB para novo cadastro
9. **Lista de Disciplinas** — listagem completa com FAB para novo cadastro
