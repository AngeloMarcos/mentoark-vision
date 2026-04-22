

## Plano: refinamento visual premium com degradês azul → roxo

### Visão geral
O sistema já tem tokens degradê (`gradient-brand`, `glow-primary`, etc). Vou amplificar a identidade visual em **5 camadas**: fundo, sidebar, header, cards e estados de UI — sem quebrar componentes nem alterar lógica.

---

### 1. Background ambiente (`src/index.css`)
- Adicionar **aurora layer** no `body`: dois blobs radiais fixos (azul no topo-esquerdo, roxo no canto inferior-direito) com `blur(120px)` e baixa opacidade — cria profundidade sem distrair.
- Criar utilitários novos:
  - `.gradient-mesh` — fundo com 3 radiais sobrepostos (hero/cards de destaque)
  - `.gradient-border-hover` — borda degradê que aparece no hover de cards
  - `.gradient-text-animated` — texto degradê com `background-position` animado (4s loop)
  - `.glow-soft` — sombra mais sutil para cards comuns
  - `.glow-intense` — usada em CTAs principais
- Adicionar `@keyframes aurora` (movimento lento dos blobs) e `@keyframes gradient-shift`.

### 2. Sidebar (`src/components/AppSidebar.tsx` + `index.css`)
- Atualizar `.sidebar-gradient` para degradê **vertical azul-profundo → roxo-noite** (`hsl(232 40% 5%)` → `hsl(260 40% 8%)`).
- Logo: adicionar **glow pulsante** (animação respirar) no badge.
- Item ativo: além do `gradient-brand-subtle`, adicionar **borda esquerda degradê 2px** mais grossa + leve glow lateral.
- Item hover: micro-translação `translate-x-1` + fade do degradê de fundo.
- Footer "Sair": separador degradê fino acima.

### 3. Header (`src/components/AppHeader.tsx`)
- Glassmorphism mais forte: `bg-card/40 backdrop-blur-xl`.
- Linha de base degradê **animada** (gradient-shift 6s).
- Avatar: anel degradê externo (técnica `padding + mask`) com glow.
- Sino de notificações: badge animado com `pulse` degradê.

### 4. Cards & componentes globais (`src/index.css`)
- Card padrão ganha hover: `border` transita para degradê azul→roxo + leve elevação (`translate-y-[-2px]`) + `glow-soft`.
- Botão `primary` (variante `default` do shadcn) repintado via override CSS para usar `gradient-brand` + `glow-primary` no hover.
- Badges "ativo/sucesso" mantêm cores semânticas; badges neutras ganham fundo `gradient-brand-subtle`.
- Tabs ativas: indicador inferior degradê em vez de cor sólida.
- Inputs: focus ring degradê (azul→roxo) em vez de azul puro.

### 5. Páginas-chave (toques pontuais, sem refatorar layouts)
- **Dashboard**: títulos das seções com `.gradient-text-animated`; cards de KPI ganham mini-ícone com fundo `gradient-brand-subtle` + glow; gráficos com paleta refinada (azul → violeta → magenta).
- **Disparos** (rota atual do usuário): card do disparo ativo recebe `card-gradient-border` + barra de progresso degradê animada; chip de status com pulse.
- **Login**: fundo aurora full-screen + card central com `card-gradient-border` e logo glow.

---

### Detalhes técnicos

**Aurora background (snippet `index.css`)**
```css
body::before {
  content: '';
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(600px circle at 10% 10%, hsl(226 85% 52% / 0.12), transparent 60%),
    radial-gradient(700px circle at 90% 90%, hsl(262 83% 58% / 0.12), transparent 60%);
  animation: aurora 18s ease-in-out infinite alternate;
}
.dark body::before {
  background:
    radial-gradient(600px circle at 10% 10%, hsl(226 90% 62% / 0.18), transparent 60%),
    radial-gradient(700px circle at 90% 90%, hsl(262 85% 65% / 0.18), transparent 60%);
}
@keyframes aurora {
  0% { transform: translate(0,0) scale(1); }
  100% { transform: translate(-30px,20px) scale(1.05); }
}
```

**Override do botão primary (em `index.css`, sem tocar no shadcn)**
```css
.btn-gradient,
button[data-variant="default"]:not([data-no-gradient]) {
  background: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
  transition: box-shadow .25s, transform .15s;
}
.btn-gradient:hover { box-shadow: 0 0 28px hsl(262 83% 58% / .35); transform: translateY(-1px); }
```
> Aplicarei `.btn-gradient` nos CTAs principais (Salvar, Iniciar Disparo, Novo Lead) — não em todos os botões para manter hierarquia.

**Anel degradê do avatar**
```tsx
<div className="p-[2px] rounded-full gradient-brand glow-primary">
  <div className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-sm font-semibold gradient-brand-text">
    {initials}
  </div>
</div>
```

---

### Arquivos
- **Editar**: `src/index.css`, `src/components/AppSidebar.tsx`, `src/components/AppHeader.tsx`, `src/components/ui/card.tsx` (apenas adicionar classe hover), `src/pages/Dashboard.tsx` (títulos + KPI cards), `src/pages/Disparos.tsx` (card ativo), `src/pages/Login.tsx` (fundo aurora).
- **Criar**: nenhum.

### Resultado
Tema dark mais cinematográfico, com profundidade de aurora, hierarquia clara via degradês azul→roxo, micro-interações suaves e CTAs com glow. Tema light recebe os mesmos efeitos em intensidade reduzida. Zero quebra de funcionalidade.

