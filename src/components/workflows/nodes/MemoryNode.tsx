import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Database } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const MemoryNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-rose-500" : "border-rose-500/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-rose-500" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center">
          <Database className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Memória"}</p>
          <p className="text-xs text-muted-foreground truncate">{d.operation || ""}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-rose-500" />
    </div>
  );
});
MemoryNode.displayName = "MemoryNode";
