import axios from "axios";

export const api = axios.create({ baseURL: `${process.env.REACT_APP_BACKEND_URL}/api` });

export const fmtTime = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

export const AGENT_COLORS = {
  orchestrator: "bg-primary",
  literature: "bg-sky-500",
  trials: "bg-emerald-500",
  genetics: "bg-rose-500",
  hypothesis: "bg-amber-500",
  critic: "bg-orange-600",
  bias: "bg-fuchsia-500",
  learner: "bg-lime-500",
};
