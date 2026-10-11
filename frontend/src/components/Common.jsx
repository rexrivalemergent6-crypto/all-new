export const PageHeader = ({ eyebrow, title, children }) => (
  <div className="flex items-end justify-between gap-6 mb-10 rise">
    <div>
      <div className="label-xs">{eyebrow}</div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-2">{title}</h1>
    </div>
    {children}
  </div>
);

export const Stat = ({ label, value, testid, accent }) => (
  <div data-testid={testid} className="bg-card border p-6 hover:-translate-y-0.5 transition-transform">
    <div className="label-xs">{label}</div>
    <div className={`font-mono text-3xl font-bold mt-3 ${accent || ""}`}>{value}</div>
  </div>
);

export const StatusBadge = ({ status, testid }) => {
  const c = {
    completed: "text-[hsl(var(--success))] border-[hsl(var(--success))]",
    done: "text-[hsl(var(--success))] border-[hsl(var(--success))]",
    running: "text-primary border-primary",
    queued: "text-muted-foreground border-border",
    failed: "text-destructive border-destructive",
  }[status] || "text-muted-foreground border-border";
  return (
    <span data-testid={testid} className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5 ${c}`}>
      {status === "running" && <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />}
      {status}
    </span>
  );
};

export const Empty = ({ children, testid }) => (
  <div data-testid={testid} className="border border-dashed p-12 text-sm text-muted-foreground">{children}</div>
);
