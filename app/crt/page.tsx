"use client";

import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

interface Step { number: string; title: string; body: string; tag: string; }
interface Trade { pair: string; direction: "LONG" | "SHORT"; session: string; entry: string; sl: string; tp: string; rr: string; result: "WIN" | "LOSS" | "BE"; pnl: string; note: string; }
interface FAQItem { q: string; a: string; popular?: boolean; }

const STEPS: Step[] = [
  { number: "01", tag: "HTF Context",   title: "Establish the HTF Bias",         body: "Before touching the 1H chart, read the Daily and 4H structure. Is price drawing to a premium or discount? Are we in an uptrend or downtrend? CRT only fires with structure — never against it. Your HTF bias filters out 70% of false setups before they happen." },
  { number: "02", tag: "Key Candle",    title: "Identify the Key Candle",        body: "On the 1H or 4H chart, locate a candle with wide range and a decisive close in one direction. The wider the body relative to the wicks, the stronger the reference. This candle defines the liquidity pools — its wick high and wick low are what the market is engineered to revisit." },
  { number: "03", tag: "Level Marking", title: "Mark the Wick High & Low",       body: "Draw clean horizontal lines at the exact wick high and wick low — not the body. These are the stop-order clusters where retail traders have placed their stops above swing highs and below swing lows. The market will be drawn to sweep these before committing to direction." },
  { number: "04", tag: "The Sweep",     title: "Wait for the Liquidity Sweep",   body: "Do nothing until price wicks above the key candle high (for a short) or below the key candle low (for a long). The sweep must be fast and aggressive — a slow grind through the level is not a sweep. The wick should visibly spike beyond the level on the LTF before snapping back." },
  { number: "05", tag: "Confirmation",  title: "Confirm the LTF Rejection",      body: "Drop to the 5m or 15m chart. After the sweep, look for a strong confirmation candle closing back inside the key candle range. Ideally this forms an FVG, order block, or engulfing candle at the swept zone. This close-back is your entry signal — not the wick itself." },
  { number: "06", tag: "Execution",     title: "Enter, Size & Target",           body: "Enter at the close of the confirmation candle. SL sits 3–5 pips beyond the swept wick extremity. TP1 = 50% equilibrium of the key candle range. TP2 = the full opposite wick. Scale out at TP1, trail the runner to TP2. Minimum RR to take the trade: 2:1." },
];

const TRADES: Trade[] = [
  { pair: "XAU/USD", direction: "LONG",  session: "London",  entry: "2 332.0", sl: "2 323.5", tp: "2 368.0", rr: "4.2 : 1", result: "WIN",  pnl: "+$840",  note: "4H key candle, Q3 London confirmation" },
  { pair: "GBP/USD", direction: "SHORT", session: "NY Open", entry: "1.27420", sl: "1.27510", tp: "1.27080", rr: "3.8 : 1", result: "WIN",  pnl: "+$680",  note: "1H CRT sweep above prior day high" },
  { pair: "EUR/USD", direction: "LONG",  session: "London",  entry: "1.08220", sl: "1.08150", tp: "1.08450", rr: "3.3 : 1", result: "WIN",  pnl: "+$460",  note: "15m LTF OB inside 1H CRT zone" },
  { pair: "NAS100",  direction: "SHORT", session: "NY Open", entry: "19 120",  sl: "19 215",  tp: "18 780",  rr: "3.6 : 1", result: "WIN",  pnl: "+$720",  note: "Daily CRT + IFVG confluence" },
  { pair: "USD/JPY", direction: "SHORT", session: "London",  entry: "156.420", sl: "156.640", tp: "155.760", rr: "3.0 : 1", result: "LOSS", pnl: "−$220",  note: "HTF trend invalidated post-entry" },
  { pair: "XAU/USD", direction: "SHORT", session: "NY Open", entry: "2 351.0", sl: "2 358.5", tp: "2 324.0", rr: "3.6 : 1", result: "WIN",  pnl: "+$720",  note: "Premium CRT with QT Q2 sweep timing" },
  { pair: "GBP/JPY", direction: "LONG",  session: "London",  entry: "197.860", sl: "197.520", tp: "199.080", rr: "3.6 : 1", result: "WIN",  pnl: "+$610",  note: "Classic CRT reversal at discount zone" },
  { pair: "EUR/USD", direction: "SHORT", session: "NY Open", entry: "1.08740", sl: "1.08820", tp: "1.08460", rr: "3.5 : 1", result: "WIN",  pnl: "+$560",  note: "4H + 1H CRT aligned, session Q3 entry" },
];

