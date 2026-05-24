"use client";

import Link from "next/link";

import { useState, useEffect, useRef } from "react";

// ── Helpers ────────────────────────────────────────────────────────────────
function drawCandle(
  ctx: CanvasRenderingContext2D,
  x: number, open: number, close: number, high: number, low: number,
  bodyW: number, color: string
) {
  // Wick
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, high);
  ctx.lineTo(x, low);
  ctx.stroke();
  // Body
  const bodyTop = Math.min(open, close);
  const bodyH   = Math.max(Math.abs(close - open), 2);
  ctx.fillStyle = color;
  ctx.fillRect(x - bodyW / 2, bodyTop, bodyW, bodyH);
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, x2: number, y2: number,
  color: string, label = ""
) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const hs = 8;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hs * Math.cos(angle - Math.PI / 6), y2 - hs * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - hs * Math.cos(angle + Math.PI / 6), y2 - hs * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(label, x2 + 5, y2 + 4);
  }
}

export default function IFVGPage() {
  const [openFaq,      setOpenFaq]      = useState<number | null>(null);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [diagramStep,  setDiagramStep]  = useState(0);
  const chartRef    = useRef<HTMLCanvasElement>(null);
  const diagramRef  = useRef<HTMLCanvasElement>(null);

  // ── Scroll fade-in ────────────────────────────────────────────────────────
  useEffect(() => {
    const els = document.querySelectorAll(".fade-in-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // ── Main Chart Canvas ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const DPR = window.devicePixelRatio || 1;
    canvas.width  = canvas.offsetWidth  * DPR;
    canvas.height = canvas.offsetHeight * DPR;
    ctx.scale(DPR, DPR);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    const pad = 40;
    const cW  = W - pad * 2;
    const cH  = H - pad * 2;

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(34,197,94,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) { const y = pad + (i / 6) * cH; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke(); }
    for (let i = 0; i <= 5; i++) { const x = pad + (i / 5) * cW; ctx.beginPath(); ctx.moveTo(x, pad); ctx.lineTo(x, H - pad); ctx.stroke(); }

    const toX = (p: number) => pad + p * cW;
    const toY = (p: number) => pad + p * cH;
    const bw  = cW * 0.035;

    // ── Scene: Bullish FVG → Mitigation → IFVG (bearish) → Reaction ─────────
    // 1) Bullish displacement candles (create FVG)
    const candles: { x: number; o: number; c: number; h: number; l: number; bull: boolean }[] = [
      { x: 0.06, o: 0.78, c: 0.74, h: 0.72, l: 0.80, bull: false },
      { x: 0.13, o: 0.75, c: 0.38, h: 0.33, l: 0.77, bull: true  }, // ← BIG displacement up
      { x: 0.20, o: 0.40, c: 0.44, h: 0.38, l: 0.47, bull: false },
      // price continues up a bit
      { x: 0.27, o: 0.44, c: 0.36, h: 0.33, l: 0.46, bull: true  },
      { x: 0.34, o: 0.37, c: 0.32, h: 0.29, l: 0.39, bull: true  },
      // price reverses and mitigates FVG
      { x: 0.42, o: 0.32, c: 0.40, h: 0.30, l: 0.42, bull: false },
      { x: 0.49, o: 0.40, c: 0.52, h: 0.39, l: 0.54, bull: false },
      { x: 0.56, o: 0.52, c: 0.61, h: 0.50, l: 0.63, bull: false }, // enters FVG zone
      // touches IFVG and reacts (bearish)
      { x: 0.64, o: 0.61, c: 0.55, h: 0.57, l: 0.70, bull: false },
      { x: 0.71, o: 0.55, c: 0.48, h: 0.46, l: 0.57, bull: true  },
      { x: 0.78, o: 0.48, c: 0.42, h: 0.40, l: 0.50, bull: true  },
      { x: 0.85, o: 0.42, c: 0.36, h: 0.34, l: 0.44, bull: true  },
      { x: 0.92, o: 0.36, c: 0.30, h: 0.28, l: 0.38, bull: true  },
    ];

    // FVG zone: gap between candle[0].high and candle[2].low (between candle 1 high and candle 3 low)
    const fvgTop = toY(0.33); // candle 1 high
    const fvgBot = toY(0.47); // candle 2 low (gap)

    // IFVG zone: same price area, after mitigation
    const ifvgTop = fvgTop;
    const ifvgBot = fvgBot;

    // Draw FVG zone (bullish, cyan)
    const fvgStartX = toX(0.06);
    const fvgEndX   = toX(0.56); // up to mitigation
    ctx.fillStyle   = "rgba(34,197,94,0.12)";
    ctx.fillRect(fvgStartX, fvgTop, fvgEndX - fvgStartX, fvgBot - fvgTop);
    ctx.strokeStyle = "rgba(34,197,94,0.5)";
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(fvgStartX, fvgTop, fvgEndX - fvgStartX, fvgBot - fvgTop);
    ctx.setLineDash([]);

    // Label FVG
    ctx.font      = "bold 10px Inter, sans-serif";
    ctx.fillStyle = "rgba(34,197,94,0.8)";
    ctx.fillText("Bullish FVG", fvgStartX + 4, fvgTop - 5);

    // Draw IFVG zone (bearish, red) after mitigation
    const ifvgStartX = toX(0.56);
    const ifvgEndX   = W - pad;
    ctx.fillStyle    = "rgba(239,68,68,0.15)";
    ctx.fillRect(ifvgStartX, ifvgTop, ifvgEndX - ifvgStartX, ifvgBot - ifvgTop);
    ctx.strokeStyle  = "rgba(239,68,68,0.6)";
    ctx.lineWidth    = 1.5;
    ctx.strokeRect(ifvgStartX, ifvgTop, ifvgEndX - ifvgStartX, ifvgBot - ifvgTop);

    // Label IFVG
    ctx.font      = "bold 10px Inter, sans-serif";
    ctx.fillStyle = "#ef4444";
    ctx.fillText("Bearish IFVG", ifvgStartX + 4, ifvgTop - 5);

    // Mitigation dashed vertical line
    ctx.strokeStyle = "rgba(255,165,0,0.5)";
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toX(0.56), pad);
    ctx.lineTo(toX(0.56), H - pad);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.font      = "9px Inter, sans-serif";
    ctx.fillStyle = "rgba(255,165,0,0.7)";
    ctx.fillText("Mitigation", toX(0.565), H - pad - 5);

    // Draw candles ON TOP of zones
    candles.forEach((c) => {
      drawCandle(ctx, toX(c.x), toY(c.o), toY(c.c), toY(c.h), toY(c.l), bw, c.bull ? "#22c55e" : "#ef4444");
    });

    // Reaction arrow at IFVG
    drawArrow(ctx, toX(0.64), toY(0.55), toX(0.80), toY(0.30), "#ef4444", "Reaction ↓");

  }, []);

  // ── Diagram Canvas (Step-by-step) ─────────────────────────────────────────
  useEffect(() => {
    const canvas = diagramRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width  / (window.devicePixelRatio || 1);
    const H = canvas.height / (window.devicePixelRatio || 1);

    // Set actual resolution
    const DPR = window.devicePixelRatio || 1;
    canvas.width  = Math.round(canvas.offsetWidth  * DPR);
    canvas.height = Math.round(canvas.offsetHeight * DPR);
    ctx.scale(DPR, DPR);
    const CW = canvas.offsetWidth;
    const CH = canvas.offsetHeight;

    ctx.clearRect(0, 0, CW, CH);

    // shared helpers
    const bw   = 18;
    const label = (text: string, x: number, y: number, color: string, size = 10, bold = false) => {
      ctx.font      = `${bold ? "bold " : ""}${size}px Inter, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text, x, y);
      ctx.textAlign = "left";
    };
    const zone = (x: number, y: number, w: number, h: number, fill: string, stroke: string, dashed = false) => {
      ctx.fillStyle   = fill;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = stroke;
      ctx.lineWidth   = 1.5;
      if (dashed) ctx.setLineDash([4, 4]);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    };

    // ── STEP 1: Bullish FVG forms ─────────────────────────────────────────
    if (diagramStep === 0) {
      // 3 candles: bearish, big bullish displacement, small bearish
      // Candle 1 (bearish) — left
      const c1x = CW * 0.22;
      drawCandle(ctx, c1x, CH * 0.72, CH * 0.82, CH * 0.68, CH * 0.86, bw, "#ef4444");
      label("C1", c1x, CH * 0.92, "rgba(255,255,255,0.5)");

      // Candle 2 (big bullish displacement) — center
      const c2x = CW * 0.50;
      drawCandle(ctx, c2x, CH * 0.80, CH * 0.25, CH * 0.20, CH * 0.84, bw + 4, "#22c55e");
      label("C2", c2x, CH * 0.92, "rgba(255,255,255,0.5)");

      // FVG gap: between C1 high (0.68) and C3 low — highlight BEFORE drawing C3
      const fvgTop = CH * 0.30;
      const fvgBot = CH * 0.68;
      zone(CW * 0.34, fvgTop, CW * 0.32, fvgBot - fvgTop, "rgba(34,197,94,0.15)", "rgba(34,197,94,0.7)", true);
      label("Bullish FVG", CW * 0.50, CH * 0.50, "#22c55e", 10, true);
      label("(Gap between C1 high & C3 low)", CW * 0.50, CH * 0.62, "rgba(34,197,94,0.6)", 9);

      // Candle 3 (small bearish — body above FVG top) — right
      const c3x = CW * 0.78;
      drawCandle(ctx, c3x, CH * 0.28, CH * 0.35, CH * 0.24, CH * 0.38, bw, "#ef4444");
      label("C3", c3x, CH * 0.92, "rgba(255,255,255,0.5)");

      // Brace lines
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([3, 3]);
      // C1 high → FVG top left edge
      ctx.beginPath(); ctx.moveTo(c1x + bw / 2, CH * 0.68); ctx.lineTo(CW * 0.34, CH * 0.68); ctx.stroke();
      // C3 low → FVG bottom right edge
      ctx.beginPath(); ctx.moveTo(c3x - bw / 2, CH * 0.38); ctx.lineTo(CW * 0.66, CH * 0.30); ctx.stroke();
      ctx.setLineDash([]);
    }

    // ── STEP 2: Price mitigates the FVG ──────────────────────────────────
    if (diagramStep === 1) {
      // Show FVG zone (faded — being filled)
      zone(CW * 0.08, CH * 0.28, CW * 0.55, CH * 0.38, "rgba(34,197,94,0.07)", "rgba(34,197,94,0.3)", true);
      label("Bullish FVG", CW * 0.35, CH * 0.20, "rgba(34,197,94,0.5)", 10, true);

      // Original 3 candles (faded)
      [CW * 0.12, CW * 0.22, CW * 0.32].forEach((x, i) => {
        const isBull = i === 1;
        const opens  = [CH * 0.72, CH * 0.80, CH * 0.28];
        const closes = [CH * 0.82, CH * 0.25, CH * 0.35];
        const highs  = [CH * 0.68, CH * 0.20, CH * 0.24];
        const lows   = [CH * 0.86, CH * 0.84, CH * 0.38];
        ctx.globalAlpha = 0.35;
        drawCandle(ctx, x, opens[i], closes[i], highs[i], lows[i], bw - 2, isBull ? "#22c55e" : "#ef4444");
        ctx.globalAlpha = 1;
      });

      // Returning price candles — coming down INTO the FVG
      const ret: { x: number; o: number; c: number; h: number; l: number; bull: boolean }[] = [
        { x: CW * 0.50, o: CH * 0.35, c: CH * 0.42, h: CH * 0.32, l: CH * 0.45, bull: false },
        { x: CW * 0.60, o: CH * 0.42, c: CH * 0.52, h: CH * 0.40, l: CH * 0.55, bull: false },
        { x: CW * 0.70, o: CH * 0.52, c: CH * 0.63, h: CH * 0.50, l: CH * 0.66, bull: false }, // into zone
      ];
      ret.forEach((c) => drawCandle(ctx, c.x, c.o, c.c, c.h, c.l, bw, "#ef4444"));

      // Arrow showing mitigation
      drawArrow(ctx, CW * 0.42, CH * 0.28, CW * 0.70, CH * 0.60, "#f97316", "");
      label("Mitigation", CW * 0.72, CH * 0.50, "#f97316", 10, true);
      label("Price fills the FVG", CW * 0.50, CH * 0.82, "rgba(255,255,255,0.5)", 10);
      label("(Closes inside the gap zone)", CW * 0.50, CH * 0.91, "rgba(255,255,255,0.3)", 9);
    }

    // ── STEP 3: Zone flips → IFVG painted ────────────────────────────────
    if (diagramStep === 2) {
      // Same price area — now IFVG (bearish, red)
      zone(CW * 0.08, CH * 0.28, CW * 0.84, CH * 0.38, "rgba(239,68,68,0.18)", "#ef4444");

      // "FLIPPED" arrow in center of zone
      ctx.font      = "bold 14px Inter, sans-serif";
      ctx.fillStyle = "#ef4444";
      ctx.textAlign = "center";
      ctx.fillText("⟳  INVERTED", CW * 0.50, CH * 0.51);
      ctx.textAlign = "left";

      label("Bearish IFVG Zone", CW * 0.50, CH * 0.20, "#ef4444", 12, true);

      // Before / After labels
      ctx.font      = "10px Inter, sans-serif";
      ctx.fillStyle = "rgba(34,197,94,0.6)";
      ctx.textAlign = "center";
      ctx.fillText("Was: Bullish Support", CW * 0.50, CH * 0.70);
      ctx.fillStyle = "#ef4444";
      ctx.fillText("Now: Bearish Resistance", CW * 0.50, CH * 0.80);
      ctx.textAlign = "left";

      // Dashed horizontal lines at zone edges
      ctx.strokeStyle = "rgba(239,68,68,0.4)";
      ctx.lineWidth   = 1;
      ctx.setLineDash([6, 4]);
      [CH * 0.28, CH * 0.66].forEach((y) => {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke();
      });
      ctx.setLineDash([]);

      label("Zone polarity flipped. Now acts as resistance.", CW * 0.50, CH * 0.92, "rgba(255,255,255,0.35)", 9);
    }

    // ── STEP 4: Price returns → Reaction ─────────────────────────────────
    if (diagramStep === 3) {
      // IFVG zone (red)
      zone(CW * 0.08, CH * 0.32, CW * 0.84, CH * 0.22, "rgba(239,68,68,0.15)", "rgba(239,68,68,0.6)");
      label("Bearish IFVG", CW * 0.50, CH * 0.27, "#ef4444", 10, true);

      // Candles approaching from below
      const approach: { x: number; o: number; c: number; h: number; l: number; bull: boolean }[] = [
        { x: CW * 0.14, o: CH * 0.75, c: CH * 0.68, h: CH * 0.65, l: CH * 0.78, bull: true  },
        { x: CW * 0.24, o: CH * 0.68, c: CH * 0.60, h: CH * 0.57, l: CH * 0.71, bull: true  },
        { x: CW * 0.34, o: CH * 0.60, c: CH * 0.52, h: CH * 0.50, l: CH * 0.63, bull: true  },
        // wicks into IFVG
        { x: CW * 0.46, o: CH * 0.52, c: CH * 0.60, h: CH * 0.36, l: CH * 0.63, bull: false }, // rejects at zone
      ];
      approach.forEach((c) => drawCandle(ctx, c.x, c.o, c.c, c.h, c.l, bw, c.bull ? "#22c55e" : "#ef4444"));

      // Rejection candles (sharp move down)
      const reject: { x: number; o: number; c: number; h: number; l: number }[] = [
        { x: CW * 0.58, o: CH * 0.60, c: CH * 0.70, h: CH * 0.58, l: CH * 0.73 },
        { x: CW * 0.68, o: CH * 0.70, c: CH * 0.80, h: CH * 0.68, l: CH * 0.83 },
        { x: CW * 0.78, o: CH * 0.80, c: CH * 0.88, h: CH * 0.78, l: CH * 0.90 },
      ];
      reject.forEach((c) => drawCandle(ctx, c.x, c.o, c.c, c.h, c.l, bw, "#ef4444"));

      // Reaction arrow
      drawArrow(ctx, CW * 0.50, CH * 0.55, CW * 0.82, CH * 0.82, "#22c55e", "");
      label("↓ Rejection", CW * 0.78, CH * 0.72, "#ef4444", 10, true);

      // SL/TP tags
      ctx.strokeStyle = "rgba(239,68,68,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(CW * 0.46, CH * 0.30); ctx.lineTo(CW * 0.92, CH * 0.30); ctx.stroke();
      ctx.setLineDash([]);
      label("SL", CW * 0.89, CH * 0.27, "#ef4444", 9, true);

      ctx.strokeStyle = "rgba(34,197,94,0.5)"; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(CW * 0.58, CH * 0.90); ctx.lineTo(CW * 0.92, CH * 0.90); ctx.stroke();
      ctx.setLineDash([]);
      label("TP", CW * 0.89, CH * 0.88, "#22c55e", 9, true);

      label("Enter short at IFVG. SL above zone. TP = next demand.", CW * 0.50, CH * 0.97, "rgba(255,255,255,0.4)", 9);
    }

  }, [diagramStep]);

  // ── Data ──────────────────────────────────────────────────────────────────
  const diagramLabels = [
    "Step 1: A displacement move creates a Bullish FVG — gap between Candle 1 high and Candle 3 low",
    "Step 2: Price retraces and mitigates the FVG — closes inside the gap zone, filling it",
    "Step 3: Zone flips polarity → Bullish FVG becomes a Bearish IFVG — resistance now",
    "Step 4: Price returns to the IFVG zone and rejects sharply — your entry opportunity",
  ];

  const features = [
    { icon: "🔍", title: "Auto-Detection Engine",   desc: "Automatically identifies valid IFVGs across all timeframes with zero manual input. Just load and trade." },
    { icon: "📊", title: "HTF/LTF Alignment",       desc: "Filter signals by Higher Timeframe bias. Only take entries when HTF and LTF align for maximum confluence." },
    { icon: "⚡", title: "Displacement Filter",     desc: "Only marks IFVGs formed from true displacement candles — aggressive moves signaling institutional involvement." },
    { icon: "🎯", title: "Mitigation Tracking",     desc: "Tracks FVG mitigation in real-time. The moment a gap is filled, the IFVG zone is instantly painted." },
    { icon: "🕐", title: "Multi-Timeframe Labels",  desc: "Each IFVG zone is labeled with its originating timeframe (M15, H1, H4, D1)." },
    { icon: "🔔", title: "Alert System",            desc: "Get instant TradingView alerts the moment price enters an IFVG zone — never miss an entry again." },
  ];

  const faqs = [
    { q: "What platform does IFVG work on?",          a: "IFVG is a native TradingView Pine Script indicator. It works on any market TradingView supports — Forex, Futures, Crypto, Stocks, and Indices." },
    { q: "What timeframes work best?",                a: "IFVG works on all timeframes. We recommend H1 or H4 for the HTF bias, and M5 or M15 for entry execution." },
    { q: "Is this indicator repainting?",             a: "No. All IFVG zones are locked once printed. The indicator does not repaint or recalculate historical zones." },
    { q: "Do I need trading experience?",             a: "Basic price action knowledge is recommended. We provide a full education guide and video course with every subscription." },
    { q: "Can I use IFVG with other indicators?",     a: "Absolutely. IFVG pairs exceptionally well with Order Blocks, Liquidity levels, and our CRT indicator for maximum confluence." },
  ];

  return (
    <>
      <style>{`
        .fade-in-up { opacity:0; transform:translateY(32px); transition:opacity 0.7s ease,transform 0.7s ease; }
        .fade-in-up.visible { opacity:1; transform:translateY(0); }
        .card-hover { transition:transform 0.3s ease,box-shadow 0.3s ease,border-color 0.3s ease; }
        .card-hover:hover { transform:translateY(-4px); box-shadow:0 0 24px rgba(34,197,94,0.2); border-color:rgba(34,197,94,0.4); }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 10px rgba(34,197,94,0.2);} 50%{box-shadow:0 0 28px rgba(34,197,94,0.5);} }
        .pulse-glow { animation:pulseGlow 3s ease-in-out infinite; }
        .step-btn-active  { border-color:rgba(34,197,94,0.6)!important; background:rgba(34,197,94,0.15)!important; color:#22c55e!important; }
        .step-btn-inactive{ border-color:rgba(255,255,255,0.1)!important; background:transparent!important; color:rgba(255,255,255,0.35)!important; }
        .step-btn-active:hover,.step-btn-inactive:hover{ border-color:rgba(34,197,94,0.4)!important; color:rgba(255,255,255,0.8)!important; }
      `}</style>

      <main className="min-h-screen text-[#f3f3f3] relative overflow-x-hidden"
        style={{ background:"linear-gradient(180deg,#050806 0%,#0a1a0f 40%,#0f2d1a 100%)" }}>

        {/* GRID */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#22c55e_1px,transparent_1px),linear-gradient(to_bottom,#22c55e_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />

        {/* NAVBAR */}
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
              <Link href="/examples"     className="hover:text-white transition-colors">Examples</Link>
              <Link href="/testimonials" className="hover:text-white transition-colors">Testimonials</Link>
              <Link href="/faq"          className="hover:text-white transition-colors">FAQ</Link>
            </nav>
            <Link href="/join" className="hidden md:inline-flex items-center gap-2 bg-[#00ff88] text-black text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#00e67a] transition-colors">
              Join AlgoVision
            </Link>
          </div>
        </header>


        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#050806]/95 flex flex-col p-8 gap-6">
            <button className="self-end text-white text-2xl" onClick={() => setMenuOpen(false)}>✕</button>
            <a href="/crt"  className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>CRT Playbook</a>
            <a href="/ifvg" className="text-lg text-white"                          onClick={() => setMenuOpen(false)}>IFVG</a>
            <a href="/qt"   className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Quarterly Theory</a>
          </div>
        )}

        {/* HERO */}
        <section className="relative px-6 md:px-8 py-20 md:py-28 max-w-6xl mx-auto">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/10 blur-[160px] rounded-full pointer-events-none" />
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-semibold text-green-400 tracking-wide">Smart Money Concepts</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#f3f3f3] drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] leading-tight">IFVG Indicator</h1>
            <h2 className="text-2xl md:text-3xl mt-3 text-green-400/80">Inverse Fair Value Gap.</h2>
            <p className="mt-6 text-[#f3f3f3]/60 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
              When a Fair Value Gap is fully mitigated, it inverts polarity — flipping from support to resistance or vice versa.
              The IFVG indicator detects this flip automatically and marks the new high-probability rejection zone on your chart.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
              <button className="pulse-glow w-full sm:w-auto px-8 py-3.5 rounded-full bg-green-500 text-black font-bold text-sm hover:bg-green-400 transition">Start Free Trial</button>
              <button className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-green-500/30 text-green-400 font-semibold text-sm hover:bg-green-500/10 transition">▶ Watch Demo</button>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-xs text-[#f3f3f3]/40">
              <span>✓ TradingView Native</span>
              <span>✓ All Timeframes</span>
              <span>✓ Auto-Detection</span>
              <span>✓ HTF + LTF Alignment</span>
            </div>
          </div>
        </section>

        {/* WHAT IS IFVG — with step diagram */}
        <section className="fade-in-up relative px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Core Concept</p>
              <h2 className="text-3xl md:text-4xl font-bold">Understanding the <span className="text-green-400">IFVG</span></h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Left — explanation */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-green-400">What It Is</h3>
                  <p className="text-[#f3f3f3]/60 leading-relaxed text-sm md:text-base">
                    An Inverse Fair Value Gap (IFVG) forms when price creates a Fair Value Gap (FVG) — a 3-candle imbalance zone —
                    then <strong className="text-[#f3f3f3]">fully inverses it by closing below a bullish gap or above a bearish gap</strong>.
                    At that point the zone inverts its polarity: former support becomes resistance, former resistance becomes support.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-green-400">Why It Matters</h3>
                  <p className="text-[#f3f3f3]/60 leading-relaxed text-sm md:text-base">
                    IFVGs are <strong className="text-[#f3f3f3]">high-probability reversal zones</strong>.
                    When price returns to an IFVG, it typically reacts sharply — providing a low-risk,
                    high-reward entry aligned with smart money repositioning after the gap was filled. IFVG's also provide high probability continuation moves, after a fvg is flipped price tends to spike in the opposing direction.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-green-400">Bullish vs. Bearish IFVG</h3>
                  <div className="space-y-3">
                    <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-3 text-sm text-[#f3f3f3]/60">
                      <span className="text-green-400 font-bold">Bullish IFVG — </span>
                      A Bearish FVG gets fully mitigated (price closes above the gap).
                      The zone flips and now acts as <strong className="text-[#f3f3f3]">bullish support</strong>.
                    </div>
                    <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-[#f3f3f3]/60">
                      <span className="text-red-400 font-bold">Bearish IFVG — </span>
                      A Bullish FVG gets fully mitigated (price closes below the gap).
                      The zone flips and now acts as <strong className="text-[#f3f3f3]">bearish resistance</strong>.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — interactive step diagram */}
              <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8">
                <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-4">Step-by-Step Breakdown</p>

                {/* Step buttons */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  {["Step 1", "Step 2", "Step 3", "Step 4"].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setDiagramStep(i)}
                      className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all duration-200 ${diagramStep === i ? "step-btn-active" : "step-btn-inactive"}`}
                      style={{
                        border: `1px solid ${diagramStep === i ? "rgba(34,197,94,0.6)" : "rgba(255,255,255,0.1)"}`,
                        background: diagramStep === i ? "rgba(34,197,94,0.15)" : "transparent",
                        color: diagramStep === i ? "#22c55e" : "rgba(255,255,255,0.35)",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Canvas */}
                <canvas
                  ref={diagramRef}
                  style={{
                    width: "100%",
                    height: "240px",
                    display: "block",
                    borderRadius: "12px",
                    background: "rgba(0,0,0,0.3)",
                  }}
                />

                {/* Step label */}
                <div className="mt-4 px-3 py-3 rounded-xl bg-green-400/5 border border-green-400/15">
                  <p className="text-xs text-green-400 font-semibold leading-relaxed">{diagramLabels[diagramStep]}</p>
                </div>

                {/* Arrow nav */}
                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => setDiagramStep((s) => Math.max(0, s - 1))}
                    className="text-xs text-[#f3f3f3]/40 hover:text-green-400 transition px-3 py-1.5 rounded-lg border border-white/10 hover:border-green-400/30"
                    style={{ cursor: "pointer", background: "none" }}
                    disabled={diagramStep === 0}
                  >
                    ← Prev
                  </button>
                  <div className="flex gap-1 items-center">
                    {[0,1,2,3].map((i) => (
                      <button
                        key={i}
                        onClick={() => setDiagramStep(i)}
                        style={{ width: "6px", height: "6px", borderRadius: "50%", border: "none", cursor: "pointer",
                          background: diagramStep === i ? "#22c55e" : "rgba(255,255,255,0.15)" }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setDiagramStep((s) => Math.min(3, s + 1))}
                    className="text-xs text-[#f3f3f3]/40 hover:text-green-400 transition px-3 py-1.5 rounded-lg border border-white/10 hover:border-green-400/30"
                    style={{ cursor: "pointer", background: "none" }}
                    disabled={diagramStep === 3}
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE CHART */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Interactive Demo</p>
            <h2 className="text-3xl md:text-4xl font-bold">See It <span className="text-green-400">In Action</span></h2>
          </div>
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 md:p-8 mb-6">
            <canvas ref={chartRef} className="w-full rounded-xl" style={{ height: "300px", minWidth: "400px", display: "block" }} />
            <div className="flex flex-wrap gap-5 mt-4 text-xs text-[#f3f3f3]/50">
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-green-400/25 border border-green-400/50" /> Bullish FVG Zone</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-red-400/25 border border-red-400/50" /> Bearish IFVG Zone (flipped)</span>
              <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm border border-dashed border-orange-400/50" /> Mitigation Line</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: "73%",  label: "Avg Win Rate" },
              { val: "1:3.2", label: "Risk/Reward" },
              { val: "2018–25", label: "Backtested" },
              { val: "Forex · Futures · Crypto", label: "Instruments" },
            ].map((s, i) => (
              <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
                <p className="text-xl md:text-2xl font-extrabold text-green-400">{s.val}</p>
                <p className="text-xs text-[#f3f3f3]/40 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Key Features</p>
              <h2 className="text-3xl md:text-4xl font-bold">What Makes IFVG <span className="text-green-400">Different</span></h2>
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

        {/* EXECUTION RULES */}
        <section className="fade-in-up px-6 md:px-8 py-20 max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Strategy</p>
            <h2 className="text-3xl md:text-4xl font-bold">IFVG <span className="text-green-400">Execution Rules</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                dir: "↑ Bullish IFVG Entry", color: "text-green-400", borderColor: "border-l-green-400",
                bg: "border-green-500/30 bg-green-500/5",
                rules: ["HTF trend must be bullish (above 50 EMA on HTF)","Displacement candle must be bearish (Bearish FVG forms)","Bearish FVG must be fully mitigated (close above gap)","Zone flips → now a Bullish IFVG","Entry on return to IFVG zone from above","Stop Loss: below the IFVG low","Take Profit: next HTF POI or 1:3 minimum"],
                check: "text-green-400",
              },
              {
                dir: "↓ Bearish IFVG Entry", color: "text-red-400", borderColor: "border-l-red-400",
                bg: "border-red-500/30 bg-red-500/5",
                rules: ["HTF trend must be bearish (below 50 EMA on HTF)","Displacement candle must be bullish (Bullish FVG forms)","Bullish FVG must be fully mitigated (close below gap)","Zone flips → now a Bearish IFVG","Entry on return to IFVG zone from below","Stop Loss: above the IFVG high","Take Profit: next HTF POI or 1:3 minimum"],
                check: "text-red-400",
              },
            ].map((side, i) => (
              <div key={i} className={`rounded-2xl border ${side.bg} p-6 md:p-8 border-l-4 ${side.borderColor}`}>
                <h3 className={`text-lg font-bold mb-6 ${side.color}`}>{side.dir}</h3>
                <ul className="space-y-3 text-sm text-[#f3f3f3]/60">
                  {side.rules.map((r, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className={`${side.check} flex-shrink-0 mt-0.5`}>✓</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Social Proof</p>
              <h2 className="text-3xl md:text-4xl font-bold">Traders Love <span className="text-green-400">IFVG</span></h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { init:"FM", name:"@FX_Maverick",   quote:"The IFVG indicator changed how I trade reversals. The HTF alignment filter alone is worth 10x the price." },
                { init:"CN", name:"@CryptoNinja_X", quote:"Been using this for 3 months on crypto. My win rate jumped from 55% to 74%. The auto-detection is insane." },
                { init:"FK", name:"@FuturesKing",   quote:"The displacement filter keeps me out of fake IFVGs. Only trades high-probability setups. Love it." },
              ].map((t, i) => (
                <div key={i} className="rounded-2xl border border-green-500/20 bg-green-500/5 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-sm">{t.init}</div>
                    <div><p className="text-sm font-bold">{t.name}</p><p className="text-yellow-400 text-xs">★★★★★</p></div>
                  </div>
                  <p className="text-sm text-[#f3f3f3]/50 leading-relaxed italic">"{t.quote}"</p>
                </div>
              ))}
            </div>
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
        <section className="fade-in-up px-6 md:px-8 py-20 bg-black/20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-xs text-green-400/60 tracking-[0.2em] uppercase mb-3">Support</p>
              <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked <span className="text-green-400">Questions</span></h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-xl border border-green-500/20 bg-green-500/5 overflow-hidden">
                  <button className="w-full flex items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-semibold text-sm md:text-base pr-4">{f.q}</span>
                    <span className={`text-green-400 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {openFaq === i && <div className="px-5 pb-5"><p className="text-sm text-[#f3f3f3]/50 leading-relaxed">{f.a}</p></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="fade-in-up relative px-6 md:px-8 py-20 border-t border-green-500/20 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-green-500/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Trade <span className="text-green-400">Institutional Imbalances?</span></h2>
            <p className="text-[#f3f3f3]/50 mb-10">Join 3,400+ traders using IFVG to identify high-probability reversal zones every day.</p>
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


      </main>
    </>
  );
}
