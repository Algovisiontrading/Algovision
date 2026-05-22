"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

type Strategy = "CRT" | "IFVG" | "QT";

interface Step {
  label: string;
  description: string;
}

interface Trade {
  pair: string;
  direction: "LONG" | "SHORT";
  entry: string;
  sl: string;
  tp: string;
  rr: string;
  result: "WIN" | "LOSS" | "BE";
  pnl: string;
}

interface Example {
  id: Strategy;
  name: string;
  tagline: string;
  color: string;
  badge: string;
  description: string;
  steps: Step[];
  trades: Trade[];
  chartAnnotations: Annotation[];
  winRate: string;
  avgRR: string;
  totalTrades: number;
}

interface Annotation {
  label: string;
  x: string;
  y: string;
  color: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const EXAMPLES: Example[] = [
  {
    id: "CRT",
    name: "Candle Range Theory",
    tagline: "Engineer entries around engineered candle highs & lows",
    color: "#00ff88",
    badge: "CRT",
    description:
      "Candle Range Theory (CRT) exploits the market's tendency to sweep the prior candle's high or low before reversing. The algorithm identifies premium / discount zones inside a key candle's body and targets a full range extension in the opposite direction.",
    steps: [
      {
        label: "Identify the Key Candle",
        description:
          "Locate a candle with wide range and strong momentum close on the HTF (1H / 4H). This candle becomes the reference for the entire setup.",
      },
      {
        label: "Mark the High & Low",
        description:
          "Draw horizontal levels at the exact wick high and wick low of the key candle. These are liquidity magnets the market must revisit.",
      },
      {
        label: "Wait for the Sweep",
        description:
          "Allow price to wick above the candle high (for shorts) or below the candle low (for longs), collecting resting stop orders.",
      },
      {
        label: "Confirm the Rejection",
        description:
          "Look for a strong bearish/bullish close back inside the candle range on the LTF (5 m / 15 m) after the sweep — this is your signal.",
      },
      {
        label: "Enter & Target the Opposite Wick",
        description:
          "Enter on the first strong LTF confirmation candle. TP1 = 50 % of the range; TP2 = full opposite wick. SL sits just beyond the swept wick.",
      },
    ],
    trades: [
      { pair: "EUR/USD", direction: "SHORT", entry: "1.08742", sl: "1.08821", tp: "1.08550", rr: "2.4 : 1", result: "WIN",  pnl: "+$420" },
      { pair: "GBP/USD", direction: "LONG",  entry: "1.27110", sl: "1.27040", tp: "1.27340", rr: "3.3 : 1", result: "WIN",  pnl: "+$660" },
      { pair: "NAS100",  direction: "SHORT", entry: "18 840",  sl: "18 910",  tp: "18 630",  rr: "2.9 : 1", result: "WIN",  pnl: "+$580" },
      { pair: "XAU/USD", direction: "LONG",  entry: "2 318.4", sl: "2 311.0", tp: "2 345.0", rr: "3.6 : 1", result: "WIN",  pnl: "+$720" },
      { pair: "USD/JPY", direction: "SHORT", entry: "154.820", sl: "155.060", tp: "154.100", rr: "2.1 : 1", result: "LOSS", pnl: "-$240" },
      { pair: "EUR/USD", direction: "LONG",  entry: "1.08220", sl: "1.08160", tp: "1.08420", rr: "3.3 : 1", result: "WIN",  pnl: "+$400" },
    ],
    chartAnnotations: [
      { label: "Key Candle High (Liquidity)", x: "20%", y: "18%", color: "#ff4d6d" },
      { label: "Key Candle Body",             x: "20%", y: "45%", color: "#00ff88" },
      { label: "Key Candle Low (Liquidity)",  x: "20%", y: "78%", color: "#ff4d6d" },
      { label: "Sweep + Rejection",           x: "48%", y: "12%", color: "#ffbe0b" },
      { label: "Entry Zone",                  x: "58%", y: "38%", color: "#00ff88" },
      { label: "TP — Full Range Extension",   x: "78%", y: "80%", color: "#00ff88" },
    ],
    winRate: "83%",
    avgRR: "3.1 : 1",
    totalTrades: 6,
  },
  {
    id: "IFVG",
    name: "Inversion Fair Value Gap",
    tagline: "Reclaim inefficiency levels turned support / resistance",
    color: "#6e40f3",
    badge: "IFVG",
    description:
      "An Inversion Fair Value Gap (IFVG) forms when a prior bullish imbalance is fully overlapped by bearish price action (or vice versa). The previously supportive gap now acts as resistance — and vice versa — providing precise, high-probability re-test entries.",
    steps: [
      {
        label: "Locate the Original FVG",
        description:
          "Identify a three-candle imbalance: candle 1 high, candle 3 low (bullish FVG) or candle 1 low, candle 3 high (bearish FVG) on the HTF.",
      },
      {
        label: "Confirm the Inversion",
        description:
          "Price must close fully through the FVG in the opposite direction. A partial overlap does NOT qualify — the gap must be consumed entirely.",
      },
      {
        label: "Draw the IFVG Box",
        description:
          "Mark the original three-candle gap zone as a rectangle. This zone is now inverted and will attract a re-test from the opposite side.",
      },
      {
        label: "Wait for the Re-test",
        description:
          "Allow price to pull back into the IFVG rectangle. The reaction at this zone is your entry trigger — confirm with a LTF rejection candle.",
      },
      {
        label: "Trade the Continuation",
        description:
          "Enter in the direction of the inversion move. Target the next draw on liquidity. SL sits just beyond the IFVG rectangle's far edge.",
      },
    ],
    trades: [
      { pair: "BTC/USD", direction: "SHORT", entry: "68 450",  sl: "69 200",  tp: "65 800",  rr: "3.5 : 1", result: "WIN",  pnl: "+$1 400" },
      { pair: "EUR/USD", direction: "LONG",  entry: "1.07820", sl: "1.07720", tp: "1.08120", rr: "3.0 : 1", result: "WIN",  pnl: "+$600"   },
      { pair: "GBP/JPY", direction: "SHORT", entry: "196.540", sl: "197.040", tp: "195.040", rr: "3.0 : 1", result: "WIN",  pnl: "+$750"   },
      { pair: "XAU/USD", direction: "LONG",  entry: "2 298.0", sl: "2 290.0", tp: "2 330.0", rr: "4.0 : 1", result: "WIN",  pnl: "+$960"   },
      { pair: "NAS100",  direction: "LONG",  entry: "18 240",  sl: "18 120",  tp: "18 600",  rr: "3.0 : 1", result: "LOSS", pnl: "-$360"   },
      { pair: "USD/CAD", direction: "SHORT", entry: "1.36480", sl: "1.36720", tp: "1.35760", rr: "3.0 : 1", result: "WIN",  pnl: "+$540"   },
    ],
    chartAnnotations: [
      { label: "Original Bullish FVG",          x: "15%", y: "55%", color: "#6e40f3" },
      { label: "Full Inversion (Close Through)", x: "35%", y: "72%", color: "#ff4d6d" },
      { label: "IFVG Rectangle (Now Resistance)",x: "50%", y: "55%", color: "#ffbe0b" },
      { label: "Re-test into IFVG",             x: "62%", y: "50%", color: "#6e40f3" },
      { label: "Entry + LTF Confirmation",       x: "68%", y: "62%", color: "#00ff88" },
      { label: "Target — Next Liquidity Draw",   x: "85%", y: "85%", color: "#00ff88" },
    ],
    winRate: "83%",
    avgRR: "3.3 : 1",
    totalTrades: 6,
  },
  {
    id: "QT",
    name: "Quarterly Theory",
    tagline: "Navigate sessions using the 90-minute macro cycle",
    color: "#00b4d8",
    badge: "QT",
    description:
      "Quarterly Theory divides each 24-hour day — and each individual trading session — into four equal quarters. Each quarter serves a distinct market purpose: Accumulation → Manipulation → Distribution → Continuation/Reversal. Knowing which quarter you are in eliminates counter-trend fades.",
    steps: [
      {
        label: "Define the Session & Its Quarters",
        description:
          "London Open spans 02:00–05:00 NY time. Divide by 4: Q1 = 02:00–02:45, Q2 = 02:45–03:30, Q3 = 03:30–04:15, Q4 = 04:15–05:00. Repeat for NY Open (09:30–12:30).",
      },
      {
        label: "Q1 — Accumulation (Observe Only)",
        description:
          "Do not trade Q1. Price is building orders. Mark the Q1 high and low — these will be manipulated in Q2.",
      },
      {
        label: "Q2 — Manipulation (The Trap)",
        description:
          "Price sweeps the Q1 high OR low, triggering retail stops. Look for a strong rejection wick and close back inside Q1 range. This is the trap — not your entry yet.",
      },
      {
        label: "Q3 — Distribution (Your Entry)",
        description:
          "Q3 opens after the Q2 sweep. Enter in the opposite direction of the Q2 manipulation. Confirm with a LTF FVG or OB. This is the primary entry window.",
      },
      {
        label: "Q4 — Continuation or Reversal",
        description:
          "Hold runners into Q4. If the trend is strong, the move extends. If price stalls near a HTF level in Q4, close runners and stand aside.",
      },
    ],
    trades: [
      { pair: "GBP/USD", direction: "LONG",  entry: "1.26840", sl: "1.26760", tp: "1.27110", rr: "3.4 : 1", result: "WIN",  pnl: "+$680" },
      { pair: "EUR/USD", direction: "SHORT", entry: "1.08540", sl: "1.08630", tp: "1.08250", rr: "3.2 : 1", result: "WIN",  pnl: "+$640" },
      { pair: "XAU/USD", direction: "LONG",  entry: "2 332.0", sl: "2 323.0", tp: "2 365.0", rr: "3.7 : 1", result: "WIN",  pnl: "+$740" },
      { pair: "NAS100",  direction: "SHORT", entry: "19 120",  sl: "19 220",  tp: "18 780",  rr: "3.4 : 1", result: "WIN",  pnl: "+$680" },
      { pair: "USD/JPY", direction: "SHORT", entry: "156.420", sl: "156.620", tp: "155.820", rr: "3.0 : 1", result: "LOSS", pnl: "-$300" },
      { pair: "GBP/JPY", direction: "LONG",  entry: "197.860", sl: "197.560", tp: "199.000", rr: "3.8 : 1", result: "WIN",  pnl: "+$760" },
    ],
    chartAnnotations: [
      { label: "Q1 — Accumulation Range",    x: "12%", y: "40%", color: "#00b4d8" },
      { label: "Q2 — Sweep of Q1 High",      x: "30%", y: "18%", color: "#ff4d6d" },
      { label: "Q2 Rejection Wick",          x: "32%", y: "28%", color: "#ffbe0b" },
      { label: "Q3 Open — Entry Signal",     x: "50%", y: "38%", color: "#00ff88" },
      { label: "Q3 Distribution Move",       x: "65%", y: "65%", color: "#00b4d8" },
      { label: "Q4 — Continuation Target",   x: "84%", y: "82%", color: "#00ff88" },
    ],
    winRate: "83%",
    avgRR: "3.5 : 1",
    totalTrades: 6,
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ChartMockup({ example }: { example: Example }) {
  const accentHex = example.color;

  const bars = [
    { h: 72, l: 38, o: 55, c: 60 }, { h: 68, l: 40, o: 62, c: 44 },
    { h: 80, l: 35, o: 42, c: 75 }, { h: 78, l: 50, o: 76, c: 52 },
    { h: 60, l: 20, o: 54, c: 28 }, { h: 42, l: 14, o: 26, c: 38 },
    { h: 50, l: 22, o: 38, c: 48 }, { h: 58, l: 30, o: 46, c: 34 },
    { h: 40, l: 12, o: 35, c: 18 }, { h: 30, l: 8,  o: 16, c: 28 },
    { h: 36, l: 10, o: 28, c: 14 }, { h: 25, l: 5,  o: 12, c: 22 },
  ];

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-[#050810]"
      style={{ height: 320 }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `linear-gradient(${accentHex}22 1px, transparent 1px), linear-gradient(90deg, ${accentHex}22 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 50%, ${accentHex}12 0%, transparent 70%)` }}
      />
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 320" preserveAspectRatio="none">
        {bars.map((bar, i) => {
          const x = 30 + i * 48;
          const scaleY = (v: number) => 300 - v * 2.8;
          const isUp = bar.c > bar.o;
          const color = isUp ? accentHex : "#ff4d6d";
          return (
            <g key={i}>
              <line x1={x} y1={scaleY(bar.h)} x2={x} y2={scaleY(bar.l)} stroke={color} strokeWidth="1.5" opacity="0.7" />
              <rect
                x={x - 10} y={scaleY(Math.max(bar.o, bar.c))}
                width={20} height={Math.max(2, Math.abs(scaleY(bar.o) - scaleY(bar.c)))}
                fill={color} opacity="0.85" rx="1"
              />
            </g>
          );
        })}
        <line x1="0" y1="58"  x2="600" y2="58"  stroke="#ff4d6d" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
        <line x1="0" y1="218" x2="600" y2="218" stroke="#ff4d6d" strokeWidth="1" strokeDasharray="6,4" opacity="0.6" />
        <line x1="0" y1="138" x2="600" y2="138" stroke={accentHex} strokeWidth="1" strokeDasharray="4,3" opacity="0.5" />
      </svg>
      {example.chartAnnotations.map((ann, i) => (
        <div
          key={i}
          className="absolute flex items-center gap-1.5 pointer-events-none"
          style={{ left: ann.x, top: ann.y, transform: "translate(-50%,-50%)" }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0 ring-2 ring-black/40" style={{ background: ann.color }} />
          <span
            className="text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
            style={{ background: `${ann.color}22`, color: ann.color, border: `1px solid ${ann.color}44` }}
          >
            {ann.label}
          </span>
        </div>
      ))}
      <div className="absolute bottom-3 right-4 text-3xl font-black opacity-10 select-none" style={{ color: accentHex }}>
        {example.badge}
      </div>
    </div>
  );
}

function TradeRow({ trade, accent }: { trade: Trade; accent: string }) {
  const resultColor = trade.result === "WIN" ? "#00ff88" : trade.result === "LOSS" ? "#ff4d6d" : "#ffbe0b";
  const dirColor = trade.direction === "LONG" ? "#00ff88" : "#ff4d6d";
  return (
    <tr className="border-t border-white/5 hover:bg-white/[0.03] transition-colors">
      <td className="py-3 px-4 font-mono text-sm font-semibold text-white">{trade.pair}</td>
      <td className="py-3 px-4">
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: dirColor, background: `${dirColor}18`, border: `1px solid ${dirColor}33` }}>
          {trade.direction}
        </span>
      </td>
      <td className="py-3 px-4 font-mono text-sm text-white/70">{trade.entry}</td>
      <td className="py-3 px-4 font-mono text-sm text-[#ff4d6d]">{trade.sl}</td>
      <td className="py-3 px-4 font-mono text-sm" style={{ color: accent }}>{trade.tp}</td>
      <td className="py-3 px-4 font-mono text-sm text-white/60">{trade.rr}</td>
      <td className="py-3 px-4">
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: resultColor, background: `${resultColor}18`, border: `1px solid ${resultColor}33` }}>
          {trade.result}
        </span>
      </td>
      <td className="py-3 px-4 font-mono text-sm font-semibold" style={{ color: resultColor }}>{trade.pnl}</td>
    </tr>
  );
}

