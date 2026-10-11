import { useState } from "react";
import { Star, CaretDown, Warning } from "@phosphor-icons/react";
import { api } from "@/lib/api";

const Score = ({ label, v, testid }) => (
  <div data-testid={testid}>
    <div className="label-xs">{label}</div>
    <div className="flex items-center gap-2 mt-1">
      <span className="font-mono text-lg font-bold">{v}</span>
      <div className="h-1 w-16 bg-secondary"><div className="h-1 bg-accent" style={{ width: `${v}%` }} /></div>
    </div>
  </div>
);

const VERDICT = { accept: "bg-[hsl(var(--success))] text-background", revise: "bg-accent text-accent-foreground", reject: "bg-destructive text-destructive-foreground" };

export const InsightCard = ({ insight: i, onChange }) => {
  const [open, setOpen] = useState(false);
  const [starred, setStarred] = useState(i.starred);
  const toggleStar = async () => {
    const { data } = await api.post(`/insights/${i.id}/star`);
    setStarred(data.starred);
    onChange && onChange();
  };
  return (
    <article data-testid={`insight-card-${i.id}`} className="bg-card border p-7 rise hover:border-primary/60 transition-colors">
      <div className="flex items-start gap-4">
        <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 ${VERDICT[i.verdict] || VERDICT.revise}`}>{i.verdict}</span>
        <h3 className="text-xl font-bold tracking-tight flex-1">{i.title}</h3>
        <button data-testid={`insight-star-${i.id}`} onClick={toggleStar} className="text-muted-foreground hover:text-accent transition-colors">
          <Star size={20} weight={starred ? "fill" : "regular"} className={starred ? "text-accent" : ""} />
        </button>
      </div>
      <p className="mt-4 text-sm leading-relaxed">{i.statement}</p>
      <div className="flex flex-wrap gap-8 mt-5">
        <Score label="Novelty" v={i.novelty} testid={`insight-novelty-${i.id}`} />
        <Score label="Confidence" v={i.confidence} testid={`insight-confidence-${i.id}`} />
        <Score label="Rigor" v={i.rigor} testid={`insight-rigor-${i.id}`} />
        {i.targets?.length > 0 && (
          <div><div className="label-xs">Targets</div><div className="font-mono text-sm mt-1">{i.targets.join(" · ")}</div></div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-5">
        {i.citations?.map((c) => (
          <a key={c.type + c.id} href={c.url} target="_blank" rel="noreferrer" data-testid={`citation-${c.id}`}
            className="font-mono text-[11px] border px-2 py-1 text-muted-foreground hover:text-primary hover:border-primary transition-colors">
            {c.type === "pubmed" ? "PMID " : ""}{c.id}
          </a>
        ))}
      </div>
      <button data-testid={`insight-expand-${i.id}`} onClick={() => setOpen(!open)}
        className="mt-5 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
        <CaretDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} /> Mechanism, debate & bias audit
      </button>
      {open && (
        <div className="mt-4 grid md:grid-cols-2 gap-6 text-sm border-t pt-5">
          <div><div className="label-xs mb-1">Mechanism</div><p className="leading-relaxed">{i.mechanism}</p></div>
          <div><div className="label-xs mb-1">Proposed validation</div><p className="leading-relaxed">{i.proposed_validation}</p></div>
          <div><div className="label-xs mb-1">Critic objection</div><p className="leading-relaxed">{i.debate?.objection}</p></div>
          <div><div className="label-xs mb-1">Defender rebuttal</div><p className="leading-relaxed">{i.debate?.rebuttal}</p></div>
          {i.bias_flags?.length > 0 && (
            <div className="md:col-span-2">
              <div className="label-xs mb-2">Bias flags</div>
              {i.bias_flags.map((f, k) => (
                <div key={k} className="flex gap-2 mb-2"><Warning size={16} className="text-accent shrink-0 mt-0.5" />
                  <span><b className="font-mono text-xs uppercase">{f.type} · {f.severity}</b> — {f.description} <i className="text-muted-foreground">Correction: {f.correction}</i></span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
};
