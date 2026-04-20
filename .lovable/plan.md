

## Trocar envio para chamada direta à Evolution API

O usuário quer remover a indireção pela edge function `disparo-send` e chamar a Evolution API diretamente do navegador, conforme o snippet fornecido.

### Aviso importante

A edge function `disparo-send` **existe** no projeto e foi criada justamente para evitar dois problemas que voltarão com a chamada direta:

1. **CORS**: muitas instâncias Evolution não respondem com `Access-Control-Allow-Origin: *`. Se a sua instância não tiver CORS liberado para o domínio do app, as requisições falharão no browser com erro de CORS — mesmo que o servidor esteja saudável.
2. **Exposição da API key**: a `apikey` da Evolution sairá do navegador em texto claro, visível no DevTools de qualquer usuário logado.

Se as mensagens ainda falharem após essa mudança, a causa será CORS, não a edge function.

### Alteração

Arquivo único: `src/pages/Disparos.tsx`, linhas 320–325.

Substituir a função `enviarMensagem` atual:

```ts
const enviarMensagem = async (_cfg: EvolutionCfg, telefone: string, texto: string) => {
  const { data, error } = await supabase.functions.invoke("disparo-send", { body: { telefone, texto } });
  ...
};
```

Pela versão direta:

```ts
const enviarMensagem = async (cfg: EvolutionCfg, telefone: string, texto: string) => {
  const baseUrl = cfg.url.replace(/\/$/, "");
  const res = await fetch(`${baseUrl}/message/sendText/${cfg.instancia}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": cfg.api_key,
    },
    body: JSON.stringify({ number: telefone, text: texto }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${body}`);
  }
};
```

Nada mais será alterado no arquivo. A edge function `disparo-send` permanecerá no projeto (não usada) — pode ser removida depois se a chamada direta funcionar de forma estável.

### Arquivos tocados

```text
EDITADO:
  src/pages/Disparos.tsx   (apenas a função enviarMensagem)
```

