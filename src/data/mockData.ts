export type LeadStatus = "novo" | "contatado" | "em_atendimento" | "qualificado" | "proposta" | "negociacao" | "fechado" | "perdido";
export type LeadTemperatura = "frio" | "morno" | "quente";

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  origem: string;
  campanha: string;
  status: LeadStatus;
  etapa_funil: string;
  responsavel: string;
  temperatura: LeadTemperatura;
  data_entrada: string;
  ultima_interacao: string;
  cidade: string;
  observacoes: string;
  tags: string[];
  valor_potencial?: number;
}

export interface Campanha {
  id: string;
  nome: string;
  status: "ativa" | "pausada" | "finalizada";
  investimento: number;
  impressoes: number;
  cliques: number;
  ctr: number;
  leads_gerados: number;
  cpl: number;
  conversoes: number;
  custo_total: number;
  periodo: string;
}

export interface ConversaWhatsApp {
  id: string;
  lead_id: string;
  nome: string;
  telefone: string;
  status_atendimento: "pendente" | "em_andamento" | "finalizado";
  ultima_mensagem: string;
  horario: string;
  tipo: "automacao" | "humano";
  ativo: boolean;
}

export interface Integracao {
  id: string;
  nome: string;
  descricao: string;
  status: "conectado" | "sincronizando" | "atencao" | "erro" | "inativo";
  ultima_sincronizacao: string;
  icone: string;
}

const nomes = [
  "Ana Silva", "Carlos Souza", "Maria Oliveira", "João Santos", "Fernanda Costa",
  "Pedro Almeida", "Juliana Lima", "Rafael Pereira", "Camila Rodrigues", "Lucas Martins",
  "Beatriz Ferreira", "Gabriel Nascimento", "Larissa Ribeiro", "Thiago Carvalho", "Amanda Araújo",
  "Diego Gomes", "Patrícia Barbosa", "Bruno Rocha", "Vanessa Cardoso", "Felipe Correia",
  "Isabela Mendes", "Rodrigo Teixeira", "Natália Moura", "André Dias", "Carolina Pinto",
  "Marcelo Vieira", "Tatiana Lopes", "Ricardo Castro", "Aline Monteiro", "Eduardo Ramos",
];

const cidades = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre", "Salvador", "Brasília", "Fortaleza", "Recife", "Florianópolis"];
const origens = ["Instagram", "Facebook", "Google Ads", "WhatsApp", "Indicação", "Site", "LinkedIn"];
const campanhas = ["Captação Janeiro", "Lançamento Premium", "Remarketing Q1", "Black Friday", "Institucional 2024", "Lead Magnet Ebook"];
const responsaveis = ["Ana", "Carlos", "Fernanda", "Pedro"];
const etapas: LeadStatus[] = ["novo", "contatado", "em_atendimento", "qualificado", "proposta", "negociacao", "fechado", "perdido"];
const temperaturas: LeadTemperatura[] = ["frio", "morno", "quente"];
const tagsList = ["VIP", "Retorno", "Urgente", "Primeiro contato", "Indicação", "Reativação"];

const etapaLabel: Record<LeadStatus, string> = {
  novo: "Novo Lead",
  contatado: "Contato Iniciado",
  em_atendimento: "Em Atendimento",
  qualificado: "Qualificado",
  proposta: "Proposta Enviada",
  negociacao: "Negociação",
  fechado: "Fechado",
  perdido: "Perdido",
};

export { etapaLabel };

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const mockLeads: Lead[] = nomes.map((nome, i) => {
  const status = pick(etapas);
  return {
    id: `lead-${i + 1}`,
    nome,
    telefone: `(${11 + (i % 10)}) 9${String(Math.floor(Math.random() * 90000000 + 10000000))}`,
    email: `${nome.toLowerCase().replace(/ /g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}@email.com`,
    origem: pick(origens),
    campanha: pick(campanhas),
    status,
    etapa_funil: etapaLabel[status],
    responsavel: pick(responsaveis),
    temperatura: pick(temperaturas),
    data_entrada: randomDate(new Date("2024-10-01"), new Date("2025-04-14")),
    ultima_interacao: randomDate(new Date("2025-03-01"), new Date("2025-04-15")),
    cidade: pick(cidades),
    observacoes: i % 3 === 0 ? "Cliente demonstrou interesse no plano premium." : "",
    tags: [pick(tagsList), ...(i % 4 === 0 ? [pick(tagsList)] : [])].filter((v, idx, a) => a.indexOf(v) === idx),
    valor_potencial: Math.floor(Math.random() * 15000 + 500),
  };
});

