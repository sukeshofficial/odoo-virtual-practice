import { useDispatch, useSelector } from "react-redux";
import { setHealth } from "../../redux/Slices/routeslice";

function HealthStatus() {
  const dispatch = useDispatch();
  const health = useSelector((state) => state.health || state.Health || {});

  const checkHealth = async () => {
    dispatch(
      setHealth({
        status: "checking...",
        message: "Connecting to server...",
      })
    );

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${baseUrl}/api/v1/health`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setHealth(data));
    } catch (error) {
      dispatch(
        setHealth({
          success: false,
          status: "unhealthy",
          message: error.message || "Backend connection failed",
          uptime: 0,
        })
      );
    }
  };

  const isHealthy = health.status === "healthy";
  const isUnhealthy = health.status === "unhealthy";
  const isChecking = health.status === "checking...";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white">Backend Health Status</h2>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize border ${
              isHealthy
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : isUnhealthy
                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}
          >
            {health.status || "idle"}
          </span>
        </div>

        <div className="space-y-3 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-sm">
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Status</span>
            <span className="font-medium text-slate-200 capitalize">{health.status || "Unknown"}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Message</span>
            <span className="font-medium text-slate-200">{health.message || "—"}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-slate-400">Uptime</span>
            <span className="font-medium font-mono text-slate-200">{health.uptime ?? 0}s</span>
          </div>
          {health.timestamp && (
            <div className="flex justify-between items-center py-1 border-t border-slate-800/60 text-xs">
              <span className="text-slate-400">Timestamp</span>
              <span className="text-slate-400 font-mono">
                {new Date(health.timestamp).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={checkHealth}
          disabled={isChecking}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isChecking ? "Checking Status..." : "Check Backend"}
        </button>
      </div>
    </div>
  );
}

export default HealthStatus;