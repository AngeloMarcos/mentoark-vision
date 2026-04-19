import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Repeat } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const LoopNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-orange-500" : "border-orange-500/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-orange-500" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center">
          <Repeat className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Loop"}</p>
          <p className="text-xs text-muted-foreground truncate">{d.arrayField || "Loop"}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-orange-500" />
    </div>
  );
});
LoopNode.displayName = "LoopNode";
