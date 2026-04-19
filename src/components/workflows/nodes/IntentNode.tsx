import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Target } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const IntentNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-cyan-600" : "border-cyan-600/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-cyan-600" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-600 flex items-center justify-center">
          <Target className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Intenção"}</p>
          <p className="text-xs text-muted-foreground truncate">Intenção</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-cyan-600" />
    </div>
  );
});
IntentNode.displayName = "IntentNode";
