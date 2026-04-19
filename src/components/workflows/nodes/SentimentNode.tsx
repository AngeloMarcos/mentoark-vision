import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Heart } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const SentimentNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-pink-500" : "border-pink-500/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-pink-500" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-500 flex items-center justify-center">
          <Heart className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Sentimento"}</p>
          <p className="text-xs text-muted-foreground truncate">Sentimento</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-pink-500" />
    </div>
  );
});
SentimentNode.displayName = "SentimentNode";
