

## Módulo "Disparos em Massa"

Adicionar um novo módulo isolado ao MentoArk para envio em massa de mensagens WhatsApp via Evolution API, com controle anti-ban (intervalos randômicos, pausas a cada N mensagens, janela de horário).

### 1. Banco de dados (migration nova)

Criar duas tabelas com RLS por `user_id` seguindo o padrão do projeto:

- **`disparos`**: campanhas de disparo (nome, status, contadores, configuração anti-ban, janela de horário)
- **`disparo_logs`**: log individual por lead disparado (status, tentativas, mensagem renderizada, timestamps)

RLS: `auth.uid() = user_id OR has_role(auth.uid(), 'admin')` em todas as operações, com `WITH CHECK (auth.uid() = user_id)` em INSERT — seguindo o padrão das tabelas `contatos`, `campanhas` e `agentes`.

Ajuste em relação ao SQL enviado: usar a policy padrão do projeto (separada por comando + admin role), em vez de `for all using (auth.uid() = user_id)`, para manter consistência.

### 2. Rota e navegação

- **`src/App.tsx`**: adicionar `import DisparosPage from "./pages/Disparos"` e a rota `/disparos` com `<ProtectedRoute>`, posicionada após `/whatsapp`.
- **`src/components/AppSidebar.tsx`**: adicionar item `{ title: "Disparos", url: "/disparos", icon: Send }` logo após "WhatsApp" no array `items`. Importar `Send` do lucide-react.

### 3. Página `src/pages/Disparos.tsx`

Estrutura padrão do projeto: `<CRMLayout>` + header com ícone `Send`, título "Disparos em Massa", subtítulo, botão "+ Nova Campanha de Disparo".

**Listagem (grid de cards 1-3 colunas):**
- Cada card mostra: nome, badge de status (cores: rascunho=cinza, em_andamento=azul, pausado=warning, concluido=success, cancelado=destructive), barra de progresso (`enviados / total_leads`), contador `falhas`, data de criação.
- Ações por card conforme status:
  - `rascunho` → botões **Iniciar**, **Editar**, **Excluir**
  - `em_andamento` → **Pausar**, **Ver Logs**
  - `pausado` → **Retomar**, **Cancelar**, **Ver Logs**
  - `concluido` / `cancelado` → **Ver Logs**, **Duplicar**, **Excluir**

**Estado vazio:** card central com ícone Send, "Nenhuma campanha de disparo ainda" e botão "Criar primeira campanha".

**Dialog "Nova/Editar Campanha" — 3 abas (Tabs):**

- **Aba 1 — Identificação:** nome da campanha, seleção de lista de contatos (lê `listas` do usuário), preview de quantos leads serão importados de `contatos` filtrando por `lista_id`.
- **Aba 2 — Mensagem:** Textarea para template com suporte a variáveis `{{nome}}`, `{{empresa}}`, `{{telefone}}`. Painel "Preview" ao lado mostrando como ficará para o primeiro contato da lista. Contador de caracteres.
- **Aba 3 — Anti-Ban:** intervalo mínimo/máximo (segundos), pausa a cada N mensagens, duração da pausa (minutos), horário início/fim. Texto explicativo: "Configurações recomendadas para reduzir risco de bloqueio do WhatsApp."

**Dialog "Logs do Disparo":**
- Tabela com nome, telefone, status (badge colorido), tentativas, enviado_at.
- Filtros por status (todos / pending / sent / failed).
- Botão "Reenviar falhas" que reseta `status='pending'` nos logs com `status='failed'`.

### 4. Lógica de envio (client-side, MVP)

A execução do disparo roda no navegador enquanto a aba `/disparos` estiver aberta. Ao clicar **Iniciar**:

1. UPDATE `disparos.status='em_andamento'`, `data_inicio=now()`.
2. Se for primeiro start: gerar `disparo_logs` para cada contato da lista (status=`pending`, mensagem renderizada com substituição de variáveis).
3. Loop: pegar próximo log `pending`, verificar janela de horário (se fora, aguardar), enviar via Evolution API do agente ativo (lê do primeiro registro de `agentes` ou da `integracoes_config` tipo `evolution`), atualizar log para `sent`/`failed` e incrementar contadores em `disparos`.
4. Aguardar `random(intervalo_min, intervalo_max)` segundos entre envios.
5. A cada `pausa_a_cada` envios, aguardar `pausa_duracao` minutos.
6. Ao concluir todos: `status='concluido'`, `data_fim=now()`.
7. Botão **Pausar** seta uma flag local + UPDATE `status='pausado'` que interrompe o loop.

Aviso visível ao usuário no card em andamento: "Mantenha esta aba aberta durante o disparo."

### 5. Detalhes técnicos

- **Padrões de código:** seguir exatamente `src/pages/Campanhas.tsx` e `src/pages/Agentes.tsx` para CRUD, loading, toasts (`sonner`), Dialog, Tabs.
- **Dados:** `useEffect` + `supabase.from(...)` + `useState`. Filtrar tudo por `user.id` do `useAuth()`.
- **Evolution API:** POST para `${server_url}/message/sendText/${instancia}` com header `apikey` e body `{ number, text }`. Tratar erro 4xx/5xx como `failed` e incrementar `tentativas`.
- **Variáveis no template:** `replaceAll('{{nome}}', contato.nome ?? '')`, idem para `empresa` e `telefone`.
- **Sem realtime nesta etapa** — refresh manual + recarregar ao fechar dialog de logs.

### 6. Arquivos tocados

```text
NOVOS:
  supabase/migrations/<timestamp>_disparos.sql
  src/pages/Disparos.tsx

EDITADOS (mínimo):
  src/App.tsx                       (+1 import, +1 rota)
  src/components/AppSidebar.tsx     (+1 item, +1 ícone)
```

Nenhum outro arquivo será alterado. Nenhuma página, componente UI ou hook existente será modificado.

