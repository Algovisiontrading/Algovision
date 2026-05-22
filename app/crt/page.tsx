"use client";

import { useState, useEffect, useRef } from "react";

export default function CRTPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const chartRef = useRef<HTMLCanvasElement>(null);

  // Scroll fade-in
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Canvas CRT Chart
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

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(34,197,94,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
      const y = (i / 6) * H;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let i = 0; i <= 5; i++) {
      const x = (i / 5) * W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }

    const pad = 40;
    const cW = W - pad * 2;
    const cH = H - pad * 2;

    // Phase labels
    const phases = [
      { label: "Candle 1\nAccumulation", x: 0.05, color: "rgba(34,197,94,0.7)" },
      { label: "Candle 2\nManipulation", x: 0.38, color: "rgba(239,68,68,0.7)" },
      { label: "Candle 3\nDistribution", x: 0.68, color: "rgba(34,197,94,0.9)" },
    ];
    phases.forEach(({ x, color }) => {
      ctx.fillStyle = color.replace("0.7", "0.07").replace("0.9", "0.07");
      ctx.fillRect(pad + x * cW, pad, cW * 0.28, cH);
    });

    // Candles data: [x%, open%, close%, high%, low%] — 0=top, 1=bottom
    const candles: [number, number, number, number, number][] = [
      // Candle 1 — tight accumulation range
      [0.06, 0.42, 0.45, 0.38, 0.49],
      [0.12, 0.45, 0.43, 0.40, 0.48],
      [0.18, 0.43, 0.44, 0.39, 0.47],
      [0.24, 0.44, 0.42, 0.40, 0.46],
      // Candle 2 — manipulation wick down
      [0.36, 0.43, 0.72, 0.38, 0.74],
      [0.42, 0.72, 0.65, 0.60, 0.76],
      [0.48, 0.65, 0.68, 0.62, 0.71],
      // Candle 3 — strong distribution up
      [0.60, 0.67, 0.28, 0.24, 0.70],
      [0.66, 0.28, 0.22, 0.18, 0.30],
      [0.72, 0.22, 0.16, 0.12, 0.24],
      [0.78, 0.16, 0.12, 0.09, 0.18],
      [0.84, 0.12, 0.10, 0.08, 0.14],
    ];

    const toX = (p: number) => pad + p * cW;
    const toY = (p: number) => pad + p * cH;
    const bw = cW * 0.04;

    candles.forEach(([x, o, c, h, l]) => {
      const px = toX(x);
      const bull = c <= o;
      const color = bull ? "#22c55e" : "#ef4444";

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, toY(h));
      ctx.lineTo(px, toY(l));
      ctx.stroke();

      // Body
      const bodyTop = toY(Math.min(o, c));
      const bodyH = Math.abs(toY(o) - toY(c));
      ctx.fillStyle = color;
      ctx.fillRect(px - bw / 2, bodyTop, bw, Math.max(bodyH, 2));
    });

    // Manipulation low sweep line
    ctx.strokeStyle = "rgba(239,68,68,0.5)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(toX(0.06), toY(0.46));
    ctx.lineTo(toX(0.90), toY(0.46));
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillStyle = "rgba(239,68,68,0.8)";
    ctx.fillText("Liquidity Sweep", toX(0.36) + 4, toY(0.78));
    ctx.fillStyle = "rgba(34,197,94,0.8)";
    ctx.fillText("C1 Range", toX(0.06), toY(0.36));
    ctx.fillStyle = "#22c55e";
    ctx.fillText("Distribution ↑", toX(0.60) + 4, toY(0.07));
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.fillText("Range Low", toX(0.60), toY(0.44));

    // Phase dividers
    [0.33, 0.57].forEach((x) => {
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(toX(x), pad);
      ctx.lineTo(toX(x), H - pad);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Phase band labels
    ctx.font = "10px Inter, sans-serif";
    [
      { label: "ACCUMULATION", x: 0.10, color: "rgba(34,197,94,0.4)" },
      { label: "MANIPULATION", x: 0.38, color: "rgba(239,68,68,0.4)" },
      { label: "DISTRIBUTION", x: 0.64, color: "rgba(34,197,94,0.4)" },
    ].forEach(({ label, x, color }) => {
      ctx.fillStyle = color;
      ctx.fillText(label, toX(x), pad + 12);
    });
  }, []);

  const features = [
    { icon: "🔍", title: "CRT Detection Engine", desc: "Automatically detects CRT formations in real-time across all markets and timeframes. No manual scanning required." },
    { icon: "💧", title: "Liquidity Mapping", desc: "Pinpoints exact liquidity pools above and below accumulation ranges — the precise targets smart money is engineering toward." },
    { icon: "⚡", title: "Displacement Filter", desc: "Only flags CRT setups with true displacement candles confirming institutional commitment, eliminating low-quality signals." },
    { icon: "🎯", title: "Execution Zones", desc: "Draws high-precision entry zones inside the distribution candle with clear stop-loss and take-profit levels on your chart." },
    { icon: "📊", title: "HTF Context Overlay", desc: "Overlays the higher timeframe bias directly on your entry timeframe so every CRT trade is aligned with institutional flow." },
    { icon: "🔔", title: "Smart Alerts", desc: "Receive TradingView alerts the moment a CRT setup completes — so you're ready to execute before price moves." },
  ];

  const steps = [
    { n: "1", title: "Candle 1 — Accumulation", desc: "Price builds a defined range as smart money accumulates positions. The high and low of this candle are your key reference levels.", color: "border-green-400 text-green-400" },
    { n: "2", title: "Candle 2 — Manipulation", desc: "Price wicks beyond the Candle 1 range to sweep liquidity — triggering stops above highs or below lows. This is the Judas Swing.", color: "border-red-400 text-red-400" },
    { n: "3", title: "Candle 3 — Distribution", desc: "After sweeping liquidity, price reverses sharply into its true direction. This is your entry candle — the real institutional move.", color: "border-green-400 text-green-400" },
  ];

  const faqs = [
    { q: "What markets does the CRT Playbook work on?", a: "CRT works on any market available on TradingView — Forex, Futures, Crypto, Stocks, and Indices. The concept is universal because it's based on institutional price delivery, not market-specific mechanics." },
    { q: "What timeframes work best for CRT?", a: "CRT works across all timeframes. We recommend using H1 or H4 for identifying the setup and M5 or M15 for precise entry execution inside the distribution candle." },
    { q: "Does the indicator repaint?", a: "No. CRT zones are locked once the three-candle sequence completes. The indicator never repaints or moves historical levels." },
    { q: "Do I need a lot of trading experience?", a: "Basic price action understanding is helpful, but we include a full onboarding guide and video walkthrough covering everything from setup to live execution." },
    { q: "Can I combine CRT with IFVG and Quarterly Theory?", a: "Absolutely — and we recommend it. Using CRT for the candle structure, QT for timing, and IFVG for the entry zone creates one of the highest-confluence setups in the AlgoVision system." },
    { q: "Is this a one-time purchase or subscription?", a: "We offer both monthly access at $49.99/month and a one-time lifetime access at $500. The lifetime plan includes all future indicators, updates, and premium Discord." },
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
          box-shadow: 0 0 28px rgba(34,197,94,0.2);
          border-color: rgba(34,197,94,0.4);
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 10px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 30px rgba(34,197,94,0.6); }
        }
        .pulse-glow { animation: pulseGlow 3s ease-in-out infinite; }
        @keyframes candleRise {
          0% { transform: scaleY(0.4); opacity: 0.4; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        .candle-animate { animation: candleRise 0.6s ease forwards; transform-origin: bottom; }
      `}</style>

      <main
        className="min-h-screen text-[#f3f3f3] relative overflow-visible"

        style={{ background: "linear-gradient(180deg, #050806 0%, #0a1a0f 40%, #0f2d1a 100%)" }}
      >
        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#22c55e_1px,transparent_1px),linear-gradient(to_bottom,#22c55e_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        {/* VIGNETTE */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

        {/* NAVBAR — RIGHT‑ALIGNED NAVIGATION */}
        <header className="flex justify-between items-center px-8 py-6 border-b border-green-500/20 bg-[#050806]/40 backdrop-blur-sm relative z-50">

          {/* LEFT — LOGO */}
          <div className="text-lg font-semibold tracking-wide text-[#f3f3f3] drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            AlgoVision
          </div>

          {/* RIGHT — NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8 text-[#f3f3f3]/60 text-sm">

            <div className="relative group">
              <div className="hover:text-white transition flex items-center gap-1 cursor-pointer">
                Algorithms <span className="text-xs">▼</span>
              </div>


              <div
                className="
                  absolute right-0 mt-2
                  opacity-0 pointer-events-none
                  group-hover:opacity-100 group-hover:pointer-events-auto
                  transition-all duration-150
                  flex flex-col
                  bg-[#0a0f0a]/90
                  border border-green-500/20
                  rounded-lg shadow-lg
                  p-3 w-48
                  backdrop-blur-md
                  z-[9999]
                "
              >

                <a href="/crt" className="text-white transition py-1.5 text-sm">CRT Playbook</a>
                <a href="/ifvg" className="text-[#f3f3f3]/70 hover:text-white transition py-1.5 text-sm">IFVG</a>
                <a href="/qt" className="text-[#f3f3f3]/70 hover:text-white transition py-1.5 text-sm">Quarterly Theory</a>
              </div>
            </div>


            <a href="/examples" className="hover:text-white transition">Examples</a>
            <a href="/testimonials" className="hover:text-white transition">Testimonials</a>
            <a href="/faq" className="hover:text-white transition">FAQ</a>

            {/* LOGIN BUTTON */}
            <button className="px-5 py-2 rounded-full border border-green-500/20 hover:bg-green-500/10 transition text-white">
              Login
            </button>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button className="md:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </header>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#050806]/95 flex flex-col p-8 gap-6">
            <button className="self-end text-white text-2xl" onClick={() => setMenuOpen(false)}>✕</button>
            <a href="/crt" className="text-lg text-white" onClick={() => setMenuOpen(false)}>CRT Playbook</a>
            <a href="/ifvg" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>IFVG</a>
            <a href="/qt" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Quarterly Theory</a>
            <a href="/examples" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Examples</a>
            <a href="/testimonials" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Testimonials</a>
            <button className="w-full py-3 rounded-full bg-green-500 text-black font-bold mt-4" onClick={() => setMenuOpen(false)}>Get Access</button>
          </div>
        )}

        {/* HERO */}
        <section className="relative px-6 md:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-14 max-w-6xl mx-auto items-center">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-green-500/10 blur-[180px] rounded-full pointer-events-none" />

          {/* LEFT */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400 tracking-wide">TradingView Indicator</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#f3f3f3] drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] leading-tight">
              CRT Playbook
            </h1>
            <h2 className="text-2xl md:text-3xl mt-3 text-green-400/80">Candle Range Theory.</h2>
            <p className="mt-5 text-[#f3f3f3]/60 text-base md:text-lg leading-relaxed">
              Decode institutional price delivery by identifying candle range expansions, liquidity sweeps, and displacement moves — revealing the exact zones where smart money engineers reversals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button className="pulse-glow px-7 py-3.5 rounded-full bg-green-500 text-black font-bold text-sm hover:bg-green-400 transition">
                Purchase Indicator
              </button>
              <button className="px-7 py-3.5 rounded-full border border-green-500/30 text-green-400 font-semibold text-sm hover:bg-green-500/10 transition">
                ▶ View Examples
              </button>
            </div>
            <p className="mt-5 text-[#f3f3f3]/30 text-xs flex items-center gap-4">
              <span>✓ Lifetime Access</span>
              <span>✓ Free Updates</span>
              <span>✓ Secure Checkout</span>
            </p>
          </div>

          {/* RIGHT — CANVAS CHART */}
          <div className="relative z-10 bg-[#0a0f0a]/60 border border-green-500/20 rounded-2xl p-5 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-[#f3f3f3]">CRT Structure — Live Demo</p>
                <p className="text-xs text-[#f3f3f3]/40">Higher Timeframe View</p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-green-400/10 text-green-400 border border-green-400/20">Accumulation</span>
                <span className="px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 border border-red-400/20">Manipulation</span>
              </div>
            </div>
            <canvas
              ref={chartRef}
              className="w-full rounded-xl"
              style={{ height: "260px" }}
            />
            <div className="flex gap-4 mt-3 text-xs text-[#f3f3f3]/40">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-green-400/30 border border-green-400/40" /> C1 Range</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400/30 border border-red-400/40" /> Liquidity Sweep</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm border border-dashed border-green-400/30" /> Range Low</span>
            </div>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="fade-in-up border-y border-green-500/10 bg-black/20 py-6 px-6 md:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { val: "68%+", label: "Average Win Rate" },
              { val: "1:3.5", label: "Risk/Reward Ratio" },
              { val: "2017–25", label: "Backtested Range" },
              { val: "All Markets", label: "Forex · Futures · Crypto" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-2xl font-extrabold text-green-400">{s.val}</p>
                <p className="text-xs text-[#f3f3f3]/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3-PHASE MODEL */}
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Core Concept</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                Candle Range Theory — <span className="text-green-400">3 Phase Model</span>
              </h2>
              <p className="text-[#f3f3f3]/50 mt-3 max-w-xl mx-auto text-sm">
                Accumulation → Manipulation → Distribution. The same three-candle sequence repeats across every market and timeframe.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <div key={i} className={`card-hover rounded-2xl border bg-green-500/5 p-6 flex flex-col gap-5 ${step.color.includes("red") ? "border-red-500/20" : "border-green-500/20"}`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-extrabold text-base ${step.color}`}>
                      {step.n}
                    </div>
                    {/* Mini candle visual */}
                    <div className="flex items-end gap-1 h-10">
                      {step.n === "1" && (
                        <>
                          <MiniCandle height={22} bull />
                          <MiniCandle height={16} bull={false} />
                          <MiniCandle height={20} bull />
                          <MiniCandle height={18} bull />
                        </>
                      )}
                      {step.n === "2" && (
                        <>
                          <MiniCandle height={18} bull />
                          <MiniCandle height={38} bull={false} wick />
                          <MiniCandle height={14} bull={false} />
                        </>
                      )}
                      {step.n === "3" && (
                        <>
                          <MiniCandle height={12} bull={false} />
                          <MiniCandle height={28} bull />
                          <MiniCandle height={36} bull />
                          <MiniCandle height={40} bull />
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-2">{step.title}</h3>
                    <p className="text-sm text-[#f3f3f3]/50 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">What You Get</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything in the <span className="text-green-400">CRT Playbook</span>
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
        </section>

        {/* EXECUTION RULES */}
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Strategy</p>
              <h2 className="text-3xl md:text-4xl font-bold">
                CRT <span className="text-green-400">Execution Rules</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-green-400/30 bg-green-500/5 p-6 md:p-8 border-l-4 border-l-green-400">
                <h3 className="text-lg font-bold mb-6 text-green-400">↑ Bullish CRT Entry</h3>
                <ul className="space-y-3 text-sm text-[#f3f3f3]/60">
                  {[
                    "HTF bias is bullish — price trading above HTF 50 EMA",
                    "Candle 1 forms a defined accumulation range",
                    "Candle 2 wicks below C1 low to sweep sell-side liquidity",
                    "Candle 3 closes back above C1 low with momentum",
                    "Entry: inside the C3 body at market or on a retest",
                    "Stop Loss: below the Candle 2 manipulation wick low",
                    "Take Profit: C1 high or next HTF supply zone (min 1:3)",
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400 flex-shrink-0 mt-0.5">✓</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-red-400/30 bg-red-500/5 p-6 md:p-8 border-l-4 border-l-red-400">
                <h3 className="text-lg font-bold mb-6 text-red-400">↓ Bearish CRT Entry</h3>
                <ul className="space-y-3 text-sm text-[#f3f3f3]/60">
                  {[
                    "HTF bias is bearish — price trading below HTF 50 EMA",
                    "Candle 1 forms a defined accumulation range",
                    "Candle 2 wicks above C1 high to sweep buy-side liquidity",
                    "Candle 3 closes back below C1 high with momentum",
                    "Entry: inside the C3 body at market or on a retest",
                    "Stop Loss: above the Candle 2 manipulation wick high",
                    "Take Profit: C1 low or next HTF demand zone (min 1:3)",
                  ].map((r, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0 mt-0.5">✓</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Social Proof</p>
            <h2 className="text-3xl md:text-4xl font-bold">
              What Traders Are <span className="text-green-400">Saying</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { init: "JK", name: "@JordanKFX", quote: "The three-candle model is genius in its simplicity. I used to overcomplicate entries — CRT gave me one clean framework that just works." },
              { init: "MM", name: "@MarcusMarkets", quote: "Made back the lifetime price in two weeks. The liquidity mapping feature alone saves me from so many fake breakouts." },
              { init: "TN", name: "@TradingNova_", quote: "Stacking CRT with QT and IFVG from AlgoVision is the most lethal combination I've found. The confluence is unreal." },
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">{t.init}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked <span className="text-green-400">Questions</span></h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-sm md:text-base pr-4">{f.q}</span>
                  <span className={`text-green-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
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
              Ready to Trade <span className="text-green-400">Like an Institution?</span>
            </h2>
            <p className="text-[#f3f3f3]/50 mb-10">
              Join thousands of traders using the CRT Playbook to identify high-probability setups every session.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-green-400 text-black font-bold text-sm hover:bg-green-300 transition pulse-glow">
                Purchase Indicator
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
                { title: "Indicators", links: ["CRT Playbook", "IFVG", "Quarterly Theory", "Order Blocks"] },
                { title: "Resources", links: ["Education", "Blog", "Strategy Vault", "Videos"] },
                { title: "Company", links: ["About", "Careers", "Contact", "Press"] },
                { title: "Legal", links: ["Privacy", "Terms", "Disclaimer", "Refunds"] },
              ].map((col, i) => (
                <div key={i}>
                  <h4 className="text-sm font-bold mb-4">{col.title}</h4>
                  <ul className="space-y-2">
                    {col.links.map((l, j) => (
                      <li key={j}><a href="#" className="text-xs text-[#f3f3f3]/30 hover:text-green-400 transition">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-green-500/10 gap-4">
              <p className="text-xs text-[#f3f3f3]/20">© {new Date().getFullYear()} AlgoVision. All rights reserved.</p>
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

// Mini candle component for phase cards
function MiniCandle({ height, bull, wick }: { height: number; bull: boolean; wick?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-end" style={{ height: "44px" }}>
      {wick && <div className="w-[1.5px] bg-white/30" style={{ height: "8px" }} />}
      <div
        className={`w-2.5 rounded-sm ${bull ? "bg-green-400" : "bg-red-400"}`}
        style={{ height: `${height}px` }}
      />
      {wick && <div className="w-[1.5px] bg-white/30" style={{ height: "8px" }} />}
    </div>
  );
}
