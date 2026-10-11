import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

const EXAMPLES = [
  "Identify novel links between microglial TREM2 signaling and tau propagation",
  "Find repurposable metabolic drugs targeting insulin resistance in early Alzheimer's",
  "Explore the role of APOE4 in blood-brain barrier breakdown and amyloid clearance",
];

export const NewRunForm = () => {
  const [goal, setGoal] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const submit = async () => {
    if (goal.trim().length < 5) return toast.error("Describe a research goal (5+ characters)");
    setBusy(true);
    try {
      const { data } = await api.post("/runs", { goal: goal.trim() });
      toast.success("Orchestrator dispatched");
      nav(`/runs/${data.id}`);
    } catch (e) {
      toast.error("Failed to start run");
      setBusy(false);
    }
  };

  return (
    <div className="bg-card border p-8" data-testid="new-run-form">
      <div className="label-xs mb-3">Dispatch Master Orchestrator</div>
      <Textarea data-testid="goal-input" value={goal} onChange={(e) => setGoal(e.target.value)} rows={3}
        placeholder="State a research goal. The orchestrator will plan, dispatch sub-agents to live data sources, debate and deliver insights."
        className="rounded-none text-base bg-background resize-none focus-visible:ring-1" />
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {EXAMPLES.map((e, i) => (
          <button key={i} data-testid={`example-goal-${i}`} onClick={() => setGoal(e)}
            className="text-xs border px-3 py-1.5 text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
            {e.length > 52 ? e.slice(0, 52) + "…" : e}
          </button>
        ))}
        <button data-testid="start-run-btn" onClick={submit} disabled={busy}
          className="ml-auto inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-medium hover:gap-3 active:scale-[0.98] transition-[gap,transform,opacity] disabled:opacity-60">
          {busy ? <CircleNotch className="animate-spin" size={16} /> : null} Launch run <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
