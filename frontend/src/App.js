import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Runs from "@/pages/Runs";
import RunDetail from "@/pages/RunDetail";
import Insights from "@/pages/Insights";
import Agents from "@/pages/Agents";
import Audit from "@/pages/Audit";
import Schedules from "@/pages/Schedules";
import Memory from "@/pages/Memory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/runs" element={<Runs />} />
          <Route path="/runs/:id" element={<RunDetail />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/memory" element={<Memory />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
