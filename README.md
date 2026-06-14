# Pet Today — Frontend Mobile (Expo / React Native)

Tela única (UC14 / RF14) de **gerenciamento de medicamentos** que **consome** a API NestJS
em `codigo/` — o backend **não é alterado**, apenas consumido. A UI segue o Design System
do projeto (paleta orgânica, cores vivas só em estados semânticos, um único botão primário).
Referência completa em `docs/pet-today-contexto-projeto.md`.

## Estrutura

```
frontend-mobile/
├── App.js                  # raiz (SafeArea + tela)
├── index.js                # entry do Expo (registerRootComponent)
├── app.json                # config Expo (extra.apiBaseUrl)
├── .env.example            # EXPO_PUBLIC_API_URL
└── src/
    ├── config/env.js       # resolve a URL base da API
    ├── api/client.js       # cliente HTTP (1 método por endpoint)
    ├── hooks/              # useMedications (estado + CRUD), useToast
    ├── utils/             # date, dose (estados derivados), uuid
    ├── data/sample.js      # dados de demonstração (fallback offline)
    ├── theme/tokens.js     # design tokens do projeto
    ├── components/        # Header, SearchBar, Tabs, MedCard, Field, Toast
    ├── modals/            # FormModal (cadastro/edição), SettingsModal
    └── screens/MedicationsScreen.js
```

## Endpoints consumidos

| Ação | Endpoint |
|---|---|
| Listar tratamentos ativos | `GET /medications?status=active` |
| Cadastrar | `POST /medications` |
| Editar | `PUT /medications/:id` |
| Pausar / Concluir / Reativar | `PATCH /medications/:id/status` |
| Remover | `DELETE /medications/:id` |
| Status de conexão | `GET /health` |

> Doses do dia (feito/agora/faltam/esquecido e "marcar como feito") são **derivadas no cliente**
> a partir de `administrationTimes`/`startDate`/`endDate`. O backend não tem log de doses, então
> a marcação fica em estado local; CRUD e mudança de status são reais (otimistas).

---

## Como rodar front + back juntos

Pré-requisitos: **Node 18+** e **Docker** (ou um PostgreSQL local).

### 1. Backend (`codigo/`)

```powershell
# a partir da raiz do repositório, entre na pasta do backend
cd codigo

# 1.1 Banco PostgreSQL (caminho rápido via Docker)
docker run --name pettoday-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=pet_today -p 5432:5432 -d postgres:16

# 1.2 Variáveis de ambiente
Copy-Item .env.example .env
#   .env já aponta para postgres://postgres:postgres@localhost:5432/pet_today

# 1.3 Dependências, migrações e start
npm install
npm run migration:run
npm run dev
```

O backend sobe em **http://localhost:3333/api/v1** (CORS já habilitado).
Teste rápido: abra `http://localhost:3333/api/v1/health` no navegador.

### 2. Frontend (`codigo/frontend-mobile/`)

Em **outro terminal**:

```powershell
cd codigo/frontend-mobile
npm install
npm run web      # abre no Chrome em http://localhost:8081
```

Como o Expo Web roda em `http://localhost`, **não há bloqueio de mixed content** ao chamar
`http://localhost:3333` — a integração funciona direto no Chrome do PC.

Outros alvos:
- `npm start` → menu do Expo (tecle **w** para web, **a** Android, **i** iOS).
- **Celular físico** (app Expo Go): rode `npm start`, escaneie o QR. Como o aparelho não enxerga
  `localhost` do PC, abra o sino (topo direito) e troque a URL para o IP da máquina,
  ex.: `http://192.168.0.10:3333/api/v1` (ou defina `EXPO_PUBLIC_API_URL` no `.env`).

### 3. Verificar a integração

1. Com o backend no ar, o indicador em **sino → "Conexão com a API"** mostra **Conectado**
   (sem o badge `demo` no header).
2. Toque no **+** (FAB), use **Gerar** para um UUID de pet, preencha e **Cadastrar** →
   o `POST /medications` cria o registro e ele aparece na lista.
3. Em um card, **Ver notas do veterinário → Pausar/Concluir/Remover** dispara
   `PATCH`/`DELETE` reais; "Marcar como feito" registra a dose localmente.

> Se o backend estiver fora do ar, a tela carrega **dados de demonstração** (badge `demo`)
> para você ver o layout completo mesmo sem integração.
