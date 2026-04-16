import { Lead, etapaLabel, type LeadStatus } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Phone, Mail, MapPin, Calendar, Clock, User, ThermometerSun, MessageCircle,
  ArrowRight, Plus, ExternalLink, Webhook, RotateCcw,
} from "lucide-react";

const tempColor: Record<string, string> = {
  quente: "bg-destructive/15 text-destructive",
  morno: "bg-warning/15 text-warning",
  frio: "bg-info/15 text-info",
};

const timeline = [
  { data: "15/04/2025 14:30", evento: "Mensagem automática enviada via WhatsApp", tipo: "automacao" },
  { data: "14/04/2025 10:15", evento: "Lead qualificado por Carlos", tipo: "manual" },
  { data: "13/04/2025 16:45", evento: "Primeiro contato realizado", tipo: "manual" },
  { data: "12/04/2025 09:00", evento: "Lead capturado via Instagram", tipo: "sistema" },
];

export function LeadDetail({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{lead.nome}</h2>
          <p className="text-sm text-muted-foreground">{lead.cidade} · {lead.origem}</p>
        </div>
        <Badge className={`${tempColor[lead.temperatura]} border-0`}>{lead.temperatura}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" />{lead.telefone}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" />{lead.email}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" />{lead.cidade}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><User className="h-4 w-4" />{lead.responsavel}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" />{new Date(lead.data_entrada).toLocaleDateString("pt-BR")}</div>
        <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" />{new Date(lead.ultima_interacao).toLocaleDateString("pt-BR")}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">{lead.campanha}</Badge>
        <Badge variant="outline">{lead.etapa_funil}</Badge>
        {lead.tags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
      </div>

      {lead.observacoes && (
        <div className="bg-muted/50 rounded-lg p-3 text-sm">
          <p className="font-medium text-xs text-muted-foreground mb-1">Observações</p>
          <p>{lead.observacoes}</p>
        </div>
      )}

      <Separator />

      <div>
        <h3 className="font-semibold text-sm mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline"><ArrowRight className="h-3 w-3 mr-1" />Mover Etapa</Button>
          <Button size="sm" variant="outline"><Plus className="h-3 w-3 mr-1" />Observação</Button>
          <Button size="sm" variant="outline" className="text-success border-success/30 hover:bg-success/10"><MessageCircle className="h-3 w-3 mr-1" />WhatsApp</Button>
          <Button size="sm" variant="outline"><Webhook className="h-3 w-3 mr-1" />Webhook</Button>
          <Button size="sm" variant="outline"><RotateCcw className="h-3 w-3 mr-1" />Retorno</Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold text-sm mb-3">Timeline</h3>
        <div className="space-y-3">
          {timeline.map((ev, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${ev.tipo === "automacao" ? "bg-primary" : ev.tipo === "manual" ? "bg-accent" : "bg-muted-foreground"}`} />
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="pb-3">
                <p className="text-sm">{ev.evento}</p>
                <p className="text-xs text-muted-foreground">{ev.data}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
