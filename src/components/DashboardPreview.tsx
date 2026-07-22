import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Wand2,
  BarChart3,
  Terminal,
  CheckCircle2,
} from "lucide-react";

const workflowSteps = [
  {
    icon: Upload,
    label: "Ingesta",
    desc: "Sube CSV / Excel",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Wand2,
    label: "Limpieza",
    desc: "Nulos & formatos",
    color: "text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: BarChart3,
    label: "Visualización",
    desc: "Gráficos al instante",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: Terminal,
    label: "SQL Live",
    desc: "Código generado",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

const sqlLines = [
  { text: "SELECT * FROM ventas_2024", color: "text-blue-300" },
  { text: "  WHERE region IS NOT NULL", color: "text-violet-300" },
  { text: "  AND monto > 0", color: "text-violet-300" },
  { text: "  GROUP BY region", color: "text-cyan-300" },
  { text: "  ORDER BY SUM(monto) DESC;", color: "text-cyan-300" },
];

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-accent/50 text-accent">
            Cómo funciona
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            De tus datos al insight en{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              minutos
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sin instalar nada. Sin escribir código. Solo tú y tus datos.
          </p>
        </div>

        {/* Workflow steps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {workflowSteps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-3 text-center">
              <div
                className={`h-14 w-14 rounded-2xl border ${step.bg} flex items-center justify-center`}
              >
                <step.icon className={`h-7 w-7 ${step.color}`} />
              </div>
              <div>
                <div className="font-semibold text-sm">{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.desc}</div>
              </div>
              {i < workflowSteps.length - 1 && (
                <div className="hidden md:block absolute" />
              )}
            </div>
          ))}
        </div>

        {/* Main preview card */}
        <div className="relative">
          <Card className="bg-card/50 backdrop-blur-sm border-border overflow-hidden">
            {/* Mock workspace header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                </div>
                <span className="text-sm font-medium text-muted-foreground ml-2">
                  Análisis de ventas Q4 · ventas_2024.csv
                </span>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Conectado
              </Badge>
            </div>

            <div className="grid md:grid-cols-5 min-h-[360px]">
              {/* Left: data table preview */}
              <div className="md:col-span-3 p-6 border-r border-border">
                <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Vista de datos — 1,248 filas × 7 columnas
                </div>
                <div className="rounded-lg border border-border overflow-hidden text-xs font-mono">
                  {/* Table header */}
                  <div className="grid grid-cols-4 bg-muted/50 px-3 py-2 gap-4 text-muted-foreground font-semibold">
                    <span>región</span>
                    <span>producto</span>
                    <span>monto</span>
                    <span>fecha</span>
                  </div>
                  {[
                    ["Norte", "Laptop", "$2,400", "2024-01"],
                    ["Sur", "Monitor", "$890", "2024-01"],
                    ["Centro", "Teclado", "$120", "2024-02"],
                    ["Norte", "Mouse", "$45", "2024-02"],
                    ["Este", "Laptop", "$2,350", "2024-03"],
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`grid grid-cols-4 px-3 py-2 gap-4 border-t border-border transition-colors ${
                        i === 1 ? "bg-primary/5 border-primary/20" : "hover:bg-muted/30"
                      }`}
                    >
                      {row.map((cell, j) => (
                        <span
                          key={j}
                          className={j === 2 ? "text-emerald-400" : "text-foreground/80"}
                        >
                          {cell}
                        </span>
                      ))}
                    </div>
                  ))}
                  <div className="px-3 py-2 border-t border-border text-muted-foreground text-[10px]">
                    … 1,243 filas más
                  </div>
                </div>

                {/* Stat pills */}
                <div className="flex gap-3 mt-4 flex-wrap">
                  {[
                    { label: "Nulos detectados", val: "3", color: "text-amber-400" },
                    { label: "Columnas limpias", val: "5/7", color: "text-emerald-400" },
                    { label: "Outliers", val: "12", color: "text-red-400" },
                  ].map((s, i) => (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-full bg-muted/50 border border-border text-xs flex gap-1.5 items-center"
                    >
                      <span className={`font-bold ${s.color}`}>{s.val}</span>
                      <span className="text-muted-foreground">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: SQL panel */}
              <div className="md:col-span-2 p-6 bg-slate-950/50">
                <div className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-emerald-400" />
                  <span>SQL Generado en Vivo</span>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-emerald-400">live</span>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-900 border border-slate-700/50 p-4 font-mono text-xs leading-relaxed">
                  {sqlLines.map((line, i) => (
                    <div key={i} className={line.color}>
                      {line.text}
                    </div>
                  ))}
                  <div className="mt-2 h-4 w-2 bg-primary/80 animate-pulse rounded-sm inline-block" />
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Cada acción que realizas genera código SQL visible y editable.
                </p>
              </div>
            </div>
          </Card>

          {/* Decorative glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-3xl -z-10 opacity-50" />
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
