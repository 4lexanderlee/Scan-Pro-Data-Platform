import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register" | "recover">("login");

  const isLoggedIn = !!localStorage.getItem("currentUser");

  const openAuth = (tab: "login" | "register" = "login") => {
    if (isLoggedIn) {
      navigate("/dashboard");
      return;
    }
    setAuthTab(tab);
    setAuthOpen(true);
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">S</span>
            </div>
            <span className="text-xl font-bold">Scan Pro</span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </a>
            <a
              href="#docs"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Documentación
            </a>

            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => openAuth("login")}
            >
              <LogIn className="h-4 w-4" />
              Iniciar sesión
            </Button>

            <Button variant="hero" size="sm" onClick={() => openAuth("register")}>
              Comenzar gratis
            </Button>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border p-4">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Features
              </a>
              <a
                href="#dashboard"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </a>
              <a
                href="#docs"
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Documentación
              </a>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5"
                onClick={() => openAuth("login")}
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Button>
              <Button
                variant="hero"
                size="sm"
                className="w-full"
                onClick={() => openAuth("register")}
              >
                Comenzar gratis
              </Button>
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultTab={authTab}
      />
    </>
  );
};

export default Navbar;
