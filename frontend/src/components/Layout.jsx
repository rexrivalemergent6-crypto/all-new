import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { SquaresFour, Flask, Lightbulb, Robot, ListMagnifyingGlass, CalendarCheck, Brain, Sun, Moon } from "@phosphor-icons/react";

const NAV = [
  { to: "/", label: "Command", icon: SquaresFour, id: "dashboard" },
  { to: "/runs", label: "Research Runs", icon: Flask, id: "runs" },
  { to: "/insights", label: "Insights", icon: Lightbulb, id: "insights" },
  { to: "/agents", label: "Agent Registry", icon: Robot, id: "agents" },
  { to: "/schedules", label: "Autonomy", icon: CalendarCheck, id: "schedules" },
  { to: "/memory", label: "Strategy Memory", icon: Brain, id: "memory" },
  { to: "/audit", label: "Audit Trail", icon: ListMagnifyingGlass, id: "audit" },
];

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return (
    <button data-testid="theme-toggle-btn" onClick={() => setDark(!dark)}
      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
      {dark ? <Sun size={16} /> : <Moon size={16} />} {dark ? "Light mode" : "Dark mode"}
    </button>
  );
};

export default function Layout() {
  return (
    <div className="grain min-h-screen flex">
      <aside className="w-64 shrink-0 border-r bg-card fixed inset-y-0 left-0 flex flex-col z-40" data-testid="sidebar">
        <div className="px-6 py-7 border-b">
          <div className="label-xs">Agentic Research Foundry</div>
          <div className="font-display text-2xl font-extrabold tracking-tight mt-1">
            Alz<span className="text-primary">Nexus</span>
          </div>
        </div>
        <nav className="flex-1 py-4">
          {NAV.map(({ to, label, icon: Icon, id }) => (
            <NavLink key={to} to={to} end={to === "/"} data-testid={`nav-${id}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-2.5 text-sm border-l-2 transition-colors ${
                  isActive ? "border-primary text-foreground bg-secondary" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}>
              <Icon size={18} weight="duotone" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-6 py-5 border-t space-y-3">
          <ThemeToggle />
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            Live sources: PubMed · ClinicalTrials.gov · Open Targets. Reasoning: Claude Sonnet 4.5.
          </p>
        </div>
      </aside>
      <main className="flex-1 ml-64 min-w-0">
        <div className="max-w-[1400px] px-10 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
