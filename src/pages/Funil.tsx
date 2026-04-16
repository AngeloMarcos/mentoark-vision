import { useState } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { mockLeads, etapaLabel, type LeadStatus, type Lead } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, User, Flame, Snowflake, ThermometerSun } from "lucide-react";

const etapas: LeadStatus[] = ["novo", "contatado", "em_atendimento", "qualificado", "proposta", "negociacao", "fechado", "perdido"];

const etapaCor: Record<LeadStatus, string> = {
  novo: "border-t-info",
  contatado: "border-t-primary",
  em_atendimento: "border-t-warning",
  qualificado: "border-t-success",
  proposta: "border-t-accent",
  negociacao: "border-t-primary",
  fechado: "border-t-success",
  perdido: "border-t-destructive",
};

const tempIcon: Record<string, any> = { quente: Flame, morno: ThermometerSun, frio: Snowflake };
const tempColor: Record<string, string> = { quente: "text-destructive", morno: "text-warning", frio: "text-info" };

function daysSince(date: string) {
  return Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
}

export default function FunilPage() {
  const [leads] = useState<Lead[]>(mockLeads);

  return (
    <CRMLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Funil de Vendas</h1>
          <p className="text-muted-foreground text-sm">Pipeline visual da operação comercial</p>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4">
          {etapas.map((etapa) => {
            const etapaLeads = leads.filter((l) => l.status === etapa);
            const valorTotal = etapaLeads.reduce((s, l) => s + (l.valor_potencial || 0), 0);
            return (
              <div key={etapa} className="min-w-[260px] flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{etapaLabel[etapa]}</h3>
                    <Badge variant="secondary" className="text-xs">{etapaLeads.length}</Badge>
                  </div>
                  {valorTotal > 0 && (
                    <span className="text-xs text-muted-foreground">R$ {(valorTotal / 1000).toFixed(1)}k</span>
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  {etapaLeads.map((lead) => {
                    const TempIcon = tempIcon[lead.temperatura];
                    const dias = daysSince(lead.ultima_interacao);
                    return (
                      <Card key={lead.id} className={`p-3 cursor-pointer hover:border-primary/40 transition-colors border-t-2 ${etapaCor[etapa]}`}>
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <p className="font-medium text-sm">{lead.nome}</p>
                            <TempIcon className={`h-4 w-4 ${tempColor[lead.temperatura]}`} />
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs">{lead.origem}</Badge>
                            <Badge variant="secondary" className="text-xs">{lead.campanha}</Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{lead.responsavel}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{dias}d</span>
                          </div>
                          {lead.valor_potencial && (
                            <p className="text-xs font-medium text-primary">R$ {lead.valor_potencial.toLocaleString("pt-BR")}</p>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                  {etapaLeads.length === 0 && (
                    <div className="border border-dashed border-border rounded-lg p-6 text-center text-xs text-muted-foreground">
                      Nenhum lead
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CRMLayout>
  );
}
