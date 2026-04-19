import { memo } from "react";
import { Trash2 } from "lucide-react";
import { useWorkflowStore } from "@/stores/workflowStore";

export const NodeActionBar = memo(({ nodeId }: { nodeId: string }) => {
  const { removeNode, setSelectedNodeId } = useWorkflowStore();
  return (
    <div className="absolute -top-3 -right-2 flex gap-1 bg-background border border-border rounded-md shadow-sm px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeNode(nodeId);
          setSelectedNodeId(null);
        }}
        className="text-destructive hover:text-destructive/80 p-0.5"
        aria-label="Remover nó"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
});
NodeActionBar.displayName = "NodeActionBar";
