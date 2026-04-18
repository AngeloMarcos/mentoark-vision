
Vou localizar o modal de importação atual em `src/pages/Leads.tsx` para substituir apenas o bloco de instruções, já que as funções `parseCsvFull` e `importarCSV` já foram atualizadas no turno anterior.

## Plano

Atualizar **apenas o texto do card de instruções** dentro do `Dialog` de importação em `src/pages/Leads.tsx`, substituindo o bloco atual por uma explicação completa dos 3 formatos aceitos (Cnpj.biz, MentoArk, CSV genérico) e os requisitos do arquivo.

### O que muda

Em `src/pages/Leads.tsx`, dentro do `<Dialog open={modalImport}>`:

- Substituir o `<div className="bg-muted ...">` atual pelo novo bloco com:
  - Título "📂 Formatos aceitos automaticamente"
  - 3 seções explicando cada formato (Cnpj.biz, MentoArk, CSV genérico)
  - Bloco de "Requisitos do arquivo" (cabeçalho na 1ª linha, separador vírgula, UTF-8, nome ou telefone obrigatório)

### O que NÃO muda

- O parser CSV (`parseCsvLine`, `parseCsvFull`) já está implementado corretamente do turno anterior — RFC 4180 com suporte a aspas, vírgulas dentro de campos, BOM, etc.
- A função `importarCSV` já está atualizada com auto-detecção de Cnpj.biz e CSV genérico.
- O upload de arquivo do dispositivo (CSV/XLSX) continua funcionando.

### Arquivos afetados

- `src/pages/Leads.tsx` — apenas o bloco de instruções dentro do modal de importação (1 edição localizada).