export const mockCampanhas: Campanha[] = campanhas.map((nome, i) => {
  const investimento = Math.floor(Math.random() * 8000 + 1000);
  const impressoes = Math.floor(Math.random() * 150000 + 20000);
  const cliques = Math.floor(impressoes * (Math.random() * 0.04 + 0.01));
  const leads_gerados = Math.floor(cliques * (Math.random() * 0.15 + 0.05));
  const conversoes = Math.floor(leads_gerados * (Math.random() * 0.3 + 0.05));
  return {
    id: `camp-${i + 1}`,
    nome,
    status: i < 3 ? "ativa" : i < 5 ? "pausada" : "finalizada",
    investimento,
    impressoes,
    cliques,
    ctr: Number(((cliques / impressoes) * 100).toFixed(2)),
    leads_gerados,
    cpl: Number((investimento / leads_gerados).toFixed(2)),
    conversoes,
    custo_total: investimento,
    periodo: i < 3 ? "Abr 2025" : "Mar 2025",
  };
});

export const mockConversas: ConversaWhatsApp[] = mockLeads.slice(0, 15).map((lead, i) => ({
  id: `conv-${i + 1}`,
  lead_id: lead.id,
  nome: lead.nome,
  telefone: lead.telefone,
  status_atendimento: pick(["pendente", "em_andamento", "finalizado"] as const),
  ultima_mensagem: pick([
    "Olá, gostaria de saber mais sobre o serviço.",
    "Qual o valor do plano premium?",
    "Obrigado pelo atendimento!",
    "Posso agendar uma demonstração?",
    "Preciso de ajuda com meu pedido.",
    "Vou pensar e retorno amanhã.",
  ]),
  horario: randomDate(new Date("2025-04-14T08:00:00"), new Date("2025-04-15T18:00:00")),
  tipo: i % 3 === 0 ? "automacao" : "humano",
  ativo: i % 2 === 0,
}));

export const mockIntegracoes: Integracao[] = [
  { id: "int-1", nome: "n8n", descricao: "Orquestração de automações e fluxos de trabalho", status: "conectado", ultima_sincronizacao: "Há 2 minutos", icone: "Workflow" },
  { id: "int-2", nome: "WhatsApp Business API", descricao: "Envio e recebimento de mensagens automatizadas", status: "conectado", ultima_sincronizacao: "Há 1 minuto", icone: "MessageCircle" },
  { id: "int-3", nome: "Meta Ads API", descricao: "Sincronização de campanhas e métricas de anúncios", status: "sincronizando", ultima_sincronizacao: "Há 5 minutos", icone: "BarChart3" },
  { id: "int-4", nome: "CRM Externo", descricao: "Integração com sistema de CRM legado", status: "atencao", ultima_sincronizacao: "Há 1 hora", icone: "Users" },
  { id: "int-5", nome: "Banco de Dados", descricao: "Conexão com PostgreSQL para persistência de dados", status: "conectado", ultima_sincronizacao: "Há 30 segundos", icone: "Database" },
  { id: "int-6", nome: "Webhooks", descricao: "Endpoints de entrada e saída para eventos em tempo real", status: "conectado", ultima_sincronizacao: "Há 3 minutos", icone: "Webhook" },
  { id: "int-7", nome: "Sincronização de Contatos", descricao: "Sync bidirecional de contatos entre plataformas", status: "erro", ultima_sincronizacao: "Há 2 horas", icone: "RefreshCw" },
];

// Dashboard aggregated data
export const dashboardData = {
  totalLeads: mockLeads.length,
  novosHoje: mockLeads.filter((l) => l.data_entrada > "2025-04-14").length || 5,
  emAtendimento: mockLeads.filter((l) => l.status === "em_atendimento").length,
  convertidos: mockLeads.filter((l) => l.status === "fechado").length,
  taxaConversao: Number(((mockLeads.filter((l) => l.status === "fechado").length / mockLeads.length) * 100).toFixed(1)),
  custoMedioLead: 18.5,
  campanhasAtivas: mockCampanhas.filter((c) => c.status === "ativa").length,
  mensagensWhatsApp: 247,
  atendimentosAndamento: mockConversas.filter((c) => c.status_atendimento === "em_andamento").length,

  leadsPorOrigem: [
    { origem: "Instagram", quantidade: 8 },
    { origem: "Facebook", quantidade: 6 },
    { origem: "Google Ads", quantidade: 5 },
    { origem: "WhatsApp", quantidade: 4 },
    { origem: "Indicação", quantidade: 3 },
    { origem: "Site", quantidade: 2 },
    { origem: "LinkedIn", quantidade: 2 },
  ],

  evolucaoSemanal: [
    { semana: "Sem 1", leads: 12, conversoes: 2 },
    { semana: "Sem 2", leads: 18, conversoes: 4 },
    { semana: "Sem 3", leads: 22, conversoes: 5 },
    { semana: "Sem 4", leads: 15, conversoes: 3 },
    { semana: "Sem 5", leads: 28, conversoes: 7 },
    { semana: "Sem 6", leads: 24, conversoes: 6 },
  ],

  conversaoPorEtapa: [
    { etapa: "Novo", total: 30 },
    { etapa: "Contatado", total: 22 },
    { etapa: "Atendimento", total: 16 },
    { etapa: "Qualificado", total: 11 },
    { etapa: "Proposta", total: 8 },
    { etapa: "Negociação", total: 5 },
    { etapa: "Fechado", total: 3 },
  ],
};
