export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}
export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  style?: Record<string, unknown>;
  animated?: boolean;
}
export interface WorkflowMeta {
  id?: string;
  name: string;
  description: string;
  active: boolean;
  userId?: string;
}