const FAQS: FAQItem[] = [
  { q: "What time frame should I identify the key candle on?",     a: "The 1H and 4H are the primary time frames for key candle identification. The Daily candle also produces excellent swing-trading CRT setups. Never identify a key candle on sub-15m charts — the signal-to-noise ratio is too low and the resulting sweeps are too small to trade with meaningful risk/reward.", popular: true },
  { q: "How do I know if a sweep is genuine or just a breakout?",  a: "A genuine CRT sweep closes back inside the key candle range within 1–3 LTF candles. If price aggressively closes above the swept level and holds there on the 15m, the setup is invalidated — price is breaking out, not sweeping. When in doubt, wait: a real sweep snaps back quickly.", popular: true },
  { q: "Can I use CRT on crypto or stocks?",                       a: "Yes. CRT is a liquidity-based framework that works on any market where retail traders cluster their stops around visible highs and lows. It performs best on liquid instruments: BTC, ETH, NQ, ES, EUR/USD, GBP/USD, and XAU/USD. Avoid illiquid altcoins or penny stocks where sweeps can be manufactured by a single participant." },
  { q: "What is the minimum RR I should accept on a CRT trade?",   a: "Never take a CRT trade with less than 2:1 risk/reward measured from your entry to TP1 (50% of the key candle range). If your entry is too far from the swept wick or your SL is too wide, the setup does not meet the criteria — skip it. The best CRT setups naturally deliver 3:1 to 4:1." },
  { q: "Should I wait for the 15m close or can I enter on the 5m?",a: "The 15m confirmation is the standard for most pairs. The 5m is acceptable for high-volatility instruments like XAU/USD or NAS100 where moves can be very fast. Never use a 1m candle close as your sole entry trigger — it produces too many premature entries on partial sweeps." },
  { q: "How does CRT combine with IFVG and Quarterly Theory?",     a: "The triple confluence setup occurs when a CRT sweep happens inside an IFVG zone during the Q3 window of a session. This is the highest-probability setup in the AlgoVision system. CRT provides the trigger, IFVG provides the zone precision, and QT confirms you're in the right time window. When all three align, win rate and RR both improve measurably.", popular: true },
];

const RULES_DO = [
  "Confirm HTF bias before every CRT trade — never trade against the daily trend",
  "Wait for the wick to sweep AND the LTF confirmation close before entering",
  "Size to 1–2% max risk per trade regardless of conviction level",
  "Scale out at TP1, trail the runner — never move SL against the position",
  "Combine with IFVG or QT for highest-conviction setups",
  "Log every trade: setup, screenshot, outcome — review weekly",
];

const RULES_DONT = [
  "Enter during the sweep itself — the rejection close is the signal, not the wick",
  "Use key candles with less than ~15 pip range — too small for a valid setup",
  "Trade CRT setups that counter the clear HTF trend without a major structural reason",
  "Move SL to breakeven before TP1 is hit — give the trade room to breathe",
  "Re-enter after a failed CRT sweep without waiting for a brand new key candle",
  "Take a setup below 2:1 RR — if the math does not work, skip and wait",
];

