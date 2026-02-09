import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginCoruja() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Side - Art and Motivation */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 500 500"
            preserveAspectRatio="xMidYMid slice"
          >
            <circle cx="100" cy="100" r="60" fill="white" opacity="0.1" />
            <circle cx="400" cy="400" r="80" fill="white" opacity="0.1" />
            <circle cx="100" cy="400" r="50" fill="white" opacity="0.08" />
            <rect
              x="50"
              y="200"
              width="100"
              height="100"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.1"
            />
            <path
              d="M 200 100 L 300 200 L 200 300 L 100 200 Z"
              fill="none"
              stroke="white"
              strokeWidth="2"
              opacity="0.1"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 border border-white/30">
              <svg
                className="w-10 h-10 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 1C5.4 1 0 6.4 0 13c0 7.7 12 23 12 23s12-15.3 12-23c0-6.6-5.4-12-12-12zm0 19c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Bem-vindo de Volta
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Acesse seu portal acadêmico e acompanhe suas notas, horários e
              comunicados importantes.
            </p>
            <p className="text-white/70 text-sm font-medium">
              "O futuro pertence àqueles que acreditam na beleza de seus
              sonhos." — Eleanor Roosevelt
            </p>
          </div>

          {/* Illustration */}
          <div className="mt-12 w-48 h-48 mx-auto">
            <svg
              viewBox="0 0 200 200"
              preserveAspectRatio="xMidYMid meet"
              className="w-full h-full"
            >
              {/* Computer */}
              <rect
                x="30"
                y="80"
                width="140"
                height="80"
                rx="4"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.3"
              />
              <rect
                x="50"
                y="100"
                width="100"
                height="50"
                fill="none"
                stroke="white"
                strokeWidth="2"
                opacity="0.4"
              />
              {/* Screen glow */}
              <circle cx="100" cy="125" r="35" fill="white" opacity="0.1" />
              {/* Stand */}
              <rect
                x="95"
                y="160"
                width="10"
                height="15"
                fill="white"
                opacity="0.3"
              />
              {/* Code lines */}
              <line
                x1="60"
                y1="110"
                x2="140"
                y2="110"
                stroke="white"
                strokeWidth="1"
                opacity="0.2"
              />
              <line
                x1="60"
                y1="120"
                x2="130"
                y2="120"
                stroke="white"
                strokeWidth="1"
                opacity="0.2"
              />
              <line
                x1="60"
                y1="130"
                x2="140"
                y2="130"
                stroke="white"
                strokeWidth="1"
                opacity="0.2"
              />
              <line
                x1="60"
                y1="140"
                x2="120"
                y2="140"
                stroke="white"
                strokeWidth="1"
                opacity="0.2"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-white mb-6">
              <span className="text-2xl font-bold">F</span>
            </div>
            <h1 className="text-2xl font-bold text-primary mb-2">
              Bem-vindo ao Coruja
            </h1>
            <p className="text-foreground/60">Portal do Aluno FAETERJ-Rio</p>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-12">
            <h1 className="text-3xl font-bold text-primary mb-2">
              Acessar Portal
            </h1>
            <p className="text-foreground/60">
              Entre com suas credenciais de aluno
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Email Input with Floating Label */}
            <div className="relative">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(email === "")}
                className="w-full px-4 pt-6 pb-3 border-2 border-border rounded-lg peer focus:border-primary focus:outline-none transition-colors bg-white"
                placeholder=" "
              />
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all pointer-events-none ${
                  emailFocused || email
                    ? "top-2 text-xs text-primary font-medium"
                    : "top-1/2 -translate-y-1/2 text-foreground/60"
                }`}
              >
                E-mail ou Matrícula
              </label>
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
            </div>

            {/* Password Input with Floating Label */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(password === "")}
                className="w-full px-4 pt-6 pb-3 border-2 border-border rounded-lg peer focus:border-primary focus:outline-none transition-colors bg-white"
                placeholder=" "
              />
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all pointer-events-none ${
                  passwordFocused || password
                    ? "top-2 text-xs text-primary font-medium"
                    : "top-1/2 -translate-y-1/2 text-foreground/60"
                }`}
              >
                Senha
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-border"
                />
                <span className="text-foreground/60">Lembrar-me</span>
              </label>
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group"
            >
              Entrar
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-foreground/40">OU</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Support Link */}
          <div className="text-center p-4 bg-secondary rounded-lg">
            <p className="text-sm text-foreground/60 mb-2">
              Problemas ao acessar?
            </p>
            <a
              href="https://faeterj-rio.edu.br/central/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
            >
              Entre em contato com o suporte
            </a>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-xs text-foreground/40">
              Desenvolvido com{" "}
              <span className="text-primary font-semibold">
                tecnologia FAETERJ-Rio
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
