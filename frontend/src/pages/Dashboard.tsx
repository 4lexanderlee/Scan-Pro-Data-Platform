import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  Plus,
  Trash2,
  FolderOpen,
  Database,
  ArrowRight,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Workspace from "@/components/workspace/Workspace";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

const MAX_PROJECTS = 5;

interface Project {
  id: string;
  name: string;
  description: string;
  datasetName?: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    // Get user from Supabase
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]");
    setProjects(savedProjects);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    navigate("/");
  };

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter((p) => p.id !== projectId);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
    if (activeProject?.id === projectId) setActiveProject(null);
    toast({
      title: "Proyecto eliminado",
      description: "El proyecto ha sido eliminado correctamente.",
    });
  };

  const handleCreateProject = () => {
    if (!projectName.trim()) {
      toast({ title: "Nombre requerido", description: "Añade un nombre al proyecto." });
      return;
    }
    const newProject: Project = {
      id: Date.now().toString(),
      name: projectName.trim(),
      description: projectDescription.trim(),
      createdAt: new Date().toISOString(),
    };
    const saved = JSON.parse(localStorage.getItem("projects") || "[]");
    saved.push(newProject);
    localStorage.setItem("projects", JSON.stringify(saved));
    setProjects(saved);
    setIsNewProjectOpen(false);
    setProjectName("");
    setProjectDescription("");
    toast({
      title: "¡Proyecto creado!",
      description: `"${newProject.name}" listo para analizar.`,
    });
    // Auto-open the new project workspace
    setActiveProject(newProject);
  };

  if (!user) return null;

  // ── WORKSPACE VIEW ──────────────────────────────────────────────────────
  if (activeProject) {
    return (
      <Workspace
        projectName={activeProject.name}
        projectId={activeProject.id}
        onClose={() => setActiveProject(null)}
      />
    );
  }

  // ── PROJECT LIST VIEW ───────────────────────────────────────────────────
  const atLimit = projects.length >= MAX_PROJECTS;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-lg font-bold text-primary-foreground">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold leading-none">Scan Pro</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Bienvenido/a,{" "}
                <span className="text-foreground font-medium">{user.user_metadata?.nickname || 'Usuario'}</span>
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold">Mis Proyectos</h2>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <span>
                {projects.length} de {MAX_PROJECTS} proyectos utilizados
              </span>
              {atLimit && (
                <Badge variant="outline" className="text-amber-400 border-amber-400/40 text-xs">
                  Límite alcanzado
                </Badge>
              )}
            </p>
          </div>

          <Button
            size="lg"
            disabled={atLimit}
            onClick={() => setIsNewProjectOpen(true)}
            className="gap-2 shrink-0"
          >
            <Plus className="h-5 w-5" />
            Crear Nuevo Proyecto
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
              style={{ width: `${(projects.length / MAX_PROJECTS) * 100}%` }}
            />
          </div>
        </div>

        {/* Empty state */}
        {projects.length === 0 ? (
          <Card className="border-dashed border-2 border-border bg-card/30">
            <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <FolderOpen className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1">Sin proyectos aún</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Crea tu primer proyecto para empezar a explorar y limpiar tus datos sin código.
                </p>
              </div>
              <Button onClick={() => setIsNewProjectOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear primer proyecto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="group cursor-pointer bg-card/50 border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setActiveProject(project)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <Database className="h-5 w-5 text-primary" />
                    </div>
                    <div
                      className="flex items-center gap-1 text-muted-foreground"
                      onClick={(e) => handleDeleteProject(project.id, e)}
                    >
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                    {project.name}
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {project.description || "Sin descripción"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(project.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Abrir
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add project card */}
            {!atLimit && (
              <Card
                className="cursor-pointer border-dashed border-2 border-border bg-transparent hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 flex items-center justify-center min-h-[160px]"
                onClick={() => setIsNewProjectOpen(true)}
              >
                <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors p-6">
                  <Plus className="h-8 w-8" />
                  <span className="text-sm font-medium">Nuevo proyecto</span>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Stats bar */}
        {projects.length > 0 && (
          <div className="mt-10 pt-6 border-t border-border grid grid-cols-3 gap-4">
            {[
              { label: "Proyectos activos", value: projects.length },
              { label: "Slots disponibles", value: MAX_PROJECTS - projects.length },
              { label: "Plan", value: "Gratuito" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Project Dialog */}
      <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Nuevo Proyecto
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="projectName">Nombre del proyecto</Label>
              <Input
                id="projectName"
                placeholder="Ej: Análisis de ventas 2024"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateProject()}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="projectDescription">Descripción (opcional)</Label>
              <Textarea
                id="projectDescription"
                placeholder="Describe brevemente el objetivo de este análisis..."
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsNewProjectOpen(false)}
              >
                Cancelar
              </Button>
              <Button className="flex-1 gap-1.5" onClick={handleCreateProject}>
                Crear proyecto
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
