import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Trash2, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PREDEFINED_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#6366f1", "#a855f7", "#ec4899", "#64748b",
  "#0f172a", "#f43f5e"
];

const TagsFunilPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Funil Stages logic
  const { data: stages = [] } = useQuery({
    queryKey: ["funil-estagios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("funil_estagios")
        .select("*")
        .order("ordem", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const createStageMutation = useMutation({
    mutationFn: async (newStage: { nome: string; cor: string }) => {
      const { error } = await supabase.from("funil_estagios").insert([{
        ...newStage,
        user_id: user?.id,
        ordem: stages.length
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funil-estagios"] });
      toast.success("Estágio criado!");
    }
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Gerenciamento de Tags e Funil</h1>
      
      <Tabs defaultValue="tags">
        <TabsList>
          <TabsTrigger value="tags">Tags de Identificação</TabsTrigger>
          <TabsTrigger value="estagios">Estágios do Funil</TabsTrigger>
        </TabsList>

        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Funcionalidade de Tags em desenvolvimento...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estagios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurar Estágios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Nome do estágio" id="stage-name" />
                <Button onClick={() => {
                  const name = (document.getElementById("stage-name") as HTMLInputElement).value;
                  if (name) createStageMutation.mutate({ nome: name, cor: "#6366f1" });
                }}>
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Estágio
                </Button>
              </div>
              
              <div className="space-y-2">
                {stages.map((s, idx) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg bg-card">
                    <GripVertical className="text-muted-foreground" />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: s.cor }} />
                    <span className="font-medium flex-1">{s.nome}</span>
                    <Badge variant="secondary">Posição: {idx + 1}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TagsFunilPage;
