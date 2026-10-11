import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, fmtTime } from "@/lib/api";
import { PageHeader, StatusBadge, Empty } from "@/components/Common";
import { NewRunForm } from "@/components/NewRunForm";

export default function Runs() {
  const [runs, setRuns] = useState(null);
  useEffect(() => {
    const load = () => api.get("/runs").then((r) => setRuns(r.data));
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);
  return (
    <div data-testid="runs-page">
      <PageHeader eyebrow="Orchestrator" title="Research runs" />
      <div className="mb-8"><NewRunForm /></div>
      {runs && runs.length === 0 && <Empty testid="runs-empty">No runs yet. Launch one above.</Empty>}
      <div className="border bg-card">
        {runs?.map((r, i) => (
          <Link key={r.id} to={`/runs/${r.id}`} data-testid={`run-row-${r.id}`} style={{ animationDelay: `${i * 30}ms` }}
            className="rise grid grid-cols-12 gap-4 items-center px-6 py-5 border-b last:border-b-0 hover:bg-secondary transition-colors">
            <div className="col-span-6 text-sm">{r.goal}</div>
            <div className="col-span-2"><StatusBadge status={r.status} /></div>
            <div className="col-span-1 font-mono text-xs">{r.insight_ids?.length || 0} ins.</div>
            <div className="col-span-1 font-mono text-xs uppercase text-muted-foreground">{r.origin}</div>
            <div className="col-span-2 font-mono text-[11px] text-muted-foreground text-right">{fmtTime(r.created_at)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
