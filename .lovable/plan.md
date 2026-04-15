

# MentoArk CRM — Plano de Implementação

## Visão Geral
CRM operacional completo com 7 módulos principais, autenticação Supabase, tema dark/light com toggle, dados mockados em PT-BR, e interface premium seguindo a identidade visual MentoArk (azul primário, laranja accent, estética tecnológica e sóbria).

## Design System
- Importar o sistema de cores do projeto MentoArk Chatbot (azul `hsl(217 91% 45%)`, laranja accent, dark/light themes)
- Glass effects, glow utilities, shadows premium
- Toggle dark/light no header
- Sidebar colapsável com ícones (Shadcn Sidebar)
- Toda interface em português do Brasil

## Autenticação
- Login e cadastro com Supabase Auth (email/senha)
- Tela de login com branding MentoArk
- Rotas protegidas para o CRM
- Tela de reset de senha

## Estrutura de Páginas

### 1. Dashboard Principal
- Cards de KPI: total leads, novos hoje, em atendimento, convertidos, taxa de conversão, CPL, campanhas ativas, mensagens WhatsApp
- Gráficos com Recharts: evolução por período, leads por origem, conversão por etapa
- Ranking de campanhas
- Resumo de performance em tempo real

### 2. Gestão de Leads
- Tabela completa com filtros avançados, busca, ordenação, paginação
- Toggle entre visualização tabela e cards
- Colunas: nome, telefone, email, origem, campanha, status, etapa funil, responsável, temperatura, data entrada, última interação, cidade
- Tags e status visuais coloridos

### 3. Detalhe do Lead
- Modal ou página com dados completos do contato
- Timeline de eventos e histórico de interações
- Bloco de resumo de atendimento
- Ações rápidas: atualizar status, mover funil, adicionar observação, abrir WhatsApp, disparar webhook

### 4. Funil de Vendas (Kanban)
- Pipeline visual com colunas: Novo Lead → Contato Iniciado → Em Atendimento → Qualificado → Proposta Enviada → Negociação → Fechado → Perdido
- Cards com nome, origem, campanha, temperatura, responsável, tempo desde última interação
- Drag and drop simulado entre colunas
- Contadores por etapa

### 5. Módulo WhatsApp
- Lista de conversas com nome, telefone, status, última mensagem, horário
- Indicadores visuais: atendimento ativo, automação vs humano
- Filtros: pendente, em andamento, finalizado
- Botões para abrir lead e acionar integração externa
- Dados mockados, pronto para integração futura

### 6. Meta Ads / Campanhas
- Tabela de campanhas: nome, status, investimento, impressões, cliques, CTR, leads, CPL, conversões
- Gráficos comparativos entre campanhas
- Cards resumidos de performance
- Filtros por data e campanha

### 7. Integrações
- Cards elegantes para cada integração: n8n, WhatsApp, Meta Ads, CRM externo, banco de dados, webhooks, sincronização
- Status visual: conectado, sincronizando, atenção, erro, inativo
- Última sincronização e ação rápida por integração

## Dados Mockados
- ~30 leads fictícios com nomes, cidades, campanhas em PT-BR
- 5-6 campanhas fictícias com métricas realistas
- Conversas WhatsApp simuladas
- Dados de integração com status variados

## Tecnologias
- React + TypeScript + Tailwind
- Shadcn UI (Sidebar, Tables, Cards, Tabs, Dialog, etc.)
- Recharts para gráficos
- Supabase Auth para autenticação
- React Router para navegação
- Lucide icons

