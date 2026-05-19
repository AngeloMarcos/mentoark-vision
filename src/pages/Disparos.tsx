import { useState, useMemo } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Send, ShieldCheck, ShieldAlert, Shield, Users, 
  Upload, Clock, Calendar, AlertTriangle, CheckCircle2, 
  AlertOctagon, XCircle, Play, Pause, Square, FileText, Settings2, Plus, X
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const Steps = ["Lista de Contatos", "Mensagem", "Proteção Anti-ban", "Revisar e Agendar"];

export default function DisparosPage() {
  const [step, setStep] = useState(0);

  return (
    <CRMLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Novo Disparo em Massa</h1>
          <div className="flex gap-2">
            {Steps.map((s, i) => (
              <Badge key={s} variant={i === step ? "default" : "outline"} className="px-3 py-1">
                {i + 1}. {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="min-h-[500px]">
          {step === 0 && <StepContacts />}
          {step === 1 && <StepMessage />}
          {step === 2 && <StepAntiBan />}
          {step === 3 && <StepReview />}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Voltar</Button>
          <Button onClick={() => setStep(Math.min(3, step + 1))} disabled={step === 3}>
            {step === 3 ? "Agendar Disparo" : "Próximo"}
          </Button>
        </div>
      </div>
    </CRMLayout>
  );
}

function StepContacts() {
  return (
    <Tabs defaultValue="tags" className="w-full">
      <TabsList>
        <TabsTrigger value="tags">Por Tag</TabsTrigger>
        <TabsTrigger value="estagio">Por Estágio</TabsTrigger>
        <TabsTrigger value="csv">Importar CSV</TabsTrigger>
      </TabsList>
      <TabsContent value="tags" className="p-4 border rounded-lg bg-card">
        <div className="space-y-4">
          <p className="text-sm font-medium">Selecione as tags de contatos:</p>
          <div className="grid grid-cols-2 gap-2">
            {["Lead", "VIP", "Cliente Ativo"].map(t => (
              <div key={t} className="flex items-center space-x-2">
                <input type="checkbox" id={t} className="h-4 w-4" />
                <label htmlFor={t}>{t} (120 contatos)</label>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="estagio" className="p-4 border rounded-lg bg-card">
        <p className="text-sm">Selecione o estágio do funil para filtrar contatos.</p>
      </TabsContent>
      <TabsContent value="csv" className="p-4 border rounded-lg bg-card">
        <p className="text-sm">Faça upload do seu arquivo CSV para importar contatos.</p>
      </TabsContent>
    </Tabs>
  );
}

function StepMessage() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Label>Conteúdo da Mensagem</Label>
        <Textarea className="min-h-[150px]" placeholder="Olá {{primeiro_nome}}..." />
        <div className="flex gap-2">
          {["Nome", "Telefone", "Empresa"].map(v => (
            <Button key={v} size="sm" variant="outline" className="text-xs">+{v}</Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StepAntiBan() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Seguro", icon: ShieldCheck, color: "text-green-500" },
          { label: "Moderado", icon: Shield, color: "text-yellow-500" },
          { label: "Rápido", icon: ShieldAlert, color: "text-red-500" }
        ].map(p => (
          <Card key={p.label} className="p-4 cursor-pointer hover:border-primary">
            <p.icon className={`h-8 w-8 mb-2 ${p.color}`} />
            <h3 className="font-bold">{p.label}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StepReview() {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-bold mb-4">Resumo</h3>
        <p>Destinatários: 450</p>
        <p>Instâncias: 3 (Saudáveis)</p>
        <p>Estimativa de tempo: 2h 30m</p>
      </Card>
    </div>
  );
}
