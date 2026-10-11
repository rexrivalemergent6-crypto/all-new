import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Play, Trash } from "@phosphor-icons/react";
import { api, fmtTime } from "@/lib/api";
import { PageHeader, Empty } from "@/components/Common";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

export default function Schedules() {
  const [items, setItems] = useState([]);
  const [goal, setGoal] = useState("");
  const [hours, setHours] = useState(24);
  const nav = useNavigate();
  const load = () => api.get("/schedules").then((r) => setItems(r.data));
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (goal.trim().length < 5) return toast.error("Enter a research goal");
    await api.post("/schedules", { goal: goal.trim(), interval_hours: Number(hours), enabled: true });
    setGoal("");
    toast.success("Autonomous schedule created");
    load();
  };
  const toggle = async (s) => { await api.patch(`/schedules/${s.id}`, { enabled: !s.enabled }); load(); };
  const remove = async (s) => { await api.delete(`/schedules/${s.id}`); toast.success("Schedule removed"); load(); };
  const trigger = async (s) => { const { data } = await api.post(`/schedules/${s.id}/trigger`); nav(`/runs/${data.id}`); };

  return (
    <div data-testid="schedules-page">
      <PageHeader eyebrow="Indefinite Autonomous Operation" title="Autonomy schedules" />
      <div className="bg-card border p-8 mb-8">
        <div className="label-xs mb-3">New recurring research program</div>
        <div className="flex flex-wrap gap-3">
          <Input data-testid="schedule-goal-input" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="e.g. Track emerging neuroinflammation targets" className="flex-1 min-w-[280px] rounded-none" />
          <div className="flex items-center gap-2">
            <span className="label-xs">Every</span>
            <Input data-testid="schedule-hours-input" type="number" min={1} max={720} value={hours} onChange={(e) => setHours(e.target.value)} className="w-24 rounded-none font-mono" />
            <span className="label-xs">hours</span>
          </div>
          <button data-testid="create-schedule-btn" onClick={create} className="bg-primary text-primary-foreground px-6 py-2 text-sm hover:opacity-90 active:scale-[0.98] transition-[opacity,transform]">Create</button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">The platform scheduler pings the foundry every 15 minutes; due programs launch a full orchestrator run automatically.</p>
      </div>
      {items.length === 0 && <Empty testid="schedules-empty">No autonomous programs yet.</Empty>}
      <div className="border bg-card">
        {items.map((s) => (
          <div key={s.id} data-testid={`schedule-row-${s.id}`} className="grid grid-cols-12 gap-4 items-center px-6 py-5 border-b last:border-b-0">
            <div className="col-span-5 text-sm">{s.goal}</div>
            <div className="col-span-2 font-mono text-xs">every {s.interval_hours}h</div>
            <div className="col-span-2 font-mono text-[11px] text-muted-foreground">last: {fmtTime(s.last_run_at)}<br />runs: {s.runs_triggered}</div>
            <div className="col-span-3 flex items-center justify-end gap-4">
              <Switch data-testid={`schedule-toggle-${s.id}`} checked={s.enabled} onCheckedChange={() => toggle(s)} />
              <button data-testid={`schedule-trigger-${s.id}`} onClick={() => trigger(s)} title="Run now" className="text-muted-foreground hover:text-primary transition-colors"><Play size={18} /></button>
              <button data-testid={`schedule-delete-${s.id}`} onClick={() => remove(s)} title="Delete" className="text-muted-foreground hover:text-destructive transition-colors"><Trash size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
