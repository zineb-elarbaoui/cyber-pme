// @ts-nocheck
// Ignore TypeScript errors in this file to avoid local type/package issues
import { Link, useRouterState } from "@tanstack/react-router";
import { Shield, LayoutDashboard, ClipboardList, History, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Accueil", icon: Shield },
  { to: "/profile", label: "Profil PME", icon: ClipboardList },
  { to: "/assessment", label: "Questionnaire", icon: ClipboardList },
  { to: "/results", label: "Résultats", icon: LayoutDashboard },
  { to: "/history", label: "Historique", icon: History },
] as const;

export function AppShell({ children, crumbs }: { children: ReactNode; crumbs?: { label: string; to?: string }[] }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-elegant">
              <Shield className="h-5 w-5" strokeWidth={2.4} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[var(--primary-accent)]" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-semibold tracking-tight">CyberDiag PME</div>
              <div className="text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">CMRPI × AUSIM</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
                    (active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")
                  }
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <Link
            to="/assessment"
            className="hidden rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-elegant transition hover:opacity-95 md:inline-flex"
          >
            Démarrer un diagnostic
          </Link>
        </div>
        {crumbs && crumbs.length > 0 && (
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-6 pb-3 text-xs text-muted-foreground">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {c.to ? (
                  <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
                ) : (
                  <span className="text-foreground">{c.label}</span>
                )}
              </span>
            ))}
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="mt-24 border-t border-border/70 bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-8 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>© 2026 CyberDiag PME · Projet PFA · Partenariat CMRPI / AUSIM</div>
            <div className="flex gap-4">
              <span>Loi 09-08</span>
              <span>Guide ANRT PME</span>
              <span>CERT-MA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}