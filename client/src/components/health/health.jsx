import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  checkHealth,
  updateLiveHealth,
  setStreamConnection,
} from "../../redux/Slices/routeslice";
import { Button } from "../ui/button";
import {
  Activity,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Clock,
  Server,
  Radio,
  Cpu,
} from "lucide-react";

function HealthStatus() {
  const dispatch = useDispatch();
  const health = useSelector((state) => state.health || state.Health || {});

  const isHealthy = health.status === "healthy";
  const isUnhealthy = health.status === "unhealthy";
  const isChecking = health.status === "loading" || health.status === "checking...";
  const isLive = health.connectionState === "connected";
  const isConnecting = health.connectionState === "connecting";

  // Phase 3: SSE stream lifecycle
  useEffect(() => {
    dispatch(setStreamConnection("connecting"));

    const streamUrl = `${import.meta.env.VITE_API_URL}/api/v1/health/status`;
    const eventSource = new EventSource(streamUrl);

    eventSource.onopen = () => {
      dispatch(setStreamConnection("connected"));
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        dispatch(updateLiveHealth(data));
      } catch (err) {
        console.error("Failed to parse SSE health event:", err);
      }
    };

    eventSource.onerror = () => {
      // EventSource automatically attempts to reconnect on error
      dispatch(setStreamConnection("connecting"));
    };

    return () => {
      eventSource.close();
      dispatch(setStreamConnection("disconnected"));
    };
  }, [dispatch]);

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
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-slate-900 leading-none">
                  Backend Status
                </h2>
                {/* Live stream badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide border ${isLive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : isConnecting
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${isLive
                        ? "bg-emerald-500 animate-pulse"
                        : isConnecting
                          ? "bg-amber-500 animate-ping"
                          : "bg-slate-400"
                      }`}
                  />
                  {isLive ? "LIVE" : isConnecting ? "RECONNECTING" : "OFFLINE"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time SSE Stream (5s interval)
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isHealthy
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : isUnhealthy
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-slate-100 text-slate-700 border-slate-200"
              }`}
          >
            {isHealthy && <CheckCircle2 className="size-3.5 text-emerald-600" />}
            {isUnhealthy && <XCircle className="size-3.5 text-red-600" />}
            {!isHealthy && !isUnhealthy && (
              <Activity className="size-3.5 text-slate-500" />
            )}
            <span className="capitalize">{health.status || "idle"}</span>
          </span>
        </div>

        {/* Status Details */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 divide-y divide-slate-100 text-sm">
          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-slate-500">Stream Connection</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-xs capitalize text-slate-700">
              <Radio
                className={`size-3.5 ${isLive
                    ? "text-emerald-500 animate-pulse"
                    : "text-slate-400"
                  }`}
              />
              {health.connectionState || "disconnected"}
              {health.isStale && !isLive && (
                <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-1 rounded">
                  stale
                </span>
              )}
            </span>
          </div>

          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-slate-500">Status</span>
            <span className="font-medium text-slate-800 capitalize">
              {health.status || "Unknown"}
            </span>
          </div>

          <div className="flex justify-between items-center px-4 py-2.5">
            <span className="text-slate-500">Message</span>
            <span
              className="font-medium text-slate-800 text-right truncate max-w-[200px]"
              title={health.message}
            >
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

          {health.memory && (
            <div className="flex justify-between items-center px-4 py-2.5">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Cpu className="size-3.5 text-slate-400" />
                Memory (Heap / RSS)
              </span>
              <span className="font-mono text-xs font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {health.memory.heapUsed} / {health.memory.rss}
              </span>
            </div>
          )}

          {health.timestamp && (
            <div className="flex justify-between items-center px-4 py-2.5 text-xs">
              <span className="text-slate-500">Last Synced</span>
              <span className="text-slate-600 font-mono">
                {new Date(health.timestamp).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {/* Manual Refresh Action */}
        <Button
          onClick={() => dispatch(checkHealth())}
          disabled={isChecking}
          variant="outline"
          className="w-full h-10 font-medium transition-all shadow-xs"
        >
          <RefreshCw
            className={`size-4 mr-2 ${isChecking ? "animate-spin" : ""}`}
          />
          {isChecking ? "Checking Backend..." : "Manual Snapshot Refresh"}
        </Button>
      </div>
    </div>
  );
}

export default HealthStatus;