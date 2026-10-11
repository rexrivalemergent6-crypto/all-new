import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { AGENT_COLORS, fmtTime } from "@/lib/api";
import { StatusBadge } from "@/components/Common";

const NAMES = { orchestrator: "Master Orchestrator", literature: "Literature Scout", trials: "Clinical Trials Analyst", genetics: "Genetic Target Analyst", hypothesis: "Hypothesis Generator", critic: "Adversarial Critic", bias: "Bias Auditor", learner: "Meta-Learner" };

const Sources = ({ o }) => (
  <div className="space-y-1 mb-4">
    {o.papers?.map((p) => (
      <a key={p.pmid} href={p.url} target="_blank" rel="noreferrer" className="block text-xs hover:text-primary transition-colors">
        <span className="font-mono text-muted-foreground">PMID {p.pmid} · {p.year}</span> — {p.title}
      </a>
    ))}
    {o.trials?.map((t) => (
      <a key={t.nct_id} href={t.url} target="_blank" rel="noreferrer" className="block text-xs hover:text-primary transition-colors">
        <span className="font-mono text-muted-foreground">{t.nct_id} · {t.status} · {(t.phases || []).join("/")}</span> — {t.title}
      </a>
    ))}
    {o.targets && (
      <div className="flex flex-wrap gap-1.5">
        {o.targets.map((t) => (
          <a key={t.symbol} href={t.url} target="_blank" rel="noreferrer" className="font-mono text-[11px] border px-2 py-0.5 hover:border-primary transition-colors">
            {t.symbol} {t.score}
          </a>
        ))}
      </div>
    )}
  </div>
);

export const StepCard = ({ step, index }) => {
  const [open, setOpen] = useState(false);
  const o = step.output || {};
  const { papers, trials, targets, ...rest } = o;
  return (
    <div data-testid={`step-${step.agent}-${index}`} style={{ animationDelay: `${index * 60}ms` }} className="rise relative pl-10">
      <span className={`absolute left-[11px] top-6 w-2.5 h-2.5 ${AGENT_COLORS[step.agent] || "bg-primary"}`} />
      <div className="bg-card border">
        <button data-testid={`step-toggle-${index}`} onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-secondary transition-colors">
          <div className="flex-1 min-w-0">
            <div className="label-xs">{NAMES[step.agent] || step.agent}</div>
            <div className="text-sm mt-0.5">{step.action}</div>
          </div>
          <span className="font-mono text-[11px] text-muted-foreground hidden md:block">{fmtTime(step.started_at)}</span>
          <StatusBadge status={step.status} />
          <CaretDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open && step.output && (
          <div className="border-t px-6 py-5">
            <Sources o={{ papers, trials, targets }} />
            <pre className="font-mono text-[11px] leading-relaxed whitespace-pre-wrap break-words max-h-[420px] overflow-auto bg-background border p-4">
              {JSON.stringify(rest, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
