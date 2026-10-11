import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, fmtTime } from "@/lib/api";
import { PageHeader } from "@/components/Common";

const AGENTS = ["", "orchestrator", "literature", "trials", "genetics", "hypothesis", "critic", "bias", "learner"];

export default function Audit() {
  const [logs, setLogs] = useState([]);
  const [agent, setAgent] = useState("");
  useEffect(() => { api.get(`/audit${agent ? `?agent=${agent}` : ""}`).then((r) => setLogs(r.data)); }, [agent]);
  return (
    <div data-testid="audit-page">
      <PageHeader eyebrow="Centralized Audit Logging" title="Audit trail">
        <select data-testid="audit-agent-filter" value={agent} onChange={(e) => setAgent(e.target.value)} className="bg-card border text-xs px-3 py-2">
          {AGENTS.map((a) => <option key={a} value={a}>{a || "All agents"}</option>)}
        </select>
      </PageHeader>
      <div className="overflow-auto border bg-card">
        <table className="w-full border-collapse text-sm" data-testid="audit-table">
          <thead>
            <tr className="text-left">
              {["Timestamp", "Agent", "Action", "Run", "Details"].map((h) => <th key={h} className="label-xs p-3 border-r border-b last:border-r-0">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-secondary transition-colors">
                <td className="font-mono text-[11px] p-3 border-r border-b whitespace-nowrap">{fmtTime(l.timestamp)}</td>
                <td className="font-mono text-[11px] p-3 border-r border-b uppercase">{l.agent}</td>
                <td className="p-3 border-r border-b">{l.action}</td>
                <td className="font-mono text-[11px] p-3 border-r border-b"><Link to={`/runs/${l.run_id}`} className="hover:text-primary transition-colors">{l.run_id?.slice(0, 8)}</Link></td>
                <td className="font-mono text-[11px] p-3 border-b text-muted-foreground break-all">{JSON.stringify(l.details)}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="p-8 text-muted-foreground text-sm">No audit events yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
