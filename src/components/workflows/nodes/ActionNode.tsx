import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Send } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const ActionNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-blue-500" : "border-blue-500/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-blue-500" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
          <Send className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Ação"}</p>
          <p className="text-xs text-muted-foreground truncate">{d.actionType || ""}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-blue-500" />
    </div>
  );
});
ActionNode.displayName = "ActionNode";
