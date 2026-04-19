import { create } from "zustand";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import type { WorkflowNode, WorkflowEdge, WorkflowMeta } from "@/types/workflow";

export interface NodeStatus { status: 'running'|'success'|'error'|'skipped'; output?: unknown; error?: string; }
interface ValidationError { nodeId: string; message: string; }
interface HistoryEntry { nodes: WorkflowNode[]; edges: WorkflowEdge[]; }
const defaultMeta: WorkflowMeta = { name: "Novo Workflow", description: "", active: false };

export const useWorkflowStore = create<any>((set, get) => ({
  nodes: [], edges: [], selectedNodeId: null,
  workflowMeta: { ...defaultMeta }, isDirty: false,
  nodeStatusMap: {}, testPanelOpen: false, validationErrors: [],
  history: [], historyIndex: -1,

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const h = [...history.slice(0, historyIndex + 1), { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }];
    if (h.length > 50) h.shift();
    set({ history: h, historyIndex: h.length - 1 });
  },
  onNodesChange: (changes: any) => {
    if (changes.some((c: any) => c.type === "remove" || c.type === "position")) get().pushHistory();
    set({ nodes: applyNodeChanges(changes, get().nodes), isDirty: true });
  },
  onEdgesChange: (changes: any) => {
    if (changes.some((c: any) => c.type === "remove")) get().pushHistory();
    set({ edges: applyEdgeChanges(changes, get().edges), isDirty: true });
  },
  onConnect: (conn: any) => { get().pushHistory(); set({ edges: addEdge(conn, get().edges), isDirty: true }); },
  addNode: (node: WorkflowNode) => { get().pushHistory(); set({ nodes: [...get().nodes, node], isDirty: true }); },
  removeNode: (id: string) => {
    get().pushHistory();
    set({ nodes: get().nodes.filter((n: any) => n.id !== id), edges: get().edges.filter((e: any) => e.source !== id && e.target !== id), selectedNodeId: null, isDirty: true });
  },
  updateNodeData: (id: string, data: any) => {
    get().pushHistory();
    set({ nodes: get().nodes.map((n: any) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n), isDirty: true });
  },
  setSelectedNodeId: (id: string | null) => set({ selectedNodeId: id }),
  setWorkflow: (meta: any, nodes: any, edges: any) => set({ workflowMeta: { ...defaultMeta, ...meta }, nodes, edges, isDirty: false, selectedNodeId: null, nodeStatusMap: {}, history: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }], historyIndex: 0, validationErrors: [] }),
  setMeta: (meta: any) => set({ workflowMeta: { ...get().workflowMeta, ...meta }, isDirty: true }),
  resetWorkflow: () => set({ nodes: [], edges: [], workflowMeta: { ...defaultMeta }, isDirty: false, selectedNodeId: null, nodeStatusMap: {}, history: [], historyIndex: -1, validationErrors: [] }),
  markClean: () => set({ isDirty: false }),
  setNodeStatusMap: (map: any) => set({ nodeStatusMap: map }),
  clearNodeStatusMap: () => set({ nodeStatusMap: {} }),
  setTestPanelOpen: (open: boolean) => set({ testPanelOpen: open }),
  undo: () => { const { historyIndex: i, history: h } = get(); if (i <= 0) return; set({ nodes: JSON.parse(JSON.stringify(h[i-1].nodes)), edges: JSON.parse(JSON.stringify(h[i-1].edges)), historyIndex: i-1, isDirty: true }); },
  redo: () => { const { historyIndex: i, history: h } = get(); if (i >= h.length-1) return; set({ nodes: JSON.parse(JSON.stringify(h[i+1].nodes)), edges: JSON.parse(JSON.stringify(h[i+1].edges)), historyIndex: i+1, isDirty: true }); },
  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
  validate: () => {
    const { nodes, edges } = get();
    const errors: ValidationError[] = [];
    if (!nodes.some((n: any) => n.type === "trigger")) errors.push({ nodeId: "__global__", message: "Adicione pelo menos um nó Trigger" });
    for (const node of nodes) {
      if (node.type === "trigger") continue;
      if (!edges.some((e: any) => e.target === node.id)) errors.push({ nodeId: node.id, message: `"${(node.data as any).label}" não tem conexão de entrada` });
    }
    for (const node of nodes) {
      const d = node.data as any;
      if (node.type === "ai" && !d.systemPrompt) errors.push({ nodeId: node.id, message: `"${d.label}" precisa de um System Prompt` });
      if (node.type === "action" && d.actionType === "send_message" && !d.messageTemplate) errors.push({ nodeId: node.id, message: `"${d.label}" precisa de um template de mensagem` });
      if (node.type === "condition" && !d.field) errors.push({ nodeId: node.id, message: `"${d.label}" precisa de um campo para a condição` });
    }
    set({ validationErrors: errors });
    return errors;
  },
}));
