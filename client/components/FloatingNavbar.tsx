import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLogoColor } from "@/hooks/useLogoColor";

export function FloatingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrolled, logoColor } = useLogoColor();

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Institucional", href: "/about" },
    { label: "Ingresso", href: "/admission" },
    { label: "Ementas", href: "/matriz-ementas" },
    {
      label: "Central de Atendimento",
      href: "https://faeterj-rio.edu.br/central/",
      external: true,
    },
    {
      label: "Estágio",
      href: "https://docs.google.com/forms/d/e/1FAIpQLScS4E8iq0V2YiGA0ygjsBciCM9AIr7ptzhesl7GDIlwtOi_JA/viewform",
      external: true,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-soft border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 font-bold text-xl">
            <img
              src="/logo_faeterj.svg"
              alt="FAETERJ Logo"
              className="w-10 h-10 transition-all duration-300"
              style={{
                filter: scrolled
                  ? 'invert(1) saturate(0.4) brightness(0.5) hue-rotate(210deg)'
                  : 'invert(1)',
                opacity: 1,
              }}
            />
            <span
              className={`transition-colors ${
                scrolled ? "text-primary" : "text-white"
              }`}
            >
              FAETERJ-Rio
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {menuItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-foreground hover:text-primary"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <a
              href="https://faeterj-rio.edu.br/coruja/autenticar/login_controle.php"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:block px-6 py-2 rounded-lg border-2 font-semibold transition-colors ${
                scrolled
                  ? "border-primary text-primary hover:bg-primary/5"
                  : "border-white text-white hover:bg-white/10"
              }`}
            >
              Portal Coruja
            </a>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className={scrolled ? "text-primary" : "text-white"} />
              ) : (
                <Menu className={scrolled ? "text-primary" : "text-white"} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden pb-4 border-t transition-all ${
              scrolled
                ? "border-border bg-white"
                : "border-white/20 bg-primary/95"
            }`}
          >
            {menuItems.map((item) =>
              item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-foreground hover:text-primary hover:bg-secondary"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`block px-4 py-3 text-sm font-medium transition-colors ${
                    scrolled
                      ? "text-foreground hover:text-primary hover:bg-secondary"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <a
              href="https://faeterj-rio.edu.br/coruja/autenticar/login_controle.php"
              target="_blank"
              rel="noopener noreferrer"
              className={`block px-4 py-3 mt-2 mx-4 text-center rounded-lg font-semibold border-2 transition-colors ${
                scrolled
                  ? "border-primary text-primary hover:bg-primary/5"
                  : "border-white text-white hover:bg-white/10"
              }`}
            >
              Portal Coruja
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