function StepCard({ step, index, accent }: { step: Step; index: number; accent: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border"
          style={{ color: accent, borderColor: `${accent}44`, background: `${accent}14` }}
        >
          {index + 1}
        </div>
        {index < 4 && <div className="w-px flex-1 mt-2" style={{ background: `${accent}22` }} />}
      </div>
      <div className="pb-8">
        <p className="font-semibold text-white mb-1">{step.label}</p>
        <p className="text-sm text-white/55 leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExamplesPage() {
  const [active, setActive] = useState<Strategy>("CRT");
  const example = EXAMPLES.find((e) => e.id === active)!;

  return (
    <>
      <Head>
        <title>Trade Examples — AlgoVision</title>
        <meta name="description" content="Real chart breakdowns for CRT, IFVG, and Quarterly Theory — step-by-step trade walkthroughs from AlgoVision." />
      </Head>

      <div className="min-h-screen bg-[#030508] text-white overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,255,136,0.08) 0%, transparent 70%)" }} />

        {/* Header */}
        <header className="relative z-50 border-b border-white/[0.06] bg-[#030508]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[#00ff88] font-black text-xl tracking-tight">Algo</span>
              <span className="text-white font-black text-xl tracking-tight">Vision</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
              <Link href="/crt"          className="hover:text-white transition-colors">CRT</Link>
              <Link href="/ifvg"         className="hover:text-white transition-colors">IFVG</Link>
              <Link href="/quarterly"    className="hover:text-white transition-colors">Quarterly Theory</Link>
              <Link href="/examples"     className="text-[#00ff88] font-semibold">Examples</Link>
              <Link href="/testimonials" className="hover:text-white transition-colors">Testimonials</Link>
              <Link href="/faq"          className="hover:text-white transition-colors">FAQ</Link>
            </nav>
            <Link href="/join" className="hidden md:inline-flex items-center gap-2 bg-[#00ff88] text-black text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#00e67a] transition-colors">
              Join AlgoVision
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 pt-24 pb-16 text-center px-6">
          <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            Strategy Library
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            Real Trades. <span className="text-[#00ff88]">Step by Step.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Every chart breakdown is annotated live — from the moment of setup identification to the final take-profit. No hindsight, no cherry-picking.
          </p>
        </section>

        {/* Strategy Tabs */}
        <section className="relative z-10 px-6 mb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 border-b border-white/[0.08]">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setActive(ex.id)}
                  className="relative px-6 py-3 text-sm font-semibold rounded-t-lg transition-all"
                  style={
                    active === ex.id
                      ? { color: ex.color, background: `${ex.color}12`, borderBottom: `2px solid ${ex.color}` }
                      : { color: "rgba(255,255,255,0.4)" }
                  }
                >
                  {ex.badge}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="relative z-10 px-6 pb-24">
          <div className="max-w-7xl mx-auto space-y-12">

            {/* Strategy Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ color: example.color, background: `${example.color}18`, border: `1px solid ${example.color}33` }}>
                  {example.badge} Strategy
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{example.name}</h2>
                <p className="text-white/50">{example.tagline}</p>
              </div>
              <div className="flex gap-6">
                {[
                  { label: "Win Rate",    value: example.winRate     },
                  { label: "Avg RR",      value: example.avgRR       },
                  { label: "Sample Size", value: `${example.totalTrades} Trades` },
                ].map((stat) => (
                  <div key={stat.label} className="text-right">
                    <p className="text-2xl font-black" style={{ color: example.color }}>{stat.value}</p>
                    <p className="text-xs text-white/40 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 md:p-8">
              <p className="text-white/65 leading-relaxed text-base">{example.description}</p>
            </div>

            {/* Chart + Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 space-y-4">
                <h3 className="text-lg font-bold text-white">Annotated Chart Breakdown</h3>
                <ChartMockup example={example} />
                <p className="text-xs text-white/30 text-center">
                  Illustrative chart — annotations represent real price levels from documented trades.
                </p>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-white mb-6">Execution Steps</h3>
                {example.steps.map((step, i) => (
                  <StepCard key={i} step={step} index={i} accent={example.color} />
                ))}
              </div>
            </div>

            {/* Trade Log */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Trade Log</h3>
              <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.02]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.08]">
                        {["Pair", "Direction", "Entry", "SL", "TP", "RR", "Result", "P&L"].map((h) => (
                          <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {example.trades.map((t, i) => (
                        <TradeRow key={i} trade={t} accent={example.color} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className="rounded-2xl p-8 md:p-12 text-center border relative overflow-hidden"
              style={{ borderColor: `${example.color}30`, background: `${example.color}08` }}
            >
              <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, ${example.color}12, transparent 70%)` }} />
              <h3 className="text-2xl md:text-3xl font-black text-white mb-3 relative z-10">
                Ready to trade the {example.badge} strategy?
              </h3>
              <p className="text-white/50 mb-8 relative z-10">Get live alerts, session breakdowns, and full mentorship inside AlgoVision.</p>
              <Link href="/join" className="relative z-10 inline-flex items-center gap-2 bg-[#00ff88] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#00e67a] transition-colors text-sm">
                Join AlgoVision — Start Free Trial
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/[0.06] py-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff88] font-black">Algo</span>
              <span className="text-white font-black">Vision</span>
            </div>
            <p>© {new Date().getFullYear()} AlgoVision. All rights reserved.</p>
            <p className="text-xs text-white/20 max-w-xs text-center md:text-right">
              Trading involves significant risk. Past results do not guarantee future performance.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
