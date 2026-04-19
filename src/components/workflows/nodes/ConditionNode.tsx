import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const ConditionNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-amber-500" : "border-amber-500/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-amber-500" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
          <GitBranch className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Condição"}</p>
          <p className="text-xs text-muted-foreground truncate">If/Else</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="true" className="!bg-amber-500" />
      <Handle type="source" position={Position.Bottom} id="false" className="!bg-amber-500" />
    </div>
  );
});
ConditionNode.displayName = "ConditionNode";
