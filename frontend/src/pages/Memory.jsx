import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, fmtTime } from "@/lib/api";
import { PageHeader, Empty } from "@/components/Common";

export default function Memory() {
  const [items, setItems] = useState(null);
  useEffect(() => { api.get("/learnings").then((r) => setItems(r.data)); }, []);
  return (
    <div data-testid="memory-page">
      <PageHeader eyebrow="Self-Evolution" title="Strategy memory" />
      <p className="text-sm text-muted-foreground max-w-2xl mb-8 leading-relaxed">
        After every run the Meta-Learner distils lessons from the critic debate and bias audit. The 12 most recent lessons are injected into every agent's
        instructions on the next run — the foundry rewrites its own strategy as it works.
      </p>
      {items && items.length === 0 && <Empty testid="memory-empty">No lessons learned yet.</Empty>}
      <ol className="space-y-3">
        {items?.map((l, i) => (
          <li key={l.id} data-testid={`lesson-${l.id}`} style={{ animationDelay: `${i * 30}ms` }} className="rise bg-card border p-6 flex gap-6">
            <span className="font-mono text-2xl font-bold text-accent w-12 shrink-0">{String(items.length - i).padStart(2, "0")}</span>
            <div>
              <p className="text-sm leading-relaxed">{l.lesson}</p>
              <div className="font-mono text-[11px] text-muted-foreground mt-2">
                {i < 12 && <span className="text-primary mr-2">ACTIVE ·</span>}
                {fmtTime(l.created_at)} · <Link to={`/runs/${l.run_id}`} className="hover:text-primary transition-colors">from run {l.run_id.slice(0, 8)}</Link>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