const STATS = [
  { label: "Community Win Rate", value: "83%",     sub: "on logged CRT setups"  },
  { label: "Average RR",         value: "3.1 : 1", sub: "across 1,200+ trades"  },
  { label: "Best Instrument",    value: "XAU/USD", sub: "highest win rate"       },
  { label: "Ideal Time Frame",   value: "1H / 4H", sub: "for key candle ID"      },
];

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${open ? "border-white/15 bg-white/[0.04]" : "border-white/[0.07] bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.03]"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group" aria-expanded={open}>
        <div className="flex items-center gap-3 flex-wrap flex-1">
          <span className={`text-sm font-semibold transition-colors ${open ? "text-white" : "text-white/70 group-hover:text-white/90"}`}>{item.q}</span>
          {item.popular && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 text-[#00ff88] bg-[#00ff88]/15 border border-[#00ff88]/25">Popular</span>}
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5 transition-transform duration-300 text-white/30" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: open ? 500 : 0 }}>
        <p className="px-6 pb-6 text-sm text-white/55 leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

function TradeRow({ trade }: { trade: Trade }) {
  const resultColor = trade.result === "WIN" ? "#00ff88" : trade.result === "LOSS" ? "#ff4d6d" : "#ffbe0b";
  const dirColor = trade.direction === "LONG" ? "#00ff88" : "#ff4d6d";
  return (
    <tr className="border-t border-white/[0.05] hover:bg-white/[0.025] transition-colors">
      <td className="py-3.5 px-4 font-mono text-sm font-bold text-white">{trade.pair}</td>
      <td className="py-3.5 px-4">
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: dirColor, background: `${dirColor}15`, border: `1px solid ${dirColor}28` }}>{trade.direction}</span>
      </td>
      <td className="py-3.5 px-4 text-xs text-white/40">{trade.session}</td>
      <td className="py-3.5 px-4 font-mono text-xs text-white/60">{trade.entry}</td>
      <td className="py-3.5 px-4 font-mono text-xs text-[#ff4d6d]">{trade.sl}</td>
      <td className="py-3.5 px-4 font-mono text-xs text-[#00ff88]">{trade.tp}</td>
      <td className="py-3.5 px-4 font-mono text-xs text-white/45">{trade.rr}</td>
      <td className="py-3.5 px-4">
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: resultColor, background: `${resultColor}15`, border: `1px solid ${resultColor}28` }}>{trade.result}</span>
      </td>
      <td className="py-3.5 px-4 font-mono text-sm font-bold" style={{ color: resultColor }}>{trade.pnl}</td>
      <td className="py-3.5 px-4 text-xs text-white/30 hidden xl:table-cell">{trade.note}</td>
    </tr>
  );
}

