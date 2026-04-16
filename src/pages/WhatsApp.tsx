import { useState } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { mockConversas, type ConversaWhatsApp } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Bot, User, ExternalLink, Eye, Phone, MessageCircle } from "lucide-react";

const statusLabel: Record<string, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  finalizado: "Finalizado",
};

const statusColor: Record<string, string> = {
  pendente: "bg-warning/15 text-warning",
  em_andamento: "bg-success/15 text-success",
  finalizado: "bg-muted text-muted-foreground",
};

export default function WhatsAppPage() {
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = mockConversas.filter((c) => {
    const matchFilter = filter === "todos" || c.status_atendimento === filter;
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase()) || c.telefone.includes(search);
    return matchFilter && matchSearch;
  });

  return (
    <CRMLayout>
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">WhatsApp</h1>
          <p className="text-muted-foreground text-sm">Acompanhamento operacional de conversas</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockConversas.filter((c) => c.status_atendimento === "pendente").length}</p>
              <p className="text-xs text-muted-foreground">Pendentes</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockConversas.filter((c) => c.status_atendimento === "em_andamento").length}</p>
              <p className="text-xs text-muted-foreground">Em andamento</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-muted-foreground">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{mockConversas.filter((c) => c.status_atendimento === "finalizado").length}</p>
              <p className="text-xs text-muted-foreground">Finalizados</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar conversa..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendente">Pendentes</SelectItem>
              <SelectItem value="em_andamento">Em andamento</SelectItem>
              <SelectItem value="finalizado">Finalizados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          {filtered.map((conv) => (
            <Card key={conv.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${conv.ativo ? "bg-success/15" : "bg-muted"}`}>
                  <MessageCircle className={`h-5 w-5 ${conv.ativo ? "text-success" : "text-muted-foreground"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{conv.nome}</p>
                    {conv.tipo === "automacao" ? (
                      <Badge variant="outline" className="text-xs gap-1"><Bot className="h-3 w-3" />Auto</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs gap-1"><User className="h-3 w-3" />Humano</Badge>
                    )}
                    <Badge className={`${statusColor[conv.status_atendimento]} text-xs border-0`}>{statusLabel[conv.status_atendimento]}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">{conv.ultima_mensagem}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{conv.telefone}</span>
                    <span>{new Date(conv.horario).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" title="Ver lead"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Integração externa"><ExternalLink className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CRMLayout>
  );
}
