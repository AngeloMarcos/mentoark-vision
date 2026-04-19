import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Settings, Trash2, ExternalLink, User, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface MensagemTeste {
  id: string;
  tipo: "human" | "ai" | "erro";
  conteudo: string;
  timestamp: Date;
}

const SUGESTOES = [
  "quais documentos preciso para o BPC?",
  "o BPC é gratuito?",
  "o que é CIPTEA?",
  "meu filho tem autismo, tenho direito a IPVA grátis?",
];

const STORAGE_URL = "n8n_webhook_url";
const STORAGE_TEL = "n8n_webhook_telefone_teste";

const uid = () => Math.random().toString(36).slice(2, 10);

export function TestarAgente() {
  const navigate = useNavigate();
  const [url, setUrl] = useState(() => localStorage.getItem(STORAGE_URL) ?? "");
  const [telefone, setTelefone] = useState(() => localStorage.getItem(STORAGE_TEL) ?? "");
  const [editandoConfig, setEditandoConfig] = useState(() => !localStorage.getItem(STORAGE_URL));
  const [draftUrl, setDraftUrl] = useState(url);
  const [draftTel, setDraftTel] = useState(telefone);

  const [mensagens, setMensagens] = useState<MensagemTeste[]>([]);
  const [input, setInput] = useState("");
  const [aguardando, setAguardando] = useState(false);
  const [status, setStatus] = useState<"idle" | "ok" | "erro">("idle");

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [mensagens, aguardando]);

  const salvarConfig = () => {
    if (!draftUrl.trim() || !draftTel.trim()) return toast.error("Preencha URL e telefone");
    localStorage.setItem(STORAGE_URL, draftUrl.trim());
    localStorage.setItem(STORAGE_TEL, draftTel.trim());
    setUrl(draftUrl.trim());
    setTelefone(draftTel.trim());
    setEditandoConfig(false);
    toast.success("Configuração salva");
  };

  const enviar = async (texto: string) => {
    const t = texto.trim();
    if (!t || aguardando) return;
    if (!url) return toast.error("Configure o webhook primeiro");

    setMensagens((prev) => [...prev, { id: uid(), tipo: "human", conteudo: t, timestamp: new Date() }]);
    setInput("");
    setAguardando(true);

    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 30000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone, mensagem: t, fonte: "crm_teste" }),
        signal: ctrl.signal,
      });
      clearTimeout(timeout);
      const ct = res.headers.get("content-type") ?? "";
      const data: any = ct.includes("application/json") ? await res.json() : { text: await res.text() };
      const resposta: string = data?.output ?? data?.text ?? data?.message ?? data?.reply ?? (typeof data === "string" ? data : JSON.stringify(data));
      const partes = String(resposta).split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
      const novos: MensagemTeste[] = (partes.length ? partes : [String(resposta)]).map((c) => ({
        id: uid(), tipo: "ai", conteudo: c, timestamp: new Date(),
      }));
      setMensagens((prev) => [...prev, ...novos]);
      setStatus("ok");
    } catch (e: any) {
      clearTimeout(timeout);
      const msg = e?.name === "AbortError"
        ? "O agente demorou para responder. Tente novamente."
        : `Erro ao chamar webhook: ${e?.message ?? "rede"}`;
      setMensagens((prev) => [...prev, { id: uid(), tipo: "erro", conteudo: msg, timestamp: new Date() }]);
      setStatus("erro");
    } finally {
      setAguardando(false);
    }
  };

  // Tela de configuração inicial
  if (editandoConfig) {
    return (
      <Card>
        <CardContent className="pt-6 space-y-4 max-w-xl mx-auto">
          <div>
            <h3 className="font-semibold flex items-center gap-2"><Settings className="h-4 w-4" /> Configurar agente de teste</h3>
            <p className="text-sm text-muted-foreground mt-1">Conecte ao webhook do n8n para conversar diretamente com o agente sem usar o WhatsApp.</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">URL do webhook n8n</label>
            <Input value={draftUrl} onChange={(e) => setDraftUrl(e.target.value)} placeholder="https://n8n.seudominio.com/webhook/agente" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Telefone de teste (session_id)</label>
            <Input value={draftTel} onChange={(e) => setDraftTel(e.target.value)} placeholder="5511999998888" />
            <p className="text-xs text-muted-foreground">Será usado para identificar a conversa de teste no histórico.</p>
          </div>
          <div className="flex gap-2 justify-end">
            {url && <Button variant="outline" onClick={() => setEditandoConfig(false)}>Cancelar</Button>}
            <Button onClick={salvarConfig}>Salvar configuração</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${status === "erro" ? "bg-destructive" : status === "ok" ? "bg-success" : "bg-muted-foreground"}`} />
            <span className="text-sm font-medium">
              {status === "erro" ? "Sem resposta" : status === "ok" ? "Conectado" : "Pronto"}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">• telefone teste: {telefone}</span>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" title="Limpar conversa" onClick={() => { setMensagens([]); setStatus("idle"); }}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Ver no Monitor" onClick={() => navigate(`/whatsapp?tel=${encodeURIComponent(telefone)}`)}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Configuração" onClick={() => { setDraftUrl(url); setDraftTel(telefone); setEditandoConfig(true); }}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mensagens */}
        <div ref={scrollRef} className="h-[500px] overflow-y-auto px-4 py-4 space-y-3 bg-muted/20">
          {mensagens.length === 0 && !aguardando && (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <Bot className="h-12 w-12 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">Comece a conversar com o agente. Experimente uma sugestão:</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {SUGESTOES.map((s) => (
                  <button key={s} onClick={() => enviar(s)} className="text-xs px-3 py-1.5 rounded-full bg-background border hover:border-primary hover:text-primary transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mensagens.map((m) => {
            if (m.tipo === "erro") {
              return (
                <div key={m.id} className="flex justify-center">
                  <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2 max-w-[80%]">
                    {m.conteudo}
                  </div>
                </div>
              );
            }
            const isHuman = m.tipo === "human";
            return (
              <div key={m.id} className={`flex ${isHuman ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 ${isHuman ? "bg-primary text-primary-foreground" : "bg-background border"}`}>
                  <div className={`flex items-center gap-1 text-xs opacity-70 mb-1 ${isHuman ? "justify-end" : ""}`}>
                    {isHuman ? <><User className="h-3 w-3" /> Você</> : <><Bot className="h-3 w-3" /> Agente</>}
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{m.conteudo}</p>
                  <p className="text-[10px] opacity-60 mt-1 text-right">
                    {m.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            );
          })}

          {aguardando && (
            <div className="flex justify-start">
              <div className="bg-background border rounded-lg px-3 py-2 flex items-center gap-2">
                <Bot className="h-3 w-3 opacity-70" />
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t p-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(input); } }}
            placeholder="Digite sua mensagem..."
            disabled={aguardando}
          />
          <Button onClick={() => enviar(input)} disabled={aguardando || !input.trim()}>
            {aguardando ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
