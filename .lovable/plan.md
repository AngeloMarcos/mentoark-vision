

## Status: tudo já está aplicado — só falta um ajuste cosmético

Verifiquei os 5 itens do pedido contra o código atual. **Quatro já estão exatamente como pedido**, e o quinto difere só no texto da mensagem de erro.

### Verificação item a item

| # | Item | Status atual |
|---|------|--------------|
| 1 | Tabelas `disparos` e `disparo_logs` com RLS | ✅ Já existem no banco com todas as colunas, defaults e policies pedidas (confirmado no schema) |
| 2 | Rota `/disparos` em `src/App.tsx` | ✅ Import na linha 15, rota na linha 41 |
| 3 | Item "Disparos" no `AppSidebar.tsx` com ícone `Send` | ✅ Import na linha 2, item na linha 19 |
| 4 | `enviarMensagem` chamando Evolution direto | ⚠️ Lógica idêntica à pedida, mas a mensagem de erro diz `HTTP ${status}: ${body}` em vez de `Evolution API ${status}: ${body}` |
| 5 | `testarConexao` com fetch real para `/instance/fetchInstances` | ✅ Implementação idêntica (lógica, headers, toasts) |

### Única alteração a fazer

Arquivo `src/pages/Disparos.tsx`, linha 332 — trocar o texto do erro para bater 100% com o snippet pedido:

```ts
// de:
throw new Error(`HTTP ${res.status}: ${body}`);
// para:
throw new Error(`Evolution API ${res.status}: ${body}`);
```

E o fallback do `.catch` para `"sem detalhe"` (hoje é `""`), também conforme o snippet.

### Arquivos tocados

```text
EDITADO:
  src/pages/Disparos.tsx   (apenas a string de erro dentro de enviarMensagem)
```

Nenhuma migration nova, nenhuma mudança em `App.tsx`, `AppSidebar.tsx` ou `Integracoes.tsx` — todos já estão no estado pedido.

