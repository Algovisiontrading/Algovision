"use client";

import { useState, useEffect, useRef } from "react";

export default function QuarterlyTheoryPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTimeframe, setActiveTimeframe] = useState(0);
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Scroll fade-in
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-up");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Draw AMD chart
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * DPR;
    canvas.height = canvas.offsetHeight * DPR;
    ctx.scale(DPR, DPR);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    // Background
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(34,197,94,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const y = (i / 6) * H;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let i = 0; i <= 4; i++) {
      const x = (i / 4) * W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    const pad = 40;
    const chartW = W - pad * 2;
    const chartH = H - pad * 2;
    const midY = pad + chartH * 0.5;

    // Q zones background bands
    const zones = [
      { label: "Q1", color: "rgba(34,197,94,0.06)", x: 0 },
      { label: "Q2", color: "rgba(239,68,68,0.06)", x: 0.25 },
      { label: "Q3", color: "rgba(34,197,94,0.1)", x: 0.5 },
      { label: "Q4", color: "rgba(168,85,247,0.06)", x: 0.75 },
    ];
    zones.forEach(({ label, color, x }) => {
      const rx = pad + x * chartW;
      ctx.fillStyle = color;
      ctx.fillRect(rx, pad, chartW * 0.25, chartH);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText(label, rx + 6, pad + 16);
    });

    // Price path: Q1 consolidation → Q2 dip (Judas) → Q3 rally → Q4 continuation
    const points: [number, number][] = [
      // Q1 accumulation / consolidation
      [0.00, 0.50], [0.03, 0.48], [0.06, 0.52], [0.09, 0.49],
      [0.12, 0.51], [0.15, 0.50], [0.18, 0.48], [0.21, 0.50],
      [0.235, 0.49],
      // Q2 Judas Swing (false drop)
      [0.26, 0.52], [0.29, 0.58], [0.32, 0.64], [0.345, 0.67],
      [0.36, 0.63], [0.38, 0.57],
      // Q3 distribution rally
      [0.40, 0.50], [0.43, 0.42], [0.46, 0.34], [0.49, 0.27],
      [0.52, 0.22], [0.55, 0.18], [0.58, 0.20], [0.61, 0.16],
      [0.63, 0.14],
      // Q4 continuation / slight pullback
      [0.66, 0.17], [0.69, 0.13], [0.72, 0.15], [0.75, 0.11],
      [0.78, 0.13], [0.81, 0.10], [0.84, 0.12], [0.87, 0.09],
      [0.90, 0.11], [0.93, 0.10], [0.96, 0.08], [1.00, 0.09],
    ];

    const toX = (t: number) => pad + t * chartW;
    const toY = (p: number) => pad + p * chartH;

    // Shaded area under line
    ctx.beginPath();
    ctx.moveTo(toX(points[0][0]), toY(points[0][1]));
    points.forEach(([t, p]) => ctx.lineTo(toX(t), toY(p)));
    ctx.lineTo(toX(1), H - pad);
    ctx.lineTo(pad, H - pad);
    ctx.closePath();
    ctx.fillStyle = "rgba(34,197,94,0.05)";
    ctx.fill();

    // Main price line
    ctx.beginPath();
    ctx.moveTo(toX(points[0][0]), toY(points[0][1]));
    points.forEach(([t, p]) => ctx.lineTo(toX(t), toY(p)));
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.stroke();

    // Judas swing highlight zone
    ctx.fillStyle = "rgba(239,68,68,0.12)";
    ctx.fillRect(toX(0.25), toY(0.67), toX(0.39) - toX(0.25), toY(0.48) - toY(0.67));
    ctx.strokeStyle = "rgba(239,68,68,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(toX(0.25), toY(0.67), toX(0.39) - toX(0.25), toY(0.48) - toY(0.67));
    ctx.setLineDash([]);

    // True open dashed line
    ctx.strokeStyle = "rgba(34,197,94,0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(pad, toY(0.50));
    ctx.lineTo(W - pad, toY(0.50));
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillStyle = "#ef4444";
    ctx.fillText("Judas Swing", toX(0.265), toY(0.70));
    ctx.fillStyle = "rgba(34,197,94,0.8)";
    ctx.fillText("True Open", pad + 4, toY(0.50) - 5);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("Distribution", toX(0.41), toY(0.12));

    // Q label arrows
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "10px Inter, sans-serif";
    ctx.fillText("Accumulation", toX(0.01), toY(0.44));
    ctx.fillText("Continuation", toX(0.66), toY(0.06));
  }, []);

  const timeframes = [
    {
      label: "Yearly",
      quarters: [
        { q: "Q1", period: "Jan – Mar", role: "Accumulation", color: "text-green-400" },
        { q: "Q2", period: "Apr – Jun", role: "Manipulation (True Open: 1st Mon of April)", color: "text-red-400" },
        { q: "Q3", period: "Jul – Sep", role: "Distribution / Trend", color: "text-green-400" },
        { q: "Q4", period: "Oct – Dec", role: "Continuation or Reversal", color: "text-purple-400" },
      ],
    },
    {
      label: "Monthly",
      quarters: [
        { q: "Q1", period: "Week 1", role: "Accumulation", color: "text-green-400" },
        { q: "Q2", period: "Week 2 (2nd Monday = True Open)", role: "Manipulation / Judas Swing", color: "text-red-400" },
        { q: "Q3", period: "Week 3", role: "Distribution / Trend", color: "text-green-400" },
        { q: "Q4", period: "Week 4", role: "Continuation or Reversal", color: "text-purple-400" },
      ],
    },
    {
      label: "Weekly",
      quarters: [
        { q: "Q1", period: "Monday", role: "Accumulation / Range Build", color: "text-green-400" },
        { q: "Q2", period: "Tuesday (True Open: Mon 18:00)", role: "Manipulation / Judas Swing", color: "text-red-400" },
        { q: "Q3", period: "Wednesday", role: "Distribution / Trend Day", color: "text-green-400" },
        { q: "Q4", period: "Thursday (Friday excluded)", role: "Continuation or Reversal", color: "text-purple-400" },
      ],
    },
    {
      label: "Daily",
      quarters: [
        { q: "Q1", period: "Asian Session (True Open: 19:30)", role: "Accumulation / Consolidation", color: "text-green-400" },
        { q: "Q2", period: "London Session (True Open: 01:30)", role: "Manipulation / Judas Swing", color: "text-red-400" },
        { q: "Q3", period: "New York AM (True Open: 07:30)", role: "Distribution / Main Move", color: "text-green-400" },
        { q: "Q4", period: "New York PM (True Open: 13:00)", role: "Continuation or Reversal", color: "text-purple-400" },
      ],
    },
  ];

  const features = [
    {
      icon: "📅",
      title: "Fractal Time Structure",
      desc: "Quarterly Theory applies the same AMD cycle across every timeframe — yearly, monthly, weekly, daily, and session-based. One model, infinite precision.",
    },
    {
      icon: "🎯",
      title: "True Open Detection",
      desc: "Automatically marks institutional True Opens on every timeframe — the critical price levels where bias is determined and liquidity pools exist.",
    },
    {
      icon: "🃏",
      title: "Judas Swing Alerts",
      desc: "Get alerted the moment a Q2 manipulation move begins. Know when smart money is faking direction before the real move starts in Q3.",
    },
    {
      icon: "🔄",
      title: "AMD Cycle Mapping",
      desc: "Visualize the full Accumulation → Manipulation → Distribution → X cycle directly on your chart. Never miss which phase the market is in.",
    },
    {
      icon: "📊",
      title: "HTF PD Array Alignment",
      desc: "Built-in reference timeframe logic: trading on M1 references M15, M5 references H1, H1 references Daily — aligning you with institutional arrays automatically.",
    },
    {
      icon: "⚡",
      title: "Session Quarter Splits",
      desc: "Each session is subdivided into 90-minute quarters, giving you laser-precision entry windows inside the London and New York sessions.",
    },
  ];

  const faqs = [
    {
      q: "What is Quarterly Theory in trading?",
      a: "Quarterly Theory is a market timing concept that divides time into quarters (yearly, monthly, weekly, daily, and session-based) to identify market cycles. It aligns with ICT's Power of Three (Accumulation, Manipulation, Distribution) to provide structured trade entries and exits.",
    },
    {
      q: "What is a Judas Swing?",
      a: "The Judas Swing occurs in Q2 of any cycle. It is a false breakout designed by smart money to trigger stop-loss orders in the wrong direction before the real move (Q3 distribution) begins. For example, on a bullish day, price may spike lower in the London session before reversing sharply upward in New York AM.",
    },
    {
      q: "What is a True Open and why does it matter?",
      a: "True Opens are institutional reference price levels that define the start of each quarter. If price is below the True Open and you're bullish, you look for entries. If price is above the True Open and you're bearish, you look for shorts. They act as magnets and directional filters.",
    },
    {
      q: "Can Quarterly Theory be used on all timeframes?",
      a: "Yes. Because time is fractal, the AMD-X cycle repeats on every timeframe from yearly down to individual 90-minute session blocks. You can stack multiple timeframes for confluence-based entries.",
    },
    {
      q: "How does this indicator differ from ICT concepts?",
      a: "Quarterly Theory is inspired by ICT's Power of Three but is not an official ICT concept. It extends the AMD model into a formal time-division system across all timeframes, adding True Opens, the X-AMD continuation model, and session-level 90-min quarter splits.",
    },
    {
      q: "What does the X in AMD-X stand for?",
      a: "The X in AMD-X represents the fourth quarter — which can be either a Continuation of the current trend or a Reversal into a new cycle. Alternatively, some cycles begin with X (continuation/reversal) followed by AMD, creating the X-AMD pattern. The market is always doing one of these two sequences.",
    },
  ];

  const pdArrayRules = [
    { ltf: "1-min chart", htf: "15-min PDA" },
    { ltf: "5-min chart", htf: "1-hour PDA" },
    { ltf: "15-min chart", htf: "4-hour PDA" },
    { ltf: "1-hour chart", htf: "Daily PDA" },
    { ltf: "4-hour chart", htf: "Weekly PDA" },
  ];

  return (
    <>
      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-in-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 24px rgba(34,197,94,0.2);
          border-color: rgba(34,197,94,0.4);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 28px rgba(34,197,94,0.5); }
        }
        .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      <main
        className="min-h-screen text-[#f3f3f3] relative overflow-x-hidden"
        style={{
          background:
            "linear-gradient(180deg, #050806 0%, #0a1a0f 40%, #0f2d1a 100%)",
        }}
      >
        {/* GRID OVERLAY */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#22c55e_1px,transparent_1px),linear-gradient(to_bottom,#22c55e_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        {/* VIGNETTE */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

        {/* NAVBAR */}
        <header className="flex justify-between items-center px-8 py-6 border-b border-green-500/20 bg-[#050806]/40 backdrop-blur-sm relative z-50">
          <div className="text-lg font-semibold tracking-wide text-[#f3f3f3] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            AlgoVision
          </div>
          <nav className="hidden md:flex items-center gap-8 text-[#f3f3f3]/60 text-sm">
            <div className="relative group">
              <button className="hover:text-white transition flex items-center gap-1">
                Algorithms <span className="text-xs">▼</span>
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:flex flex-col bg-[#0a0f0a]/90 border border-green-500/20 rounded-lg shadow-lg p-3 w-48 backdrop-blur-md z-50">
                <a href="/crt" className="text-[#f3f3f3]/70 hover:text-white transition py-1.5 text-sm">CRT Playbook</a>
                <a href="/ifvg" className="text-[#f3f3f3]/70 hover:text-white transition py-1.5 text-sm">IFVG</a>
                <a href="/qt" className="text-white transition py-1.5 text-sm">Quarterly Theory</a>
              </div>
            </div>
            <a href="/examples" className="hover:text-white transition">Examples</a>
            <a href="/testimonials" className="hover:text-white transition">Testimonials</a>
            <a href="/faq" className="hover:text-white transition">FAQ</a>
            <button className="px-5 py-2 rounded-full border border-green-500/20 hover:bg-green-500/10 transition text-white">
              Login
            </button>
          </nav>
          <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </header>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#050806]/95 flex flex-col p-8 gap-6">
            <button className="self-end text-white text-2xl" onClick={() => setMenuOpen(false)}>✕</button>
            <a href="/crt" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>CRT Playbook</a>
            <a href="/ifvg" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>IFVG</a>
            <a href="/qt" className="text-lg text-white" onClick={() => setMenuOpen(false)}>Quarterly Theory</a>
            <a href="/examples" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Examples</a>
            <a href="/testimonials" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Testimonials</a>
          </div>
        )}

        {/* HERO */}
        <section className="relative px-6 md:px-8 py-20 md:py-28 max-w-6xl mx-auto">
          <div className="absolute top-0 left-0 w-[600px] h-[500px] bg-green-500/10 blur-[180px] rounded-full pointer-events-none" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400 tracking-wide">ICT-Inspired · Time-Based Trading</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#f3f3f3] drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] leading-tight">
              Quarterly Theory
            </h1>
            <h2 className="text-2xl md:text-3xl mt-3 text-green-400/80">
              AMD-X. Time is Fractal.
            </h2>
            <p className="mt-6 text-[#f3f3f3]/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              The Quarterly Theory indicator maps the Accumulation → Manipulation → Distribution → X cycle across every timeframe automatically — so you always know which phase the market is in.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <button className="pulse-glow w-full sm:w-auto px-8 py-3.5 rounded-full bg-green-500 text-black font-bold text-sm hover:bg-green-400 transition">
                Start Free Trial
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-green-500/30 text-green-400 font-semibold text-sm hover:bg-green-500/10 transition">
                ▶ Watch Demo
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs text-[#f3f3f3]/40">
              <span>✓ TradingView Native</span>
              <span>✓ All Timeframes</span>
              <span>✓ True Open Levels</span>
              <span>✓ Judas Swing Detection</span>
            </div>
          </div>
        </section>

        {/* WHAT IS QUARTERLY THEORY */}
        <section className="fade-in-up relative px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Core Concept</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Understanding <span className="text-green-400">Quarterly Theory</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-green-400">What It Is</h3>
                  <p className="text-[#f3f3f3]/60 leading-relaxed text-sm md:text-base">
                    Quarterly Theory states that <strong className="text-[#f3f3f3]">all timeframes operate under a four-phase cycle</strong> — AMD-X: Accumulation, Manipulation, Distribution, and X (Continuation or Reversal). Inspired by ICT's Power of Three, it provides a structured way to interpret market cycles at every level.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-green-400">Why It Matters</h3>
                  <p className="text-[#f3f3f3]/60 leading-relaxed text-sm md:text-base">
                    By knowing which quarter the market is in, you can <strong className="text-[#f3f3f3]">anticipate liquidity grabs, Judas Swings, and trend reversals</strong> before they happen — giving you entries that most retail traders completely miss.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-green-400">Time as Fractal</h3>
                  <p className="text-[#f3f3f3]/60 leading-relaxed text-sm md:text-base">
                    The most powerful insight in Quarterly Theory is that <strong className="text-[#f3f3f3]">time is fractal</strong> — the same AMD-X cycle repeats on yearly, monthly, weekly, daily, and session timeframes. One model. Every timeframe. Perfect alignment.
                  </p>
                </div>
              </div>

              {/* AMD-X Cycle Box */}
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8 space-y-4">
                <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-2">The AMD-X Cycle</p>
                {[
                  { q: "Q1", label: "Accumulation", desc: "Price consolidates in a range. Smart money builds positions. Liquidity is collected on both sides.", color: "border-green-400 bg-green-400/10 text-green-400" },
                  { q: "Q2", label: "Manipulation", desc: "The Judas Swing. Price breaks out falsely to trigger retail stop-losses before the real move.", color: "border-red-400 bg-red-400/10 text-red-400" },
                  { q: "Q3", label: "Distribution", desc: "After clearing stops, price moves in its true intended direction. This is the high-probability trade.", color: "border-green-400 bg-green-400/10 text-green-400" },
                  { q: "Q4", label: "X — Continuation or Reversal", desc: "Price either extends the trend into the next cycle or fully reverses, starting a new AMD-X sequence.", color: "border-purple-400 bg-purple-400/10 text-purple-400" },
                ].map((phase, i) => (
                  <div key={i} className={`flex items-start gap-4 rounded-xl border p-4 ${phase.color}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 border ${phase.color}`}>
                      {phase.q}
                    </div>
                    <div>
                      <p className="font-bold text-sm mb-0.5">{phase.label}</p>
                      <p className="text-xs text-[#f3f3f3]/50 leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LIVE AMD CHART */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Visual Demo</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              The AMD-X Cycle <span className="text-green-400">Visualized</span>
            </h2>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 md:p-8 mb-6">
            <div className="overflow-x-auto">
              <canvas
                ref={chartRef}
                className="w-full rounded-xl"
                style={{ height: "320px", minWidth: "500px" }}
              />
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-[#f3f3f3]/50">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-green-400/20 border border-green-400/40" /> Q1 Accumulation</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-red-400/20 border border-red-400/40" /> Q2 Judas Swing</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-green-400/40 border border-green-400" /> Q3 Distribution</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm border border-dashed border-green-400/40" /> True Open Level</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "4", label: "Phases Per Cycle" },
              { val: "6+", label: "Timeframes Covered" },
              { val: "90min", label: "Session Quarter Split" },
              { val: "∞", label: "Fractal Levels" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                <p className="text-2xl font-extrabold text-green-400">{s.val}</p>
                <p className="text-xs text-[#f3f3f3]/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TIMEFRAME BREAKDOWN */}
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Time as Fractal</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Quarterly Breakdown <span className="text-green-400">by Timeframe</span>
              </h2>
            </div>
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {timeframes.map((tf, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTimeframe(i)}
                  className={`px-5 py-2 rounded-full text-sm font-bold border transition ${
                    activeTimeframe === i
                      ? "border-green-400 bg-green-400/20 text-green-400"
                      : "border-green-500/20 text-[#f3f3f3]/40 hover:text-white hover:border-green-500/40"
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {timeframes[activeTimeframe].quarters.map((q, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-5 card-hover ${
                    q.color.includes("red")
                      ? "border-red-500/20 bg-red-500/5"
                      : q.color.includes("purple")
                      ? "border-purple-500/20 bg-purple-500/5"
                      : "border-green-500/20 bg-green-500/5"
                  }`}
                >
                  <div className={`text-2xl font-extrabold mb-1 ${q.color}`}>{q.q}</div>
                  <p className="text-xs text-[#f3f3f3]/40 mb-2">{q.period}</p>
                  <p className="text-sm font-semibold text-[#f3f3f3]/80">{q.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUE OPENS */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Bias Determination</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              True Opens — <span className="text-green-400">The Institutional Benchmark</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4">
              <p className="text-[#f3f3f3]/60 leading-relaxed text-sm md:text-base mb-6">
                True Opens are the most critical reference points in Quarterly Theory. They act as <strong className="text-[#f3f3f3]">institutional price levels where liquidity pools exist</strong> and where smart money uses price to determine directional bias for the session.
              </p>
              {[
                { cycle: "Yearly", open: "1st Monday of April" },
                { cycle: "Monthly", open: "2nd Monday of the month" },
                { cycle: "Weekly", open: "Monday at 18:00" },
                { cycle: "Daily", open: "00:00 Midnight (London Open)" },
                { cycle: "Asian Session", open: "19:30" },
                { cycle: "London Session", open: "01:30" },
                { cycle: "New York AM", open: "07:30" },
                { cycle: "New York PM", open: "13:00" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3">
                  <span className="text-sm text-[#f3f3f3]/60">{item.cycle}</span>
                  <span className="text-sm font-bold text-green-400">{item.open}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8">
              <h3 className="text-lg font-bold mb-6 text-green-400">How to Use True Opens</h3>
              <div className="space-y-5">
                <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-4">
                  <p className="text-sm font-bold text-green-400 mb-1">↑ Bullish Bias</p>
                  <p className="text-xs text-[#f3f3f3]/60 leading-relaxed">If your bias is bullish, look for entries <strong className="text-[#f3f3f3]">below the True Open</strong>. Price dipping beneath the True Open is the Judas Swing — the manipulation that provides your low-risk entry before Q3 distribution upward.</p>
                </div>
                <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4">
                  <p className="text-sm font-bold text-red-400 mb-1">↓ Bearish Bias</p>
                  <p className="text-xs text-[#f3f3f3]/60 leading-relaxed">If your bias is bearish, look for entries <strong className="text-[#f3f3f3]">above the True Open</strong>. Price spiking above the True Open is the Judas Swing — the manipulation before Q3 distribution downward.</p>
                </div>
                <div className="rounded-xl border border-purple-400/30 bg-purple-400/10 p-4">
                  <p className="text-sm font-bold text-purple-400 mb-1">⚠️ Key Rule</p>
                  <p className="text-xs text-[#f3f3f3]/60 leading-relaxed">Never chase Q2. Wait for the manipulation to complete and enter during Q3 — the phase where smart money commits to the real direction. The True Open level is your dividing line.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* JUDAS SWING DEEP DIVE */}
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Q2 Phase</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                The <span className="text-red-400">Judas Swing</span> — Market Manipulation
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 md:p-8">
                <h3 className="text-lg font-bold mb-6 text-red-400">What Happens in Q2</h3>
                <ul className="space-y-4">
                  {[
                    "Smart money engineers a false breakout to trap retail traders into losing positions",
                    "Buy stops and sell stops are both targeted to maximize liquidity extraction",
                    "On a bullish day: price dips below the Q1 range lows, triggering long stop-losses",
                    "On a bearish day: price spikes above the Q1 range highs, triggering short stop-losses",
                    "After collecting this liquidity, price immediately reverses into Q3 distribution",
                    "The Judas Swing is your signal — not a reason to trade against the bias",
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#f3f3f3]/60">
                      <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8">
                <h3 className="text-lg font-bold mb-6 text-green-400">Weekly Example (AMD-X)</h3>
                <div className="space-y-3">
                  {[
                    { day: "Monday", phase: "Q1", action: "Narrow range forms. Accumulation. Mark the highs and lows.", color: "text-green-400" },
                    { day: "Tuesday", phase: "Q2", action: "False breakout (Judas Swing) above or below Monday's range. True Open forms.", color: "text-red-400" },
                    { day: "Wednesday", phase: "Q3", action: "Price commits to the real direction. High-conviction entry day.", color: "text-green-400" },
                    { day: "Thursday", phase: "Q4", action: "Trend continues or reverses. Manage positions, trail stops.", color: "text-purple-400" },
                    { day: "Friday", phase: "Excluded", action: "Profit-taking and rebalancing day. Avoid new entries.", color: "text-[#f3f3f3]/30" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl bg-black/20 border border-white/5 p-3">
                      <div className="w-20 flex-shrink-0">
                        <p className="text-xs font-bold text-[#f3f3f3]/70">{item.day}</p>
                        <p className={`text-xs font-bold ${item.color}`}>{item.phase}</p>
                      </div>
                      <p className="text-xs text-[#f3f3f3]/50 leading-relaxed">{item.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HTF PD ARRAY ALIGNMENT */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Confluence</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              HTF PD Array <span className="text-green-400">Alignment</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-[#f3f3f3]/60 leading-relaxed text-sm md:text-base mb-8">
                Quarterly Theory aligns perfectly with <strong className="text-[#f3f3f3]">Premium-Discount Arrays (PD Arrays)</strong>. For every timeframe you trade on, your PDA reference level should be one timeframe higher. This ensures every entry you take is supported by institutional order flow at the higher level.
              </p>
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 overflow-hidden">
                <div className="grid grid-cols-2 border-b border-green-500/20">
                  <div className="px-4 py-3 text-xs font-bold text-green-400/60 uppercase">Trading Timeframe</div>
                  <div className="px-4 py-3 text-xs font-bold text-green-400/60 uppercase border-l border-green-500/20">HTF PDA Reference</div>
                </div>
                {pdArrayRules.map((row, i) => (
                  <div key={i} className={`grid grid-cols-2 ${i !== pdArrayRules.length - 1 ? "border-b border-green-500/10" : ""}`}>
                    <div className="px-4 py-3 text-sm text-[#f3f3f3]/60">{row.ltf}</div>
                    <div className="px-4 py-3 text-sm font-bold text-green-400 border-l border-green-500/10">{row.htf}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
                <h3 className="text-base font-bold mb-4 text-green-400">Why HTF Alignment Matters</h3>
                <ul className="space-y-3 text-sm text-[#f3f3f3]/60">
                  {[
                    "Eliminates low-quality setups that go against the HTF institutional flow",
                    "Maximizes risk-to-reward by entering at HTF premium or discount zones",
                    "Confirms that the Q3 distribution move has institutional backing",
                    "Gives you confluence between Quarterly Theory timing and SMC structure",
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0">✓</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">
                <h3 className="text-base font-bold mb-3 text-purple-400">90-Minute Session Quarters</h3>
                <p className="text-sm text-[#f3f3f3]/60 leading-relaxed">
                  Each trading session (Asian, London, NY AM, NY PM) is further split into <strong className="text-[#f3f3f3]">four 90-minute quarters</strong>. This allows pinpoint entries inside the session — identifying the exact 90-minute window where the Judas Swing and Q3 distribution are most likely to occur.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Indicator Features</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Built for <span className="text-green-400">Precision</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="card-hover rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="text-base font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-[#f3f3f3]/50 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Social Proof</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Traders Love <span className="text-green-400">Quarterly Theory</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { init: "JR", name: "@JR_Forex", quote: "Understanding which quarter we're in changed everything. I stopped trading Q2 entirely and my win rate jumped immediately." },
              { init: "SM", name: "@SmartMoney_Sam", quote: "The True Open levels are unreal. Price reacts to them like clockwork on the daily sessions. Game changer for London entries." },
              { init: "AT", name: "@AlgoTrader_T", quote: "Stacking QT with my IFVG indicator gives me the most precise setups I've ever seen. The fractal concept is next level." },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">
                    {t.init}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{t.name}</p>
                    <p className="text-yellow-400 text-xs">★★★★★</p>
                  </div>
                </div>
                <p className="text-sm text-[#f3f3f3]/50 leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </section>

                {/* PRICING */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Plans</p>
            <h2 className="text-3xl md:text-4xl font-bold">Get Started with <span className="text-green-400">IFVG</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* MONTHLY */}
            <div className="relative rounded-2xl border-2 border-green-400 bg-green-500/10 p-6 md:p-8 flex flex-col pulse-glow">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-400 text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                Most Popular
              </div>
              <h3 className="text-lg font-bold mb-1">Monthly</h3>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-extrabold text-green-400">$49.99</span>
                <span className="text-sm text-[#f3f3f3]/40 font-normal mb-1">/mo</span>
              </div>
              <p className="text-xs text-[#f3f3f3]/30 mb-6">Billed monthly. Cancel anytime.</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-[#f3f3f3]/60">
                {[,
                  "Priority support",
                  "Discord access",
                  "Does not Include Future Algorithms",
                  "IFVG, CRT, QT Access",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-green-400 text-black font-bold py-3 rounded-full hover:bg-green-300 transition text-sm">
                Get Monthly Access
              </button>
            </div>

            {/* LIFETIME */}
            <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8 flex flex-col">
              <h3 className="text-lg font-bold mb-1">Lifetime</h3>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-extrabold">$499.99</span>
              </div>
              <p className="text-xs text-[#f3f3f3]/30 mb-6">One-time payment. Pay once, own it forever.</p>
              <ul className="space-y-3 mb-8 flex-1 text-sm text-[#f3f3f3]/60">
                {[
                  "Everything in Monthly",
                  "All future updates",
                  "Lifetime Discord",
                  "All Future Algorithms",
                  "Strategy vault",
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>{f}
                  </li>
                ))}
              </ul>
              <button className="w-full border border-green-500/30 text-green-400 font-bold py-3 rounded-full hover:bg-green-500/10 transition text-sm">
                Get Lifetime
              </button>
            </div>

          </div>
          <div className="text-center mt-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-sm text-green-400">
              🛡 30-Day Money-Back Guarantee
            </span>
          </div>
        </section>


        {/* FAQ */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Support</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked <span className="text-green-400">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm md:text-base pr-4">{f.q}</span>
                  <span className={`text-green-400 transition-transform duration-300 flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5">
                    <p className="text-sm text-[#f3f3f3]/50 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="fade-in-up relative px-6 md:px-8 py-20 border-t border-green-500/20 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Trade with <span className="text-green-400">Institutional Timing?</span>
            </h2>
            <p className="text-[#f3f3f3]/50 mb-10">
              Join 3,400+ traders using Quarterly Theory to time their entries with precision every single session.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-green-400 text-black font-bold text-sm hover:bg-green-300 transition pulse-glow">
                Start Free Trial
              </button>
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-green-500/30 text-green-400 font-semibold text-sm hover:bg-green-500/10 transition">
                Join Discord
              </button>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="px-6 md:px-8 py-14 border-t border-green-500/10 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
              <div className="col-span-2 md:col-span-1">
                <p className="text-lg font-semibold text-[#f3f3f3] mb-2">AlgoVision</p>
                <p className="text-xs text-[#f3f3f3]/30 leading-relaxed">Professional-Grade Smart Money Tools</p>
              </div>
              {[
                { title: "Indicators", links: ["Quarterly Theory", "IFVG", "CRT", "Order Blocks"] },
                { title: "Resources", links: ["Education", "Blog", "Strategy Vault", "Videos"] },
                { title: "Company", links: ["About", "Careers", "Contact", "Press"] },
                { title: "Legal", links: ["Privacy", "Terms", "Disclaimer", "Refunds"] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="text-sm font-bold mb-4">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l, j) => (
                      <li key={j}>
                        <a href="#" className="text-xs text-[#f3f3f3]/30 hover:text-green-400 transition">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-green-500/10 gap-4">
              <p className="text-xs text-[#f3f3f3]/20">© 2025 AlgoVision. All rights reserved.</p>
              <div className="flex gap-4 text-xs text-[#f3f3f3]/30">
                <a href="#" className="hover:text-green-400 transition">Twitter/X</a>
                <a href="#" className="hover:text-green-400 transition">Discord</a>
                <a href="#" className="hover:text-green-400 transition">YouTube</a>
                <a href="#" className="hover:text-green-400 transition">Instagram</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
