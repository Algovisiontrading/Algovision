"use client";

import { useEffect, useState, useRef, useCallback } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Phase = "idle" | "scanning" | "active" | "resolved";
type Result = "WIN" | "LOSS" | null;
type Direction = "LONG" | "SHORT";

interface Signal {
  id: string;
  name: string;
  fullName: string;
  state: string;
  result: Result;
  phase: Phase;
  time: string;
  direction: Direction | null;
  pair: string;
  entry: number | null;
  sl: number | null;
  tp: number | null;
  rr: string | null;
  confidence: number;
}

interface TradeLog {
  id: string;
  strategy: string;
  pair: string;
  direction: Direction;
  result: Result;
  rr: string;
  time: string;
  pnl: number;
}

interface SessionStats {
  wins: number;
  losses: number;
  totalPnl: number;
  bestTrade: number;
  streak: number;
  currentStreak: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────
const PAIRS = ["NQ/USD", "ES/USD", "BTC/USD", "EUR/USD", "GBP/USD", "GBP/JPY"];
const STRATEGIES = [
  { id: "CRT",  fullName: "Candle Range Theory",  color: "#22c55e" },
  { id: "IFVG", fullName: "Inverse Fair Value Gap", color: "#3b82f6" },
  { id: "QT",   fullName: "Quarterly Theory",       color: "#a855f7" },
  { id: "SSMT", fullName: "Smart Money Technique",  color: "#f59e0b" },
];

const rng = () => Math.random();
const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];
const randomPrice = (base: number, pct: number) =>
  parseFloat((base + (rng() - 0.5) * base * pct).toFixed(2));

function makeEntry(base: number, dir: Direction) {
  const entry = randomPrice(base, 0.005);
  const slDist = base * (0.002 + rng() * 0.003);
  const tpMult = 2 + rng() * 2;
  const sl = dir === "LONG" ? entry - slDist : entry + slDist;
  const tp = dir === "LONG" ? entry + slDist * tpMult : entry - slDist * tpMult;
  const rr = `1:${tpMult.toFixed(1)}`;
  return { entry: parseFloat(entry.toFixed(2)), sl: parseFloat(sl.toFixed(2)), tp: parseFloat(tp.toFixed(2)), rr };
}

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const BASE_PRICES: Record<string, number> = {
  "NQ/USD": 21400, "ES/USD": 5200, "BTC/USD": 68000,
  "EUR/USD": 1.0850, "GBP/USD": 1.2740, "GBP/JPY": 196.5,
};

// ── Mini Sparkline ─────────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.offsetWidth; const H = c.offsetHeight;
    const DPR = window.devicePixelRatio || 1;
    c.width = W * DPR; c.height = H * DPR;
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, W, H);
    if (data.length < 2) return;
    const min = Math.min(...data); const max = Math.max(...data);
    const range = max - min || 1;
    const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: H - ((v - min) / range) * (H - 4) - 2 }));
    // Fill
    ctx.beginPath();
    ctx.moveTo(pts[0].x, H);
    pts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, H);
    ctx.closePath();
    ctx.fillStyle = color + "22";
    ctx.fill();
    // Line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, color]);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Mini PnL Chart ─────────────────────────────────────────────────────────
