# App Scholar — FATEC Jacareí
**Disciplina:** Programação para Dispositivos Móveis I  
**Professor:** André Olímpio  
**Curso:** Desenvolvimento de Software Multiplataforma

---

## Como rodar

### Pré-requisitos
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (Android ou iOS)

### Instalação

```bash
# 1. Entrar na pasta do projeto
cd AppScholar

# 2. Instalar dependências
npm install

# 3. Iniciar o servidor de desenvolvimento
npx expo start
```

Escaneie o QR Code com o app **Expo Go** para testar no celular.  
Ou pressione `w` para abrir no navegador (web).

### Credenciais de teste
| Login | Senha |
|-------|-------|
| `admin` | `1234` |
| `admin@fatec.sp.gov.br` | `1234` |

---

## Estrutura do projeto

```
AppScholar/
├── App.js                        # Entry point
├── app.json                      # Config Expo
├── package.json
└── src/
    ├── components/
    │   └── index.js              # FormInput, SelectInput, PrimaryButton, Badge…
    ├── context/
    │   └── AppContext.js         # useContext — auth + dados globais
    ├── hooks/
    │   └── index.js              # useForm, useFeedback, useBoletim
    ├── navigation/
    │   └── AppNavigator.js       # React Navigation (Native Stack)
    ├── screens/
    │   ├── LoginScreen.js        # Tela 1
    │   ├── DashboardScreen.js    # Tela 2
    │   ├── CadastroAlunosScreen.js      # Tela 3
    │   ├── CadastroProfessoresScreen.js # Tela 4
    │   ├── CadastroDisciplinasScreen.js # Tela 5
    │   └── BoletimScreen.js             # Tela 6
    ├── services/
    │   └── validators.js         # Regras de validação e formatadores
    └── styles/
        └── theme.js              # Cores, tipografia, espaçamentos
```

---

## Hooks utilizados

| Hook | Onde | Para quê |
|------|------|----------|
| `useState` | Todos os formulários | Campos, erros, estados de tela |
| `useEffect` | Dashboard, Boletim, Disciplinas | Inicialização, carregamento de dados simulados |
| `useContext` | Todas as telas | Auth, dados globais (alunos, professores, disciplinas) |
| `useCallback` | `useForm` (hook customizado) | Otimização de handlers |

---

## Telas implementadas

1. **Login** — validação de campos, autenticação mockada, redirecionamento  
2. **Dashboard** — stats dinâmicos, cards de navegação, data via `useEffect`  
3. **Cadastro de Alunos** — todos os campos do PDF, validação, máscara de CEP/telefone  
4. **Cadastro de Professores** — todos os campos obrigatórios, validação  
5. **Cadastro de Disciplinas** — lista de professores carregada do contexto via `useEffect`  
6. **Boletim** — N1, N2, média, situação (Aprovado/Recuperação/Reprovado), resumo estatístico  

---

## Dados mockados (Parte 1)

Os dados são armazenados em memória via `useState` no `AppContext`.  
Ao cadastrar alunos, professores ou disciplinas, os contadores do Dashboard atualizam em tempo real.  
O boletim contém dados simulados para os 3 alunos pré-cadastrados.

Na **Parte 2** do projeto, os dados serão persistidos via API REST + PostgreSQL.
