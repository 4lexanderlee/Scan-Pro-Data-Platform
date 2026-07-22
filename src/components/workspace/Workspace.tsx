import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Wand2,
  Link2,
  BarChart3,
  Terminal,
  X,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Trash2,
  FileText,
  RefreshCw,
  Plus,
} from "lucide-react";

interface WorkspaceProps {
  projectName: string;
  projectId: string;
  onClose: () => void;
}

// ── SQL Panel ──────────────────────────────────────────────────────────────
const sqlExamples: Record<string, string[]> = {
  transform: [
    "-- Limpieza automática generada por Scan Pro",
    "UPDATE dataset",
    "  SET region = TRIM(UPPER(region)),",
    "      monto  = COALESCE(monto, 0),",
    "      fecha  = TO_DATE(fecha, 'YYYY-MM-DD')",
    "WHERE monto IS NULL OR region = '';",
  ],
  analysis: [
    "-- Join generado visualmente",
    "SELECT a.region, a.producto,",
    "       b.categoria, SUM(a.monto) AS total",
    "FROM ventas a",
    "LEFT JOIN productos b ON a.producto_id = b.id",
    "GROUP BY a.region, a.producto, b.categoria",
    "ORDER BY total DESC;",
  ],
};

interface SqlPanelProps {
  tab: "transform" | "analysis";
  onClose: () => void;
}

