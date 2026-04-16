import { useState } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { mockLeads, etapaLabel, type Lead, type LeadStatus } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, LayoutGrid, List, Phone, Mail, MapPin, ThermometerSun, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LeadDetail } from "@/components/LeadDetail";

const tempColor: Record<string, string> = {
  quente: "bg-destructive/15 text-destructive",
  morno: "bg-warning/15 text-warning",
  frio: "bg-info/15 text-info",
};

const statusColor: Record<string, string> = {
  novo: "bg-info/15 text-info",
  contatado: "bg-primary/15 text-primary",
  em_atendimento: "bg-warning/15 text-warning",
  qualificado: "bg-success/15 text-success",
  proposta: "bg-accent/15 text-accent",
  negociacao: "bg-primary/15 text-primary",
  fechado: "bg-success/15 text-success",
  perdido: "bg-destructive/15 text-destructive",
};

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filtered = mockLeads.filter((l) => {
    const matchSearch = l.nome.toLowerCase().includes(search.toLowerCase()) ||
      l.telefone.includes(search) || l.origem.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "todos" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <CRMLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground text-sm">{filtered.length} leads encontrados</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "table" ? "default" : "outline"} size="icon" onClick={() => setViewMode("table")}><List className="h-4 w-4" /></Button>
            <Button variant={viewMode === "cards" ? "default" : "outline"} size="icon" onClick={() => setViewMode("cards")}><LayoutGrid className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome, telefone ou origem..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {(Object.keys(etapaLabel) as LeadStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{etapaLabel[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {viewMode === "table" ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Campanha</TableHead>
                    <TableHead>Etapa</TableHead>
                    <TableHead>Temp.</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Última Interação</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((lead) => (
                    <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLead(lead)}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{lead.nome}</p>
                          <p className="text-xs text-muted-foreground">{lead.telefone}</p>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{lead.origem}</Badge></TableCell>
                      <TableCell className="text-sm">{lead.campanha}</TableCell>
                      <TableCell><Badge className={`${statusColor[lead.status]} text-xs border-0`}>{lead.etapa_funil}</Badge></TableCell>
                      <TableCell><Badge className={`${tempColor[lead.temperatura]} text-xs border-0`}>{lead.temperatura}</Badge></TableCell>
                      <TableCell className="text-sm">{lead.responsavel}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(lead.ultima_interacao).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lead) => (
              <Card key={lead.id} className="cursor-pointer hover:border-primary/40 transition-colors" onClick={() => setSelectedLead(lead)}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{lead.nome}</p>
                      <p className="text-xs text-muted-foreground">{lead.cidade}</p>
                    </div>
                    <Badge className={`${tempColor[lead.temperatura]} text-xs border-0`}>{lead.temperatura}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge className={`${statusColor[lead.status]} text-xs border-0`}>{lead.etapa_funil}</Badge>
                    <Badge variant="outline" className="text-xs">{lead.origem}</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.telefone}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{lead.responsavel}</span>
                    <span>{new Date(lead.ultima_interacao).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex gap-1">
                    {lead.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedLead && <LeadDetail lead={selectedLead} />}
          </DialogContent>
        </Dialog>
      </div>
    </CRMLayout>
  );
}
