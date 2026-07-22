import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, UserPlus, KeyRound, ArrowRight, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "register" | "recover";
}

const AuthModal = ({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Login state ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // --- Register state ---
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [showRegPwd, setShowRegPwd] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  // --- Recover state ---
  const [recoverEmail, setRecoverEmail] = useState("");
  const [recoverSent, setRecoverSent] = useState(false);

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Campos requeridos", description: "Completa email y contraseña." });
      return;
    }
    setLoginLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const users: any[] = JSON.parse(localStorage.getItem("users") || "[]");
    const match = users.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );
    setLoginLoading(false);
    if (!match) {
      toast({
        title: "Credenciales incorrectas",
        description: "Revisa tu email o contraseña.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(match));
    toast({ title: `¡Bienvenido/a de nuevo, ${match.name}! 👋` });
    onOpenChange(false);
    navigate("/dashboard");
  };

  const handleRegister = async () => {
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      toast({ title: "Campos requeridos", description: "Completa todos los campos." });
      return;
    }
    if (regPassword !== regConfirm) {
      toast({ title: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }
    if (regPassword.length < 6) {
      toast({ title: "Contraseña muy corta", description: "Mínimo 6 caracteres." });
      return;
    }
    setRegLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const users: any[] = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === regEmail)) {
      setRegLoading(false);
      toast({
        title: "Email ya registrado",
        description: "Intenta iniciar sesión.",
        variant: "destructive",
      });
      return;
    }
    const newUser = { id: Date.now().toString(), name: regName, email: regEmail, password: regPassword };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));
    setRegLoading(false);
    toast({ title: `¡Cuenta creada! Bienvenido/a, ${regName} 🚀` });
    onOpenChange(false);
    navigate("/dashboard");
  };

  const handleRecover = () => {
    if (!recoverEmail) {
      toast({ title: "Ingresa tu email." });
      return;
    }
    setRecoverSent(true);
    toast({
      title: "Enlace enviado",
      description: `Si el email existe, recibirás instrucciones en ${recoverEmail}.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-background/95 backdrop-blur-xl p-0 overflow-hidden">
        {/* Gradient top strip */}
        <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-accent" />

        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Scan Pro
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground text-sm">
              Explora tus datos. Sin código.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50">
              <TabsTrigger value="login" className="gap-1.5 text-xs sm:text-sm">
                <LogIn className="h-3.5 w-3.5" />
                Iniciar sesión
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-1.5 text-xs sm:text-sm">
                <UserPlus className="h-3.5 w-3.5" />
                Registrarse
              </TabsTrigger>
              <TabsTrigger value="recover" className="gap-1.5 text-xs sm:text-sm">
                <KeyRound className="h-3.5 w-3.5" />
                Recuperar
              </TabsTrigger>
            </TabsList>

            {/* ── LOGIN TAB ── */}
            <TabsContent value="login" className="space-y-4 mt-0">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Correo electrónico</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    className="bg-muted/30 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowLoginPwd(!showLoginPwd)}
                  >
                    {showLoginPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                className="w-full gap-2 mt-2"
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <span className="animate-pulse">Verificando...</span>
                ) : (
                  <>
                    Iniciar sesión
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </TabsContent>

            {/* ── REGISTER TAB ── */}
            <TabsContent value="register" className="space-y-4 mt-0">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Nombre o nickname</Label>
                <Input
                  id="reg-name"
                  placeholder="Ej: data_wizard"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Correo electrónico</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="reg-password"
                    type={showRegPwd ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="bg-muted/30 pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowRegPwd(!showRegPwd)}
                  >
                    {showRegPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reg-confirm">Confirmar contraseña</Label>
                <Input
                  id="reg-confirm"
                  type="password"
                  placeholder="Repite tu contraseña"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  className="bg-muted/30"
                />
              </div>
              <Button
                className="w-full gap-2 mt-2"
                onClick={handleRegister}
                disabled={regLoading}
              >
                {regLoading ? (
                  <span className="animate-pulse">Creando cuenta...</span>
                ) : (
                  <>
                    Crear cuenta gratis
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </TabsContent>

            {/* ── RECOVER TAB ── */}
            <TabsContent value="recover" className="space-y-4 mt-0">
              {recoverSent ? (
                <div className="text-center py-6 space-y-3">
                  <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                    <KeyRound className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Revisa tu bandeja de entrada en{" "}
                    <span className="text-foreground font-medium">{recoverEmail}</span>
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRecoverSent(false)}
                  >
                    Intentar con otro correo
                  </Button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                  <div className="space-y-1.5">
                    <Label htmlFor="recover-email">Correo electrónico</Label>
                    <Input
                      id="recover-email"
                      type="email"
                      placeholder="tu@correo.com"
                      value={recoverEmail}
                      onChange={(e) => setRecoverEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleRecover()}
                      className="bg-muted/30"
                    />
                  </div>
                  <Button className="w-full gap-2 mt-2" onClick={handleRecover}>
                    Enviar enlace de recuperación
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
