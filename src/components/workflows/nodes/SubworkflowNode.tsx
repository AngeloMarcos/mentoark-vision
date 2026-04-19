import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Workflow } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

export const SubworkflowNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-teal-600" : "border-teal-600/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <Handle type="target" position={Position.Left} className="!bg-teal-600" />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-600 flex items-center justify-center">
          <Workflow className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Subworkflow"}</p>
          <p className="text-xs text-muted-foreground truncate">Subworkflow</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-teal-600" />
    </div>
  );
});
SubworkflowNode.displayName = "SubworkflowNode";
