import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg">
              F
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold text-primary">FAETERJ-Rio</h1>
              <p className="text-xs text-muted-foreground">Rio de Janeiro</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Início
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Sobre
            </Link>
            <Link
              to="/courses"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Cursos
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Contato
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-2">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              to="/courses"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cursos
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contato
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