function PnlChart({ data }: { data: number[] }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;
    const W = c.offsetWidth; const H = c.offsetHeight;
    const DPR = window.devicePixelRatio || 1;
    c.width = W * DPR; c.height = H * DPR;
    ctx.scale(DPR, DPR);
    ctx.clearRect(0, 0, W, H);
    if (data.length < 2) return;
    const cumulative = data.reduce<number[]>((acc, v) => { acc.push((acc[acc.length - 1] || 0) + v); return acc; }, []);
    const min = Math.min(0, ...cumulative); const max = Math.max(0, ...cumulative);
    const range = max - min || 1;
    const toY = (v: number) => H - ((v - min) / range) * (H - 8) - 4;
    const zeroY = toY(0);
    const pts = cumulative.map((v, i) => ({ x: (i / (cumulative.length - 1)) * W, y: toY(v) }));
    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    [0.25, 0.5, 0.75].forEach(p => {
      ctx.beginPath(); ctx.moveTo(0, H * p); ctx.lineTo(W, H * p); ctx.stroke();
    });
    // Zero line
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(0, zeroY); ctx.lineTo(W, zeroY); ctx.stroke();
    ctx.setLineDash([]);
    // Fill positive / negative
    pts.forEach((p, i) => {
      if (i === 0) return;
      const prev = pts[i - 1];
      const isPositive = cumulative[i] >= 0;
      ctx.beginPath();
      ctx.moveTo(prev.x, zeroY);
      ctx.lineTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.lineTo(p.x, zeroY);
      ctx.closePath();
      ctx.fillStyle = isPositive ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)";
      ctx.fill();
    });
    // Line
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = cumulative[cumulative.length - 1] >= 0 ? "#22c55e" : "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();
    // Dots at last point
    const last = pts[pts.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = cumulative[cumulative.length - 1] >= 0 ? "#22c55e" : "#ef4444";
    ctx.fill();
  }, [data]);
  return <canvas ref={ref} style={{ width: "100%", height: "100%", display: "block" }} />;
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const [signals, setSignals] = useState<Signal[]>(
    STRATEGIES.map((s) => ({
      id: s.id, name: s.id, fullName: s.fullName,
      state: "SCANNING", result: null, phase: "idle",
      time: now(), direction: null, pair: pick(PAIRS),
      entry: null, sl: null, tp: null, rr: null, confidence: Math.floor(55 + rng() * 30),
    }))
  );

  const [tradelog, setTradelog] = useState<TradeLog[]>([]);
  const [stats, setStats] = useState<SessionStats>({ wins: 0, losses: 0, totalPnl: 0, bestTrade: 0, streak: 0, currentStreak: 0 });
  const [pnlHistory, setPnlHistory] = useState<number[]>([]);
  const [marketPrices, setMarketPrices] = useState<Record<string, { price: number; history: number[] }>>(
    Object.fromEntries(PAIRS.map((p) => [p, { price: BASE_PRICES[p], history: Array.from({ length: 20 }, () => randomPrice(BASE_PRICES[p], 0.005)) }]))
  );
  const [activeTab, setActiveTab] = useState<"signals" | "log" | "stats">("signals");
  const [activeStrategy, setActiveStrategy] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [sessionTime, setSessionTime] = useState("00:00:00");
  const sessionStart = useRef(Date.now());

  // Session clock
  useEffect(() => {
    const t = setInterval(() => {
      const elapsed = Date.now() - sessionStart.current;
      const h = Math.floor(elapsed / 3600000).toString().padStart(2, "0");
      const m = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, "0");
      setSessionTime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Tick counter for price updates
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 1500);
    return () => clearInterval(t);
  }, []);

  // Update market prices
  useEffect(() => {
    setMarketPrices((prev) => {
      const next = { ...prev };
      PAIRS.forEach((pair) => {
        const old = prev[pair];
        const change = (rng() - 0.49) * BASE_PRICES[pair] * 0.001;
        const newPrice = parseFloat((old.price + change).toFixed(pair.includes("JPY") ? 2 : pair.includes("USD") && !pair.includes("BTC") && !pair.includes("NQ") && !pair.includes("ES") ? 4 : 2));
        next[pair] = { price: newPrice, history: [...old.history.slice(-30), newPrice] };
      });
      return next;
    });
  }, [tick]);

  // Signal state machine — every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) =>
        prev.map((s) => {
          const t = now();
          if (s.phase === "idle" && rng() < 0.2) {
            const pair = pick(PAIRS);
            const dir: Direction = rng() > 0.5 ? "LONG" : "SHORT";
            const { entry, sl, tp, rr } = makeEntry(BASE_PRICES[pair], dir);
            return { ...s, state: `${s.id} SETUP FOUND`, phase: "scanning", result: null, time: t, pair, direction: dir, entry, sl, tp, rr, confidence: Math.floor(60 + rng() * 35) };
          }
          if (s.phase === "scanning" && rng() < 0.5) {
            return { ...s, state: `${s.id} ACTIVE`, phase: "active", time: t };
          }
          if (s.phase === "active" && rng() < 0.55) {
            const result: Result = rng() < 0.65 ? "WIN" : "LOSS";
            const pnl = result === "WIN" ? parseFloat((100 + rng() * 300).toFixed(2)) : -parseFloat((50 + rng() * 150).toFixed(2));
            const newLog: TradeLog = { id: crypto.randomUUID(), strategy: s.id, pair: s.pair!, direction: s.direction!, result, rr: s.rr!, time: t, pnl };
            setTradelog((l) => [newLog, ...l].slice(0, 50));
            setPnlHistory((h) => [...h, pnl]);
            setStats((st) => {
              const wins = result === "WIN" ? st.wins + 1 : st.wins;
              const losses = result === "LOSS" ? st.losses + 1 : st.losses;
              const cs = result === "WIN" ? (st.currentStreak >= 0 ? st.currentStreak + 1 : 1) : result === "LOSS" ? (st.currentStreak <= 0 ? st.currentStreak - 1 : -1) : st.currentStreak;
              return { wins, losses, totalPnl: parseFloat((st.totalPnl + pnl).toFixed(2)), bestTrade: Math.max(st.bestTrade, pnl), streak: Math.max(st.streak, cs), currentStreak: cs };
            });
            return { ...s, state: result, result, phase: "resolved", time: t };
          }
          if (s.phase === "resolved") {
            return { ...s, state: "SCANNING", result: null, phase: "idle", time: t, direction: null, entry: null, sl: null, tp: null, rr: null, confidence: Math.floor(55 + rng() * 30) };
          }
          return s;
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const winRate = stats.wins + stats.losses > 0 ? ((stats.wins / (stats.wins + stats.losses)) * 100).toFixed(1) : "0.0";

  const getSignalColor = (s: Signal) => {
    if (s.result === "WIN") return "#22c55e";
    if (s.result === "LOSS") return "#ef4444";
    if (s.phase === "active") return "#f59e0b";
    if (s.phase === "scanning") return "#3b82f6";
    return "rgba(255,255,255,0.3)";
  };

  const getSignalBg = (s: Signal) => {
    if (s.result === "WIN") return "rgba(34,197,94,0.1)";
    if (s.result === "LOSS") return "rgba(239,68,68,0.1)";
    if (s.phase === "active") return "rgba(245,158,11,0.08)";
    if (s.phase === "scanning") return "rgba(59,130,246,0.08)";
    return "rgba(255,255,255,0.02)";
  };

  const stratColor = (id: string) => STRATEGIES.find((s) => s.id === id)?.color ?? "#22c55e";

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; }
        .dash-scroll { overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
        .dash-scroll::-webkit-scrollbar { width: 4px; }
        .dash-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
          70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes scanLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        .pulse-ring { animation: pulseRing 2s ease-out infinite; }
        .scan-shimmer { position:relative; overflow:hidden; }
        .scan-shimmer::after {
          content:''; position:absolute; inset:0;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.15), transparent);
          animation: scanLine 2s linear infinite;
        }
        .fade-in { animation: fadeSlideIn 0.3s ease forwards; }
        .live-dot { animation: blink 1.4s ease-in-out infinite; }
        .tab-active { border-bottom: 2px solid #22c55e; color: white; }
        .tab-inactive { border-bottom: 2px solid transparent; color: rgba(255,255,255,0.4); }
      `}</style>

      <div style={{
        height: "100vh", width: "100vw", overflow: "hidden",
        display: "grid",
        gridTemplateColumns: "220px 1fr 320px",
        gridTemplateRows: "52px 1fr",
        background: "#050a14",
        color: "#f0f4ff",
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: "13px",
      }}>

        {/* ── TOP BAR ─────────────────────────────────────────────────────── */}
        <div style={{
          gridColumn: "1 / 4",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(5,10,20,0.9)",
          backdropFilter: "blur(12px)",
          zIndex: 10,
        }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ fontWeight: 800, fontSize: "15px", color: "#22c55e", letterSpacing: "0.05em" }}>
              ⚡ AlgoVision
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "16px" }}>
              TERMINAL v2.1
            </div>
          </div>
          {/* Center — market ticker */}
          <div style={{ display: "flex", gap: "20px", overflow: "hidden" }}>
            {["NQ/USD", "ES/USD", "BTC/USD", "EUR/USD"].map((pair) => {
              const data = marketPrices[pair];
              const prev = data.history[data.history.length - 2] ?? data.price;
              const up = data.price >= prev;
              return (
                <div key={pair} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{pair}</span>
                  <span style={{ fontWeight: 700, color: up ? "#22c55e" : "#ef4444", fontVariantNumeric: "tabular-nums" }}>
                    {data.price.toLocaleString("en-US", { maximumFractionDigits: pair.includes("EUR") || pair.includes("GBP") && !pair.includes("JPY") ? 4 : 2 })}
                  </span>
                  <span style={{ color: up ? "#22c55e" : "#ef4444", fontSize: "10px" }}>{up ? "▲" : "▼"}</span>
                </div>
              );
            })}
          </div>
          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "11px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)" }}>
              <span className="live-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
              LIVE ENGINE
            </div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontVariantNumeric: "tabular-nums" }}>
              Session: {sessionTime}
            </div>
            <div style={{
              padding: "5px 14px", borderRadius: "999px",
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              color: "#22c55e", fontWeight: 700, cursor: "pointer",
            }}>
              Dashboard
            </div>
          </div>
        </div>

        {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
        <div className="dash-scroll" style={{
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "16px 12px",
          display: "flex", flexDirection: "column", gap: "8px",
          background: "rgba(5,10,20,0.6)",
        }}>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: "4px", paddingLeft: "4px" }}>
            STRATEGIES
          </div>
          {STRATEGIES.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStrategy(activeStrategy === s.id ? null : s.id)}
              style={{
                padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                border: `1px solid ${activeStrategy === s.id ? s.color + "60" : "rgba(255,255,255,0.06)"}`,
                background: activeStrategy === s.id ? s.color + "12" : "rgba(255,255,255,0.02)",
                color: activeStrategy === s.id ? s.color : "rgba(255,255,255,0.7)",
                textAlign: "left", display: "flex", alignItems: "center", gap: "8px",
                transition: "all 0.2s",
              }}
            >
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: "12px" }}>{s.id}</div>
                <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "1px" }}>{s.fullName}</div>
              </div>
            </button>
          ))}

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

          {/* Market Watch */}
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: "4px", paddingLeft: "4px" }}>
            MARKET WATCH
          </div>
          {PAIRS.map((pair) => {
            const data = marketPrices[pair];
            const prev = data.history[data.history.length - 2] ?? data.price;
            const up = data.price >= prev;
            const pct = (((data.price - BASE_PRICES[pair]) / BASE_PRICES[pair]) * 100).toFixed(2);
            return (
              <div key={pair} style={{
                padding: "8px 12px", borderRadius: "8px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600 }}>{pair}</span>
                  <span style={{ fontSize: "10px", color: up ? "#22c55e" : "#ef4444", fontWeight: 700 }}>
                    {up ? "+" : ""}{pct}%
                  </span>
                </div>
                <div style={{ height: "28px", marginTop: "6px" }}>
                  <Sparkline data={data.history} color={up ? "#22c55e" : "#ef4444"} />
                </div>
              </div>
            );
          })}

          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "8px 0" }} />

          {/* Quick Stats */}
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: "4px", paddingLeft: "4px" }}>
            SESSION
          </div>
          {[
            { label: "Win Rate", value: `${winRate}%`, color: parseFloat(winRate) >= 50 ? "#22c55e" : "#ef4444" },
            { label: "Net PnL", value: `${stats.totalPnl >= 0 ? "+" : ""}$${stats.totalPnl.toFixed(0)}`, color: stats.totalPnl >= 0 ? "#22c55e" : "#ef4444" },
            { label: "Trades", value: `${stats.wins + stats.losses}`, color: "#f0f4ff" },
            { label: "Streak", value: `${stats.currentStreak >= 0 ? "+" : ""}${stats.currentStreak}`, color: stats.currentStreak > 0 ? "#22c55e" : stats.currentStreak < 0 ? "#ef4444" : "rgba(255,255,255,0.4)" },
          ].map((item) => (
            <div key={item.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "6px 12px", borderRadius: "6px",
              background: "rgba(255,255,255,0.02)",
            }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>{item.label}</span>
              <span style={{ color: item.color, fontWeight: 700, fontSize: "12px", fontVariantNumeric: "tabular-nums" }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* ── CENTER MAIN AREA ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* TradingView Chart */}
          <div style={{ flex: 1, padding: "12px 12px 6px 12px", minHeight: 0 }}>
            <div style={{
              height: "100%", borderRadius: "12px", overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.07)",
              position: "relative",
            }}>
              <iframe
                title="TradingView"
                src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_av&symbol=CME_MINI:NQ1!&interval=15&theme=dark&style=1&timezone=America%2FNew_York&withdateranges=1&hide_side_toolbar=0&allow_symbol_change=1&save_image=0&toolbarbg=050a14&studies=[]"
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
              />
            </div>
          </div>

          {/* Bottom Stats Row */}
          <div style={{ padding: "6px 12px 12px", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
            {[
              { label: "Win Rate", value: `${winRate}%`, sub: `${stats.wins}W / ${stats.losses}L`, color: parseFloat(winRate) >= 50 ? "#22c55e" : "#ef4444" },
              { label: "Session P&L", value: `${stats.totalPnl >= 0 ? "+" : ""}$${stats.totalPnl.toFixed(0)}`, sub: `Best: +$${stats.bestTrade.toFixed(0)}`, color: stats.totalPnl >= 0 ? "#22c55e" : "#ef4444" },
              { label: "Active Signals", value: `${signals.filter(s => s.phase === "active" || s.phase === "scanning").length}`, sub: `${signals.filter(s => s.phase === "idle").length} scanning`, color: "#3b82f6" },
              { label: "Best Streak", value: `${stats.streak}`, sub: `Current: ${stats.currentStreak >= 0 ? "+" : ""}${stats.currentStreak}`, color: "#a855f7" },
            ].map((item) => (
              <div key={item.label} style={{
                padding: "10px 14px", borderRadius: "10px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>{item.label}</div>
                <div style={{ fontSize: "20px", fontWeight: 800, color: item.color, fontVariantNumeric: "tabular-nums" }}>{item.value}</div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", marginTop: "2px" }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
        <div style={{
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          display: "flex", flexDirection: "column",
          background: "rgba(5,10,20,0.6)",
          overflow: "hidden",
        }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 16px" }}>
            {(["signals", "log", "stats"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={activeTab === tab ? "tab-active" : "tab-inactive"}
                style={{
                  padding: "12px 14px", background: "none", cursor: "pointer",
                  fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", transition: "all 0.2s",
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="dash-scroll" style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>

            {/* SIGNALS TAB */}
            {activeTab === "signals" && signals.map((s) => (
              <div
                key={s.id}
                className={`fade-in ${s.phase === "scanning" ? "scan-shimmer" : ""}`}
                style={{
                  padding: "12px 14px", borderRadius: "12px",
                  border: `1px solid ${getSignalColor(s)}30`,
                  background: getSignalBg(s),
                  transition: "all 0.4s ease",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      className={s.phase === "active" ? "pulse-ring" : ""}
                      style={{ width: "8px", height: "8px", borderRadius: "50%", background: getSignalColor(s), flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "13px", color: getSignalColor(s) }}>{s.id}</div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: "1px" }}>{s.fullName}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontVariantNumeric: "tabular-nums" }}>{s.time}</div>
                    {s.direction && (
                      <div style={{
                        marginTop: "3px", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "999px",
                        background: s.direction === "LONG" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        color: s.direction === "LONG" ? "#22c55e" : "#ef4444",
                        border: `1px solid ${s.direction === "LONG" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                      }}>
                        {s.direction === "LONG" ? "▲ LONG" : "▼ SHORT"}
                      </div>
                    )}
                  </div>
                </div>

                {/* State */}
                <div style={{ fontWeight: 800, fontSize: s.result ? "18px" : "13px", color: getSignalColor(s), marginBottom: "8px", letterSpacing: "0.03em" }}>
                  {s.state}
                </div>

                {/* Sub-info */}
                {s.result === "WIN" && <div style={{ fontSize: "11px", color: "#22c55e" }}>✓ Trade completed — target reached</div>}
                {s.result === "LOSS" && <div style={{ fontSize: "11px", color: "#ef4444" }}>✕ Stop loss hit — reset scanning</div>}

                {/* Trade Details */}
                {s.phase !== "idle" && s.phase !== "resolved" && s.entry && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px", marginTop: "8px" }}>
                    {[
                      { label: "Entry", value: s.entry },
                      { label: "Stop", value: s.sl },
                      { label: "Target", value: s.tp },
                    ].map((item) => (
                      <div key={item.label} style={{
                        padding: "6px 8px", borderRadius: "6px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}>
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", marginBottom: "2px" }}>{item.label}</div>
                        <div style={{ fontSize: "11px", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{item.value?.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pair + R:R + Confidence */}
                {s.phase !== "idle" && (
                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}>
                      {s.pair}
                    </span>
                    {s.rr && (
                      <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", background: "rgba(34,197,94,0.1)", color: "#22c55e" }}>
                        R:R {s.rr}
                      </span>
                    )}
                    <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "999px", background: "rgba(168,85,247,0.1)", color: "#a855f7" }}>
                      {s.confidence}% conf.
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* LOG TAB */}
            {activeTab === "log" && (
              <>
                {tradelog.length === 0 && (
                  <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "40px 0", fontSize: "12px" }}>
                    No trades logged yet — signals resolving…
                  </div>
                )}
                {tradelog.map((t) => (
                  <div key={t.id} className="fade-in" style={{
                    padding: "10px 12px", borderRadius: "10px",
                    border: `1px solid ${t.result === "WIN" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                    background: t.result === "WIN" ? "rgba(34,197,94,0.05)" : "rgba(239,68,68,0.05)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: stratColor(t.strategy), flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, fontSize: "12px" }}>{t.strategy}</span>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>{t.pair}</span>
                        <span style={{ fontSize: "10px", color: t.direction === "LONG" ? "#22c55e" : "#ef4444" }}>
                          {t.direction === "LONG" ? "▲" : "▼"}
                        </span>
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontVariantNumeric: "tabular-nums" }}>{t.time} · {t.rr}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 800, fontSize: "14px", color: t.result === "WIN" ? "#22c55e" : "#ef4444" }}>
                        {t.result}
                      </div>
                      <div style={{ fontSize: "11px", color: t.pnl >= 0 ? "#22c55e" : "#ef4444", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                        {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(0)}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* STATS TAB */}
            {activeTab === "stats" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* PnL Chart */}
                <div style={{
                  borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)", padding: "12px",
                }}>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "8px" }}>SESSION P&L CURVE</div>
                  <div style={{ height: "100px" }}>
                    {pnlHistory.length > 1 ? <PnlChart data={pnlHistory} /> : (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>
                        Waiting for trades…
                      </div>
                    )}
                  </div>
                </div>

                {/* Strategy Breakdown */}
                <div style={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: "12px" }}>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", marginBottom: "10px" }}>STRATEGY BREAKDOWN</div>
                  {STRATEGIES.map((strat) => {
                    const logs = tradelog.filter(t => t.strategy === strat.id);
                    const wins = logs.filter(t => t.result === "WIN").length;
                    const pct = logs.length > 0 ? (wins / logs.length) * 100 : 0;
                    return (
                      <div key={strat.id} style={{ marginBottom: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "11px", color: strat.color, fontWeight: 600 }}>{strat.id}</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)" }}>{wins}/{logs.length} · {pct.toFixed(0)}%</span>
                        </div>
                        <div style={{ height: "5px", borderRadius: "999px", background: "rgba(255,255,255,0.07)" }}>
                          <div style={{ height: "100%", borderRadius: "999px", background: strat.color, width: `${pct}%`, transition: "width 0.5s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Summary Cards */}
                {[
                  { label: "Total Trades", value: `${stats.wins + stats.losses}`, color: "#f0f4ff" },
                  { label: "Win Rate", value: `${winRate}%`, color: parseFloat(winRate) >= 50 ? "#22c55e" : "#ef4444" },
                  { label: "Net P&L", value: `${stats.totalPnl >= 0 ? "+" : ""}$${stats.totalPnl.toFixed(2)}`, color: stats.totalPnl >= 0 ? "#22c55e" : "#ef4444" },
                  { label: "Best Trade", value: `+$${stats.bestTrade.toFixed(2)}`, color: "#22c55e" },
                  { label: "Best Streak", value: `${stats.streak} wins`, color: "#a855f7" },
                  { label: "Current Streak", value: `${stats.currentStreak >= 0 ? "+" : ""}${stats.currentStreak}`, color: stats.currentStreak > 0 ? "#22c55e" : stats.currentStreak < 0 ? "#ef4444" : "rgba(255,255,255,0.4)" },
                ].map((item) => (
                  <div key={item.label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", borderRadius: "10px",
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{item.label}</span>
                    <span style={{ color: item.color, fontWeight: 700, fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
}
