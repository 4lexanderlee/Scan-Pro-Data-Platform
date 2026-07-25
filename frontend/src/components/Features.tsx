import { Database, Wand2, Link2, Terminal } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Database,
    title: "Ingesta Multifuente",
    description:
      "Sube CSV, Excel o conecta Google Sheets al instante. Sin configuraciones complicadas, sin código.",
    gradient: "from-blue-500 to-indigo-600",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    icon: Wand2,
    title: "Limpieza Interactiva",
    description:
      "Maneja nulos, estandariza formatos y elimina outliers con un solo clic. Tu pipeline de limpieza en segundos.",
    gradient: "from-violet-500 to-purple-600",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: Link2,
    title: "Visual Joins & Tablas Dinámicas",
    description:
      "Une tablas visualmente y agrupa tus datos sin saber código. Drag & drop para relacionar fuentes.",
    gradient: "from-cyan-500 to-blue-600",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    icon: Terminal,
    title: "Motor SQL Educativo",
    description:
      "Observa el código SQL generándose en tiempo real mientras haces clic, o escribe tus propias consultas en la consola nativa.",
    gradient: "from-emerald-500 to-teal-600",
    glow: "group-hover:shadow-emerald-500/20",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-4 relative">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 text-xs text-primary font-medium">
            Funcionalidades clave
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Todo lo que necesitas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una plataforma completa para explorar, limpiar y visualizar datos —
            sin escribir una sola línea de código.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              className="group relative p-8 bg-card/50 backdrop-blur-sm border-border hover:border-primary/40 transition-all duration-500 hover:shadow-xl overflow-hidden"
            >
              {/* Hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/5 transition-all duration-500 rounded-lg" />

              <div className="relative z-10">
                <div
                  className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg ${feature.glow}`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
