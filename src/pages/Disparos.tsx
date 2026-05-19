import { useState, useMemo, useEffect } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldCheck, ShieldAlert, Shield, Play, Pause, Square,
  Settings2, AlertOctagon, RefreshCw, Users, Upload, 
  Clock, Calendar, MessageSquare, Image as ImageIcon, 
  FileText, Headphones, AlertTriangle, CheckCircle2,
  Table as TableIcon
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import * as XLSX from "xlsx";

const Steps = ["Lista de Contatos", "Mensagem", "Proteção Anti-ban", "Revisar e Agendar"];

export default function DisparosPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);

  const [form, setForm] = useState({
    nome: "",
    tipo_midia: "texto" as "texto" | "imagem" | "audio" | "documento",
    mensagem: "",
    perfil_velocidade: "safe" as "safe" | "moderate" | "fast",
    janela_inicio: "08:00",
    janela_fim: "21:00",
    pausa_fins_semana: true,
    pausa_erros_consecutivos: true,
    limite_erros_consecutivos: 5,
    pausa_bloqueios_detectados: true,
    instancias_ids: [] as string[],
    contatos: [] as any[],
    tags_selecionadas: [] as string[],
    estagios_selecionados: [] as string[],
    url_midia: "",
    legenda_midia: "",
  });


  if (activeCampaign) {
    return <MonitoringDashboard campaign={activeCampaign} onCancel={() => setActiveCampaign(null)} />;
  }

  return (
    <CRMLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Novo Disparo em Massa</h1>
        
        <div className="flex gap-4 mb-8">
          {Steps.map((s, i) => (
            <div key={s} className={`flex items-center gap-2 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${i <= step ? "bg-primary text-primary-foreground" : ""}`}>
                {i + 1}
              </div>
              <span className="text-sm font-medium">{s}</span>
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {step === 0 && <StepContacts />}
          {step === 1 && <StepMessage form={form} setForm={setForm} />}
          {step === 2 && <StepAntiBan form={form} setForm={setForm} />}
          {step === 3 && <StepReview form={form} onStart={() => setActiveCampaign({ nome: form.nome })} />}
        </div>

        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Voltar</Button>
          <Button onClick={() => step === 3 ? setActiveCampaign({ nome: form.nome }) : setStep(Math.min(3, step + 1))}>
            {step === 3 ? "Iniciar Disparo" : "Próximo"}
          </Button>
        </div>
      </div>
    </CRMLayout>
  );
}

function StepContacts({ form, setForm }: any) {
  const [tags, setTags] = useState<any[]>([]);
  const [estagios, setEstagios] = useState<any[]>([]);
  const [csvPreview, setCsvPreview] = useState<any[]>([]);

  useEffect(() => {
    const fetchTargets = async () => {
      const { data: tagsData } = await supabase.from("tags").select("*");
      const { data: estagiosData } = await supabase.from("funil_estagios").select("*");
      setTags(tagsData || []);
      setEstagios(estagiosData || []);
    };
    fetchTargets();
  }, []);

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      setCsvPreview(data.slice(0, 5));
      // Map columns logic here...
      toast.success("CSV importado com sucesso!");
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Label>Nome da Campanha</Label>
        <Input placeholder="Ex: Campanha Black Friday" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
      </div>

      <Tabs defaultValue="tags" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tags">Por Tag</TabsTrigger>
          <TabsTrigger value="estagio">Por Estágio</TabsTrigger>
          <TabsTrigger value="csv">Importar CSV</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tags" className="p-4 border rounded-lg bg-card space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Selecione as tags:</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch checked />
                <span className="text-xs">Excluir Opt-outs</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked disabled />
                <span className="text-xs">Excluir Blacklist</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {tags.map(t => (
              <div key={t.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50">
                <input type="checkbox" id={t.id} className="h-4 w-4" onChange={(e) => {
                  const newTags = e.target.checked 
                    ? [...form.tags_selecionadas, t.nome]
                    : form.tags_selecionadas.filter((st: string) => st !== t.nome);
                  setForm({...form, tags_selecionadas: newTags});
                }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.cor }} />
                <label htmlFor={t.id} className="text-sm cursor-pointer">{t.nome}</label>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="estagio" className="p-4 border rounded-lg bg-card space-y-4">
          <p className="text-sm font-medium">Selecione os estágios do funil:</p>
          <div className="grid grid-cols-2 gap-3">
            {estagios.map(s => (
              <div key={s.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50">
                <input type="checkbox" id={s.id} className="h-4 w-4" onChange={(e) => {
                  const newEstagios = e.target.checked 
                    ? [...form.estagios_selecionados, s.id]
                    : form.estagios_selecionados.filter((se: string) => se !== s.id);
                  setForm({...form, estagios_selecionados: newEstagios});
                }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.cor }} />
                <label htmlFor={s.id} className="text-sm cursor-pointer">{s.nome}</label>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="csv" className="p-4 border rounded-lg bg-card space-y-4 text-center">
          <div className="py-8 border-2 border-dashed rounded-lg">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Clique para fazer upload ou arraste o arquivo CSV</p>
            <input type="file" className="hidden" id="csv-upload" accept=".csv,.xlsx" onChange={handleCsvUpload} />
            <Button variant="outline" size="sm" className="mt-4" onClick={() => document.getElementById('csv-upload')?.click()}>
              Selecionar Arquivo
            </Button>
          </div>
          {csvPreview.length > 0 && (
            <div className="space-y-2 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Preview (Primeiras 5 linhas)</p>
              <div className="border rounded overflow-hidden">
                <table className="w-full text-xs">
                  <tbody className="divide-y">
                    {csvPreview.map((row, i) => (
                      <tr key={i} className="divide-x">
                        {row.map((cell: any, j: number) => <td key={j} className="p-1">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


function StepMessage({ form, setForm }: any) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Label>Conteúdo da Mensagem</Label>
        <Textarea className="min-h-[150px]" value={form.mensagem} onChange={e => setForm({...form, mensagem: e.target.value})} placeholder="Olá {{primeiro_nome}}..." />
        <div className="flex gap-2">
          {["Nome", "Telefone", "Empresa"].map(v => (
            <Button key={v} size="sm" variant="outline" className="text-xs">+{v}</Button>
          ))}
        </div>
      </div>
    </Card>
  );
}

function StepAntiBan({ form, setForm }: any) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { id: "safe", label: "Seguro", icon: ShieldCheck, color: "text-green-500" },
          { id: "moderate", label: "Moderado", icon: Shield, color: "text-yellow-500" },
          { id: "fast", label: "Rápido", icon: ShieldAlert, color: "text-red-500" }
        ].map(p => (
          <Card key={p.id} className={`p-4 cursor-pointer hover:border-primary ${form.perfil_velocidade === p.id ? 'border-primary' : ''}`} onClick={() => setForm({...form, perfil_velocidade: p.id})}>
            <p.icon className={`h-8 w-8 mb-2 ${p.color}`} />
            <h3 className="font-bold">{p.label}</h3>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StepReview({ form, onStart }: any) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-bold mb-4">Resumo da Campanha: {form.nome || "Nova Campanha"}</h3>
        <p>Destinatários: 450</p>
        <p>Perfil de Velocidade: {form.perfil_velocidade}</p>
        <Button className="w-full mt-4" onClick={onStart}>Iniciar Disparo</Button>
      </Card>
    </div>
  );
}

function MonitoringDashboard({ campaign, onCancel }: { campaign: any, onCancel: () => void }) {
  return (
    <CRMLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Monitoramento: {campaign.nome}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Pause className="w-4 h-4 mr-2" /> Pausar</Button>
            <Button variant="destructive" size="sm" onClick={onCancel}><Square className="w-4 h-4 mr-2" /> Cancelar</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Enviados", val: "124/450", color: "text-blue-500" },
            { label: "Entregues", val: "112", color: "text-green-500" },
            { label: "Respondidos", val: "30", color: "text-purple-500" },
            { label: "Falhas", val: "2", color: "text-red-500" }
          ].map(m => (
            <Card key={m.label} className="p-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className={`text-2xl font-bold ${m.color}`}>{m.val}</p>
              <Progress value={30} className="mt-2" />
            </Card>
          ))}
        </div>
      </div>
    </CRMLayout>
  );
}
