import { useEffect, useState } from "react";
import { api, AGENT_COLORS, fmtTime } from "@/lib/api";
import { PageHeader } from "@/components/Common";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  useEffect(() => { api.get("/agents").then((r) => setAgents(r.data)); }, []);
  return (
    <div data-testid="agents-page">
      <PageHeader eyebrow="Agent Registry Service" title="Registered agents" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agents.map((a, i) => (
          <div key={a.key} data-testid={`agent-card-${a.key}`} style={{ animationDelay: `${i * 50}ms` }}
            className={`rise bg-card border p-6 hover:-translate-y-1 transition-transform ${i === 0 ? "md:col-span-2 lg:row-span-2" : ""}`}>
            <div className="flex items-center justify-between">
              <span className={`w-3 h-3 ${AGENT_COLORS[a.key]}`} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[hsl(var(--success))]">{a.status}</span>
            </div>
            <h3 className={`font-bold tracking-tight mt-6 ${i === 0 ? "text-3xl" : "text-xl"}`}>{a.name}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.role}</p>
            <div className="mt-6 pt-4 border-t space-y-2 font-mono text-[11px]">
              <div className="flex justify-between"><span className="text-muted-foreground">SOURCE</span><span className="text-right">{a.source}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">COMPLETED</span><span data-testid={`agent-completed-${a.key}`}>{a.tasks_completed}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">FAILED</span><span>{a.tasks_failed}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">LAST ACTIVE</span><span>{fmtTime(a.last_active)}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
