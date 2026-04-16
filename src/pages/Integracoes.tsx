import { CRMLayout } from "@/components/CRMLayout";
import { mockIntegracoes } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Workflow, MessageCircle, BarChart3, Users, Database, Webhook, RefreshCw,
  CheckCircle2, Loader2, AlertTriangle, XCircle, Power,
} from "lucide-react";

const iconMap: Record<string, any> = {
  Workflow, MessageCircle, BarChart3, Users, Database, Webhook, RefreshCw,
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  conectado: { label: "Conectado", color: "bg-success/15 text-success", icon: CheckCircle2 },
  sincronizando: { label: "Sincronizando", color: "bg-info/15 text-info", icon: Loader2 },
  atencao: { label: "Atenção", color: "bg-warning/15 text-warning", icon: AlertTriangle },
  erro: { label: "Erro", color: "bg-destructive/15 text-destructive", icon: XCircle },
  inativo: { label: "Inativo", color: "bg-muted text-muted-foreground", icon: Power },
};

export default function IntegracoesPage() {
  return (
    <CRMLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground text-sm">Status das conexões e serviços externos</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockIntegracoes.map((integ) => {
            const Icon = iconMap[integ.icone] || Workflow;
            const st = statusConfig[integ.status];
            const StIcon = st.icon;
            return (
              <Card key={integ.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{integ.nome}</p>
                        <p className="text-xs text-muted-foreground">{integ.descricao}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge className={`${st.color} text-xs border-0 gap-1`}>
                      <StIcon className={`h-3 w-3 ${integ.status === "sincronizando" ? "animate-spin" : ""}`} />
                      {st.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{integ.ultima_sincronizacao}</span>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    {integ.status === "erro" ? "Reconectar" : integ.status === "inativo" ? "Ativar" : "Configurar"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </CRMLayout>
  );
}
