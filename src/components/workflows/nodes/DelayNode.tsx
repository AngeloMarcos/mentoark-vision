import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Timer } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const DelayNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  const subtitle = d.delayValue ? `${d.delayValue} ${d.delayUnit ?? ""}`.trim() : "Delay";
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-gray-400" : "border-gray-400/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gray-400/20 text-gray-400 flex items-center justify-center">
          <Timer className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Delay"}</p>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-gray-400" />
    </div>
  );
});
DelayNode.displayName = "DelayNode";
