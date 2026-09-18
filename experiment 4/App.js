import React, { useState, useEffect, useCallback } from "react";
import Calendar from "./components/Calendar";
import CalendarUnoptimized from "./components/CalendarUnoptimized";
import RenderOptimizerPanel from "./components/RenderOptimizerPanel";
import "./App.css";

export default function App() {
  const [mode, setMode] = useState("optimal"); // "optimal" | "non-optimal"
  const [simulate, setSimulate] = useState(false);
  const [tick, setTick] = useState(0);

  // Drives the "background load simulator": an update that has nothing
  // to do with posts or the visible month, standing in for something
  // like a live clock or notification badge in a real app.
  useEffect(() => {
    if (!simulate) return undefined;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [simulate]);

  const handleForceTick = useCallback(() => setTick((t) => t + 1), []);

  return (
    <div className="app">
      <div className="app-main">
        {mode === "optimal" ? (
          <Calendar tick={tick} />
        ) : (
          <CalendarUnoptimized tick={tick} />
        )}
      </div>
      <RenderOptimizerPanel
        mode={mode}
        onModeChange={setMode}
        simulate={simulate}
        onSimulateChange={setSimulate}
        onForceTick={handleForceTick}
        tick={tick}
      />
    </div>
  );
}
