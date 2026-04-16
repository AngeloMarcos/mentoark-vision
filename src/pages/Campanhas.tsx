import { useState } from "react";
import { CRMLayout } from "@/components/CRMLayout";
import { mockCampanhas } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { DollarSign, Eye, MousePointerClick, Users, TrendingUp } from "lucide-react";

const statusColor: Record<string, string> = {
  ativa: "bg-success/15 text-success",
  pausada: "bg-warning/15 text-warning",
  finalizada: "bg-muted text-muted-foreground",
};

export default function CampanhasPage() {
  const totalInvestimento = mockCampanhas.reduce((s, c) => s + c.investimento, 0);
  const totalLeads = mockCampanhas.reduce((s, c) => s + c.leads_gerados, 0);
  const totalConversoes = mockCampanhas.reduce((s, c) => s + c.conversoes, 0);
  const cplMedio = Number((totalInvestimento / totalLeads).toFixed(2));

  const chartData = mockCampanhas.map((c) => ({
    nome: c.nome.length > 15 ? c.nome.slice(0, 15) + "..." : c.nome,
    leads: c.leads_gerados,
    conversoes: c.conversoes,
    cpl: c.cpl,
  }));

  return (
    <CRMLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campanhas</h1>
          <p className="text-muted-foreground text-sm">Performance de campanhas e mídia paga</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center"><DollarSign className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">Investimento Total</p><p className="text-lg font-bold">R$ {totalInvestimento.toLocaleString("pt-BR")}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center"><Users className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">Leads Gerados</p><p className="text-lg font-bold">{totalLeads}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center"><TrendingUp className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">Conversões</p><p className="text-lg font-bold">{totalConversoes}</p></div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 rounded-xl bg-warning/15 text-warning flex items-center justify-center"><MousePointerClick className="h-5 w-5" /></div>
              <div><p className="text-xs text-muted-foreground">CPL Médio</p><p className="text-lg font-bold">R$ {cplMedio}</p></div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-base">Leads por Campanha</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,20%)" />
                  <XAxis dataKey="nome" stroke="hsl(220,10%,55%)" fontSize={10} />
                  <YAxis stroke="hsl(220,10%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,25%,11%)", border: "1px solid hsl(220,20%,18%)", borderRadius: "8px", color: "hsl(220,15%,90%)" }} />
                  <Bar dataKey="leads" fill="hsl(217,91%,55%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversoes" fill="hsl(24,95%,53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">CPL por Campanha</CardTitle></CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,20%)" />
                  <XAxis dataKey="nome" stroke="hsl(220,10%,55%)" fontSize={10} />
                  <YAxis stroke="hsl(220,10%,55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222,25%,11%)", border: "1px solid hsl(220,20%,18%)", borderRadius: "8px", color: "hsl(220,15%,90%)" }} />
                  <Line type="monotone" dataKey="cpl" stroke="hsl(24,95%,53%)" strokeWidth={2} dot={{ fill: "hsl(24,95%,53%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base">Todas as Campanhas</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campanha</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Investimento</TableHead>
                  <TableHead className="text-right">Impressões</TableHead>
                  <TableHead className="text-right">Cliques</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">CPL</TableHead>
                  <TableHead className="text-right">Conversões</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCampanhas.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.nome}</TableCell>
                    <TableCell><Badge className={`${statusColor[c.status]} text-xs border-0`}>{c.status}</Badge></TableCell>
                    <TableCell className="text-right">R$ {c.investimento.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">{c.impressoes.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">{c.cliques.toLocaleString("pt-BR")}</TableCell>
                    <TableCell className="text-right">{c.ctr}%</TableCell>
                    <TableCell className="text-right">{c.leads_gerados}</TableCell>
                    <TableCell className="text-right">R$ {c.cpl}</TableCell>
                    <TableCell className="text-right">{c.conversoes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </CRMLayout>
  );
}
