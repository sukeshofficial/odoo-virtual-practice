import { useDispatch, useSelector } from "react-redux";
import { checkHealth } from "../../redux/Slices/routeslice";
import { Button } from "../ui/button";
import { Activity, CheckCircle2, XCircle, RefreshCw, Clock, Server } from "lucide-react";

function HealthStatus() {
  const dispatch = useDispatch();
  const health = useSelector(
    (state) => state.health || state.Health || {}
  );

  const isHealthy = health.status === "healthy";
  const isUnhealthy = health.status === "unhealthy";
  const isChecking = health.status === "loading" || health.status === "checking...";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
              <Server className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 leading-none">
                Backend Status
              </h2>
              <p className="text-xs text-slate-500 mt-1">API Health Monitor</p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isHealthy
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : isUnhealthy
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            {isHealthy && <CheckCircle2 className="size-3.5 text-emerald-600" />}
            {isUnhealthy && <XCircle className="size-3.5 text-red-600" />}
            {!isHealthy && !isUnhealthy && <Activity className="size-3.5 text-slate-500" />}
            <span className="capitalize">{health.status || "idle"}</span>
          </span>
        </div>

        {/* Status Details */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 divide-y divide-slate-100 text-sm">
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-slate-500">Status</span>
            <span className="font-medium text-slate-800 capitalize">
              {health.status || "Unknown"}
            </span>
          </div>

          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-slate-500">Message</span>
            <span className="font-medium text-slate-800 text-right truncate max-w-[200px]" title={health.message}>
              {health.message || "—"}
            </span>
          </div>

          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="size-3.5 text-slate-400" />
              Uptime
            </span>
            <span className="font-mono text-xs font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              {health.uptime ?? 0}s
            </span>
          </div>

          {health.timestamp && (
            <div className="flex justify-between items-center px-4 py-2.5 text-xs">
              <span className="text-slate-500">Checked At</span>
              <span className="text-slate-600 font-mono">
                {new Date(health.timestamp).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Button
          onClick={() => dispatch(checkHealth())}
          disabled={isChecking}
          className="w-full h-10 font-medium transition-all shadow-xs"
        >
          <RefreshCw className={`size-4 mr-2 ${isChecking ? "animate-spin" : ""}`} />
          {isChecking ? "Checking Backend..." : "Check Backend Status"}
        </Button>
      </div>
    </div>
  );
}

export default HealthStatus;