const SqlPanel = ({ tab, onClose }: SqlPanelProps) => {
  const [copied, setCopied] = useState(false);
  const [consoleInput, setConsoleInput] = useState("");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const lines = sqlExamples[tab];

  const handleCopy = () => {
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRun = () => {
    if (!consoleInput.trim()) return;
    setConsoleOutput((prev) => [
      ...prev,
      `> ${consoleInput}`,
      "✓ Consulta ejecutada — 1,248 filas afectadas (simulado)",
    ]);
    setConsoleInput("");
  };

  return (
    <div className="border-t border-border bg-slate-950 flex flex-col h-72 animate-in slide-in-from-bottom-4 duration-300">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-semibold text-emerald-400">SQL Live</span>
          <div className="flex items-center gap-1 ml-1">
            <span className="animate-pulse h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400">generando</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={handleCopy}>
            {copied ? (
              <><Check className="h-3 w-3 mr-1 text-emerald-400" /> Copiado</>
            ) : (
              <><Copy className="h-3 w-3 mr-1" /> Copiar</>
            )}
          </Button>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Generated SQL (left) */}
        <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed border-r border-slate-800">
          <div className="text-slate-500 mb-2 text-[10px] uppercase tracking-wider">
            — SQL generado por tus acciones —
          </div>
          {lines.map((line, i) => (
            <div key={i} className={line.startsWith("--") ? "text-slate-500" : "text-blue-300"}>
              {line}
            </div>
          ))}
          <div className="mt-1 h-4 w-2 bg-primary/80 animate-pulse rounded-sm inline-block" />
        </div>

        {/* Console (right) */}
        <div className="w-80 flex flex-col bg-slate-900/50">
          <div className="text-[10px] uppercase tracking-wider text-slate-500 px-3 pt-3 pb-1">
            Consola SQL
          </div>
          <div className="flex-1 overflow-auto px-3 py-1 text-xs font-mono text-slate-300 space-y-1">
            {consoleOutput.length === 0 && (
              <div className="text-slate-600 italic">Escribe una consulta y presiona Enter…</div>
            )}
            {consoleOutput.map((line, i) => (
              <div key={i} className={line.startsWith(">") ? "text-cyan-300" : "text-emerald-400"}>
                {line}
              </div>
            ))}
          </div>
          <div className="flex items-center border-t border-slate-800 px-2 py-1.5">
            <span className="text-primary font-mono text-xs mr-2">›</span>
            <input
              className="flex-1 bg-transparent text-xs font-mono text-slate-200 outline-none placeholder:text-slate-600"
              placeholder="SELECT * FROM dataset LIMIT 10;"
              value={consoleInput}
              onChange={(e) => setConsoleInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRun()}
            />
            <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={handleRun}>
              Ejecutar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Tab Contents ───────────────────────────────────────────────────────────

const IngestaTab = () => (
  <div className="p-6 space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-1">Fuentes de datos</h3>
      <p className="text-sm text-muted-foreground">
        Conecta tus archivos o fuentes externas para comenzar el análisis.
      </p>
    </div>

    {/* Drop zone */}
    <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-pointer group">
      <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
        <Upload className="h-7 w-7 text-primary" />
      </div>
      <p className="font-semibold mb-1">Arrastra tus archivos aquí</p>
      <p className="text-sm text-muted-foreground mb-4">CSV, Excel (.xlsx), JSON soportados</p>
      <Button size="sm" variant="outline">
        Seleccionar archivo
      </Button>
    </div>

    {/* Quick sources */}
    <div>
      <p className="text-sm font-medium text-muted-foreground mb-3">O conecta desde:</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: "Google Sheets", icon: "📊", badge: "Beta" },
          { label: "URL / API", icon: "🔗" },
          { label: "Base de datos", icon: "🗄️", badge: "Pronto" },
        ].map((src, i) => (
          <button
            key={i}
            disabled={!!src.badge}
            className="flex items-center gap-2 p-3 rounded-lg border border-border bg-card/50 hover:border-primary/40 hover:bg-card/80 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{src.icon}</span>
            <span>{src.label}</span>
            {src.badge && (
              <Badge variant="secondary" className="ml-auto text-[10px] py-0">
                {src.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const TransformacionTab = ({ onSqlToggle, sqlOpen }: { onSqlToggle: () => void; sqlOpen: boolean }) => {
  const actions = [
    { icon: Trash2, label: "Eliminar nulos", desc: "Elimina filas con valores vacíos", color: "text-red-400" },
    { icon: RefreshCw, label: "Estandarizar texto", desc: "Normaliza mayúsculas y espacios", color: "text-blue-400" },
    { icon: ArrowUpDown, label: "Ordenar datos", desc: "Ordena por columna ascendente/descendente", color: "text-violet-400" },
    { icon: ChevronUp, label: "Eliminar duplicados", desc: "Detecta y borra filas repetidas", color: "text-amber-400" },
    { icon: Plus, label: "Crear columna calculada", desc: "Añade columna a partir de fórmula", color: "text-emerald-400" },
    { icon: FileText, label: "Renombrar columnas", desc: "Cambia los nombres de las cabeceras", color: "text-cyan-400" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-0.5">Transformación de datos</h3>
          <p className="text-sm text-muted-foreground">
            Aplica operaciones a tu dataset. El SQL se genera automáticamente.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <Label htmlFor="sql-toggle-transform" className="text-sm cursor-pointer">
            Ver SQL
          </Label>
          <Switch
            id="sql-toggle-transform"
            checked={sqlOpen}
            onCheckedChange={onSqlToggle}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {actions.map((action, i) => (
          <button
            key={i}
            className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/40 hover:border-primary/40 hover:bg-card/70 transition-all text-left group"
            onClick={onSqlToggle}
          >
            <div className={`mt-0.5 ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-medium text-sm">{action.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const AnalisisTab = ({ onSqlToggle, sqlOpen }: { onSqlToggle: () => void; sqlOpen: boolean }) => {
  const joinTypes = [
    { label: "INNER JOIN", desc: "Solo filas que coinciden en ambas tablas", color: "bg-blue-500" },
    { label: "LEFT JOIN", desc: "Todas las filas de la tabla izquierda", color: "bg-violet-500" },
    { label: "RIGHT JOIN", desc: "Todas las filas de la tabla derecha", color: "bg-cyan-500" },
    { label: "FULL JOIN", desc: "Todas las filas de ambas tablas", color: "bg-amber-500" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold mb-0.5">Joins & Agrupaciones</h3>
          <p className="text-sm text-muted-foreground">
            Une tablas y agrupa datos de forma visual. Sin código.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <Label htmlFor="sql-toggle-analysis" className="text-sm cursor-pointer">
            Ver SQL
          </Label>
          <Switch
            id="sql-toggle-analysis"
            checked={sqlOpen}
            onCheckedChange={onSqlToggle}
          />
        </div>
      </div>

      {/* Join selector */}
      <Card className="p-4 bg-card/40 border-border">
        <p className="text-sm font-medium mb-3">Tipo de Join</p>
        <div className="grid grid-cols-2 gap-2">
          {joinTypes.map((jt, i) => (
            <button
              key={i}
              className="flex items-center gap-2.5 p-3 rounded-lg border border-border hover:border-primary/40 bg-background/50 hover:bg-background/80 transition-all text-left"
              onClick={onSqlToggle}
            >
              <div className={`h-2 w-2 rounded-full ${jt.color}`} />
              <div>
                <div className="text-xs font-mono font-semibold">{jt.label}</div>
                <div className="text-[10px] text-muted-foreground">{jt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Group By */}
      <Card className="p-4 bg-card/40 border-border">
        <p className="text-sm font-medium mb-3">Tabla dinámica / GROUP BY</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {["Agrupar por región", "Sumar montos", "Contar registros"].map((opt, i) => (
            <button
              key={i}
              className="p-3 rounded-lg border border-border bg-background/50 hover:border-primary/40 hover:bg-background/80 transition-all text-sm text-center"
              onClick={onSqlToggle}
            >
              {opt}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

const VisualizacionTab = () => {
  const charts = [
    { type: "Barras", emoji: "📊", desc: "Comparativa por categoría" },
    { type: "Línea", emoji: "📈", desc: "Tendencias en el tiempo" },
    { type: "Dispersión", emoji: "⚡", desc: "Correlación entre variables" },
    { type: "Pastel", emoji: "🥧", desc: "Distribución porcentual" },
    { type: "Histograma", emoji: "📉", desc: "Distribución de valores" },
    { type: "Mapa de calor", emoji: "🌡️", desc: "Correlaciones entre columnas" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h3 className="text-lg font-semibold mb-0.5">Visualizaciones</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona un tipo de gráfico y elige las columnas. Se renderiza al instante.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {charts.map((chart, i) => (
          <button
            key={i}
            className="p-4 rounded-xl border border-border bg-card/40 hover:border-primary/50 hover:bg-card/70 transition-all group text-left"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform inline-block">
              {chart.emoji}
            </div>
            <div className="font-semibold text-sm">{chart.type}</div>
            <div className="text-xs text-muted-foreground">{chart.desc}</div>
          </button>
        ))}
      </div>

      {/* Mock chart area */}
      <Card className="p-5 bg-card/40 border-dashed border-2 border-border">
        <div className="text-center py-6 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">El gráfico aparecerá aquí</p>
          <p className="text-xs mt-1 opacity-60">Selecciona un tipo y configura las columnas</p>
        </div>
      </Card>
    </div>
  );
};

// ── Main Workspace ─────────────────────────────────────────────────────────

const Workspace = ({ projectName, onClose }: WorkspaceProps) => {
  const [activeTab, setActiveTab] = useState("ingesta");
  const [sqlOpen, setSqlOpen] = useState(false);

  const sqlTab = activeTab === "transform" ? "transform" : "analysis";

  const tabs = [
    { value: "ingesta",   label: "Ingesta",         icon: Upload,   showSql: false },
    { value: "transform", label: "Transformación",  icon: Wand2,    showSql: true  },
    { value: "analysis",  label: "Análisis",         icon: Link2,    showSql: true  },
    { value: "viz",       label: "Visualización",    icon: BarChart3, showSql: false },
  ];

  const activeTabDef = tabs.find((t) => t.value === activeTab);

  return (
    <div className="flex flex-col h-full min-h-screen bg-background">
      {/* Workspace header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-border bg-background/95 sticky top-0 z-30 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold leading-none">{projectName}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Espacio de trabajo</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-400">
            Sin guardar
          </Badge>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4 mr-1" />
            Cerrar
          </Button>
        </div>
      </div>

      {/* Tab system */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => {
          setActiveTab(val);
          // Close SQL panel when switching to non-SQL tabs
          const tabDef = tabs.find((t) => t.value === val);
          if (!tabDef?.showSql) setSqlOpen(false);
        }}
        className="flex-1 flex flex-col"
      >
        <div className="px-6 pt-4 border-b border-border">
          <TabsList className="bg-muted/40 gap-1 h-auto p-1">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-1.5 px-4 py-2 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Tab content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <TabsContent value="ingesta" className="mt-0 h-full">
              <IngestaTab />
            </TabsContent>
            <TabsContent value="transform" className="mt-0 h-full">
              <TransformacionTab
                onSqlToggle={() => setSqlOpen((o) => !o)}
                sqlOpen={sqlOpen}
              />
            </TabsContent>
            <TabsContent value="analysis" className="mt-0 h-full">
              <AnalisisTab
                onSqlToggle={() => setSqlOpen((o) => !o)}
                sqlOpen={sqlOpen}
              />
            </TabsContent>
            <TabsContent value="viz" className="mt-0 h-full">
              <VisualizacionTab />
            </TabsContent>
          </div>

          {/* SQL slide-up panel */}
          {sqlOpen && activeTabDef?.showSql && (
            <SqlPanel
              tab={sqlTab as "transform" | "analysis"}
              onClose={() => setSqlOpen(false)}
            />
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default Workspace;
