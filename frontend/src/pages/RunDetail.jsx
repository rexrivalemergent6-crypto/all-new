import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { api, fmtTime } from "@/lib/api";
import { StatusBadge, Empty } from "@/components/Common";
import { StepCard } from "@/components/StepCard";
import { InsightCard } from "@/components/InsightCard";

export default function RunDetail() {
  const { id } = useParams();
  const [run, setRun] = useState(null);

  useEffect(() => {
    let t;
    const load = async () => {
      const { data } = await api.get(`/runs/${id}`);
      setRun(data);
      if (["queued", "running"].includes(data.status)) t = setTimeout(load, 2500);
    };
    load();
    return () => clearTimeout(t);
  }, [id]);

  if (!run) return <div className="text-sm text-muted-foreground">Loading run…</div>;
  return (
    <div data-testid="run-detail-page">
      <Link to="/runs" data-testid="back-to-runs" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={14} /> All runs
      </Link>
      <div className="flex items-start gap-4 mb-2 rise">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex-1" data-testid="run-goal">{run.goal}</h1>
        <StatusBadge status={run.status} testid="run-status" />
      </div>
      <div className="font-mono text-[11px] text-muted-foreground mb-10">
        RUN {run.id.slice(0, 8)} · {run.origin} · started {fmtTime(run.started_at)} {run.finished_at && `· finished ${fmtTime(run.finished_at)}`}
        {run.bias_risk && ` · bias risk ${run.bias_risk}`}
      </div>
      {run.error && <div data-testid="run-error" className="border border-destructive text-destructive p-4 text-sm mb-8">{run.error}</div>}
      <div className="grid xl:grid-cols-5 gap-10">
        <section className="xl:col-span-2">
          <div className="label-xs mb-4">Agent execution trace</div>
          <div className="relative space-y-3 before:absolute before:left-4 before:top-0 before:bottom-0 before:w-px before:bg-border" data-testid="step-list">
            {run.steps.length === 0 && <div className="pl-10 text-sm text-muted-foreground">Orchestrator is waking up…</div>}
            {run.steps.map((s, i) => <StepCard key={s.id} step={s} index={i} />)}
          </div>
        </section>
        <section className="xl:col-span-3">
          <div className="label-xs mb-4">Delivered insights</div>
          <div className="space-y-4" data-testid="run-insights">
            {run.insights.length === 0
              ? <Empty>{run.status === "failed" ? "Run failed before insights were produced." : "Insights appear after hypothesis generation, debate and bias audit complete (≈2–4 min)."}</Empty>
              : run.insights.map((i) => <InsightCard key={i.id} insight={i} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