export default function CRTPage() {
  return (
    <>
      <Head>
        <title>Candle Range Theory (CRT) — AlgoVision</title>
        <meta name="description" content="Master Candle Range Theory — the institutional liquidity sweep strategy behind AlgoVision's 83% win rate. Full breakdown, trade log, and execution guide." />
      </Head>

      <div className="min-h-screen bg-[#030508] text-white overflow-x-hidden">

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,255,136,0.09) 0%, transparent 70%)" }} />

        {/* ── Header ── */}
        <header className="relative z-50 border-b border-white/[0.06] bg-[#030508]/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-[#00ff88] font-black text-xl tracking-tight">Algo</span>
              <span className="text-white font-black text-xl tracking-tight">Vision</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/60">
              <Link href="/crt"          className="text-[#00ff88] font-semibold">CRT</Link>
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

        {/* ── Hero ── */}
        <section className="relative z-10 pt-24 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
                Core Strategy 01
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
                Candle<br />Range<br /><span className="text-[#00ff88]">Theory</span>
              </h1>
              <p className="text-white/55 text-lg leading-relaxed mb-4">
                CRT is the bedrock of the AlgoVision system. It exploits the market's engineered tendency to sweep prior candle highs and lows before reversing — turning institutional stop hunts into precision, high-RR entries.
              </p>
              <p className="text-white/35 text-sm leading-relaxed mb-10">
                Works on Forex, Gold, Indices, and Crypto. Requires no indicators. Fully rule-based. Backtests to 83% win rate on high-confluence setups.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/join" className="inline-flex items-center gap-2 bg-[#00ff88] text-black font-bold px-7 py-4 rounded-xl hover:bg-[#00e67a] transition-colors text-sm">
                  Access CRT Modules
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
                <Link href="/examples" className="inline-flex items-center gap-2 border border-white/15 text-white/70 font-semibold px-7 py-4 rounded-xl hover:border-white/30 hover:text-white transition-colors text-sm">
                  See Live Examples
                </Link>
              </div>
            </div>

            {/* Chart */}
            <div className="relative">
              <div className="relative rounded-2xl border border-white/10 bg-[#050810] overflow-hidden" style={{ height: 400 }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#00ff8820 1px, transparent 1px), linear-gradient(90deg, #00ff8820 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,255,136,0.07), transparent 65%)" }} />
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 580 400" preserveAspectRatio="none">
                  <rect x="110" y="90" width="90" height="220" fill="rgba(0,255,136,0.05)" />
                  <line x1="0" y1="90"  x2="580" y2="90"  stroke="#ff4d6d" strokeWidth="1.5" strokeDasharray="8,5" opacity="0.75" />
                  <line x1="0" y1="310" x2="580" y2="310" stroke="#ff4d6d" strokeWidth="1.5" strokeDasharray="8,5" opacity="0.75" />
                  <line x1="0" y1="200" x2="580" y2="200" stroke="#00ff88" strokeWidth="1"   strokeDasharray="4,4" opacity="0.3" />
                  {[[30,160,175,148],[65,145,162,155],[100,150,168,140]].map(([x,h,o,c],i)=>(
                    <g key={`p${i}`}><line x1={x} y1={h} x2={x} y2={220} stroke="#00ff88" strokeWidth="1.5" opacity="0.5"/><rect x={x-12} y={Math.min(o,c)} width={24} height={Math.max(2,Math.abs(o-c))} fill="#00ff88" opacity="0.65" rx="1.5"/></g>
                  ))}
                  <line x1="155" y1="84"  x2="155" y2="316" stroke="#00ff88" strokeWidth="2.5" opacity="0.95"/>
                  <rect x="140" y="96" width="30" height="208" fill="#00ff88" opacity="0.2" rx="2"/>
                  <text x="172" y="82" fill="#00ff88" fontSize="9.5" fontWeight="bold" opacity="0.9">KEY CANDLE</text>
                  {[[195,140,155,132],[228,130,145,138],[261,135,148,125]].map(([x,h,o,c],i)=>(
                    <g key={`c${i}`}><line x1={x} y1={h} x2={x} y2={200} stroke="#ff4d6d" strokeWidth="1.5" opacity="0.5"/><rect x={x-12} y={Math.min(o,c)} width={24} height={Math.max(2,Math.abs(o-c))} fill="#ff4d6d" opacity="0.65" rx="1.5"/></g>
                  ))}
                  <line x1="300" y1="52" x2="300" y2="230" stroke="#ff4d6d" strokeWidth="2.5" opacity="1"/>
                  <rect x="285" y="78" width="30" height="80" fill="#ff4d6d" opacity="0.8" rx="2"/>
                  <text x="314" y="50" fill="#ffbe0b" fontSize="9.5" fontWeight="bold">SWEEP</text>
                  <line x1="338" y1="86" x2="338" y2="210" stroke="#00ff88" strokeWidth="2.5" opacity="1"/>
                  <rect x="323" y="96" width="30" height="80" fill="#00ff88" opacity="0.9" rx="2"/>
                  <text x="353" y="90" fill="#00ff88" fontSize="9.5" fontWeight="bold">ENTRY</text>
                  {[[378,170,188,220],[415,195,215,250],[450,218,238,272],[485,244,262,298],[520,268,285,316],[555,290,305,316]].map(([x,h,o,c],i)=>(
                    <g key={`d${i}`}><line x1={x} y1={h} x2={x} y2={c} stroke="#00ff88" strokeWidth="1.5" opacity="0.6"/><rect x={x-12} y={o} width={24} height={Math.max(2,c-o)} fill="#00ff88" opacity="0.75" rx="1.5"/></g>
                  ))}
                  <text x="8"   y="84"  fill="#ff4d6d" fontSize="8.5" fontWeight="bold" opacity="0.85">HIGH — SELL-SIDE LIQ.</text>
                  <text x="8"   y="322" fill="#ff4d6d" fontSize="8.5" fontWeight="bold" opacity="0.85">LOW — BUY-SIDE LIQ.</text>
                  <text x="468" y="328" fill="#00ff88" fontSize="8.5" fontWeight="bold" opacity="0.85">TP — FULL RANGE</text>
                </svg>
                <div className="absolute bottom-4 left-4 flex flex-col gap-1.5">
                  {[["#00ff88","Key Candle / Entry / TP"],["#ff4d6d","Liquidity Level / Sweep"],["#ffbe0b","Stop Hunt Signal"]].map(([c,l])=>(
                    <div key={l} className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{background:c as string}}/><span className="text-[10px] text-white/45">{l as string}</span></div>
                  ))}
                </div>
                <div className="absolute top-4 right-4 text-4xl font-black text-[#00ff88]/[0.07] select-none">CRT</div>
              </div>
              <div className="absolute -inset-6 -z-10 rounded-3xl opacity-25 pointer-events-none" style={{background:"radial-gradient(ellipse at 50% 50%, rgba(0,255,136,0.3), transparent 65%)"}}/>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
            {STATS.map((s) => (
              <div key={s.label} className="bg-[#030508] px-8 py-8 flex flex-col items-center text-center gap-1 hover:bg-white/[0.02] transition-colors">
                <span className="text-3xl md:text-4xl font-black text-[#00ff88]">{s.value}</span>
                <span className="text-sm font-semibold text-white mt-1">{s.label}</span>
                <span className="text-xs text-white/30">{s.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── What is CRT ── */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6"><div className="w-1 h-6 rounded-full bg-[#00ff88]"/><h2 className="text-2xl font-black text-white">What is CRT?</h2></div>
              <div className="space-y-4 text-white/55 text-sm leading-relaxed">
                <p>Candle Range Theory is rooted in one core observation: the market systematically engineers price to sweep the high or low of a significant prior candle before committing to the real direction. This is not random — it is the mechanism by which large institutions fill orders against retail stop-loss clusters.</p>
                <p>Retail traders place their stops in predictable locations: just above swing highs and just below swing lows. These clusters represent pools of pending orders that institutional algorithms actively target. By hunting these stops, smart money fills large positions at optimal prices while triggering the retail exodus in the opposite direction.</p>
                <p>CRT teaches you to read these engineered moves and position yourself on the right side — entering after the stop hunt, in the direction of real institutional order flow, with clearly defined risk and a minimum 2:1 reward.</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { icon: "💧", title: "Liquidity is the Target",    body: "Markets don't move randomly. Price is drawn to areas of stop-order concentration above recent highs and below recent lows. CRT maps these zones precisely." },
                { icon: "🕯️",title: "The Key Candle is the Map",  body: "One significant candle defines the entire setup. Its wick high and wick low create the two liquidity levels the algorithm will target in sequence." },
                { icon: "⚡", title: "The Sweep is the Signal",    body: "The stop hunt is not a threat — it's the setup. When price wicks through the key level and snaps back, that is your entry trigger, not a reason to exit." },
                { icon: "🎯", title: "The Range is the Target",    body: "After the sweep, price is drawn to the opposite extreme of the key candle. The full range becomes your TP map: 50% for TP1, full wick for TP2." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 hover:border-white/12 hover:bg-white/[0.04] transition-all">
                  <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/15 flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                  <div>
                    <p className="font-semibold text-white text-sm mb-1">{item.title}</p>
                    <p className="text-xs text-white/45 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6-Step Guide ── */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-12"><div className="w-1 h-6 rounded-full bg-[#00ff88]"/><h2 className="text-2xl font-black text-white">6-Step Execution Guide</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {STEPS.map((s, i) => (
                <div key={i} className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 hover:border-[#00ff88]/20 hover:bg-white/[0.04] transition-all group overflow-hidden">
                  <div className="absolute top-4 right-4 text-6xl font-black text-[#00ff88]/[0.05] select-none group-hover:text-[#00ff88]/[0.09] transition-all pointer-events-none">{s.number}</div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center text-[#00ff88] font-black text-sm flex-shrink-0">{s.number}</div>
                    <span className="text-[10px] font-bold text-[#00ff88] bg-[#00ff88]/10 border border-[#00ff88]/20 px-2.5 py-1 rounded-full">{s.tag}</span>
                  </div>
                  <h3 className="font-bold text-white mb-3 text-sm">{s.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Rules + Mistakes ── */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-12 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 0% 50%, rgba(0,255,136,0.05), transparent 55%)"}}/>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <div className="flex items-center gap-3 mb-7"><div className="w-8 h-8 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/20 flex items-center justify-center">✅</div><h2 className="text-xl font-black text-white">Golden Rules</h2></div>
                  <ul className="space-y-4">
                    {RULES_DO.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <span className="w-5 h-5 rounded-full bg-[#00ff88]/12 border border-[#00ff88]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="#00ff88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-7"><div className="w-8 h-8 rounded-xl bg-[#ff4d6d]/10 border border-[#ff4d6d]/20 flex items-center justify-center">🚫</div><h2 className="text-xl font-black text-white">Common Mistakes</h2></div>
                  <ul className="space-y-4">
                    {RULES_DONT.map((rule, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                        <span className="w-5 h-5 rounded-full bg-[#ff4d6d]/12 border border-[#ff4d6d]/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 3l4 4M7 3l-4 4" stroke="#ff4d6d" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        </span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Triple Confluence Callout ── */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl border border-[#00ff88]/20 bg-[#00ff88]/[0.03] p-8 md:p-10 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 100% 0%, rgba(0,255,136,0.08), transparent 55%)"}}/>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">⚡ Advanced — Triple Confluence</div>
                  <h3 className="text-2xl font-black text-white mb-3">CRT + IFVG + Quarterly Theory</h3>
                  <p className="text-white/55 text-sm leading-relaxed">
                    The highest-probability setup in the AlgoVision system occurs when all three strategies align simultaneously. A CRT sweep fires inside an IFVG zone during the Q3 window of a London or NY session. Community data shows win rates climbing to{" "}
                    <span className="text-[#00ff88] font-bold">91%</span> with average RR of{" "}
                    <span className="text-[#00ff88] font-bold">4.2 : 1</span> on triple confluence setups.
                  </p>
                </div>
                <div className="flex gap-4 flex-shrink-0">
                  {[{label:"CRT",sub:"Sweep trigger",color:"#00ff88"},{label:"IFVG",sub:"Zone precision",color:"#6e40f3"},{label:"QT",sub:"Session timing",color:"#00b4d8"}].map((item)=>(
                    <div key={item.label} className="flex flex-col items-center gap-2 px-5 py-4 rounded-xl border" style={{borderColor:`${item.color}30`,background:`${item.color}0d`}}>
                      <span className="text-xl font-black" style={{color:item.color}}>{item.label}</span>
                      <span className="text-[10px] text-white/40 text-center">{item.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trade Log ── */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3"><div className="w-1 h-6 rounded-full bg-[#00ff88]"/><h2 className="text-2xl font-black text-white">Documented Trade Log</h2></div>
              <span className="flex items-center gap-2 text-xs text-white/35"><span className="w-2 h-2 rounded-full bg-[#00ff88]"/>7 wins · 1 loss · 87.5% strike rate</span>
            </div>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden bg-white/[0.02]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.07]">
                      {["Pair","Dir.","Session","Entry","SL","TP","RR","Result","P&L","Note"].map((h)=>(
                        <th key={h} className="py-3.5 px-4 text-left text-[10px] font-semibold text-white/35 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>{TRADES.map((t,i)=><TradeRow key={i} trade={t}/>)}</tbody>
                </table>
              </div>
            </div>
            <p className="text-xs text-white/20 mt-3 text-center">All trades logged by AlgoVision community members with broker screenshots. Past results do not guarantee future performance.</p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-10"><div className="w-1 h-6 rounded-full bg-[#00ff88]"/><h2 className="text-2xl font-black text-white">CRT — Common Questions</h2></div>
            <div className="space-y-3">{FAQS.map((item,i)=><AccordionItem key={i} item={item}/>)}</div>
            <div className="mt-8 text-center">
              <Link href="/faq" className="inline-flex items-center gap-2 text-sm text-[#00ff88] hover:underline">
                Browse all AlgoVision FAQ
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative z-10 px-6 pb-24">
          <div className="max-w-4xl mx-auto text-center rounded-2xl border border-[#00ff88]/20 bg-[#00ff88]/[0.03] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.12), transparent 65%)"}}/>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">7-Day Free Trial — No Card Required</div>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">Start trading CRT<br />at the institutional level.</h2>
              <p className="text-white/50 mb-10 max-w-xl mx-auto text-sm leading-relaxed">Get full access to the CRT video curriculum, the live alert channels, annotated session breakdowns, and 4,800+ community members who trade alongside you every session.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/join" className="inline-flex items-center justify-center gap-2 bg-[#00ff88] text-black font-bold px-9 py-4 rounded-xl hover:bg-[#00e67a] transition-colors text-sm">
                  Start My Free Trial
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </Link>
                <Link href="/examples" className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-semibold px-9 py-4 rounded-xl hover:border-white/30 hover:text-white transition-colors text-sm">
                  See Live CRT Trades
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="relative z-10 border-t border-white/[0.06] py-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <span className="text-[#00ff88] font-black">Algo</span>
              <span className="text-white font-black">Vision</span>
            </div>
            <p>© {new Date().getFullYear()} AlgoVision. All rights reserved.</p>
            <p className="text-xs text-white/20 max-w-xs text-center md:text-right">Trading involves significant risk. Past results do not guarantee future performance.</p>
          </div>
        </footer>

      </div>
    </>
  );
}
