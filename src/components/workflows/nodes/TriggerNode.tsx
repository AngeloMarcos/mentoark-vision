import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap, Clock, Database } from "lucide-react";
import { NodeActionBar } from "./NodeActionBar";

const icons: Record<string, any> = {
  whatsapp_incoming: Zap,
  webhook: Zap,
  schedule: Clock,
  db_change: Database,
};
const labels: Record<string, string> = {
  whatsapp_incoming: "WhatsApp",
  webhook: "Webhook",
  schedule: "Agendado",
  db_change: "DB Change",
};

export const TriggerNode = memo(({ data, selected, id }: NodeProps) => {
  const d = data as any;
  const Icon = icons[d.triggerType] || Zap;
  return (
    <div
      className={`group relative rounded-xl border-2 px-4 py-3 min-w-[180px] bg-card shadow-sm transition-colors ${
        selected ? "border-emerald-500" : "border-emerald-500/50"
      }`}
    >
      <NodeActionBar nodeId={id} />
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{d.label || "Trigger"}</p>
          <p className="text-xs text-muted-foreground truncate">{labels[d.triggerType] || ""}</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-emerald-500" />
    </div>
  );
});
TriggerNode.displayName = "TriggerNode";
