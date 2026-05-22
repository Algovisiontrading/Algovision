"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

type Filter = "All" | "CRT" | "IFVG" | "QT" | "Mindset";

interface Testimonial {
  id: number;
  name: string;
  handle: string;
  avatar: string;
  role: string;
  strategy: Filter;
  stars: number;
  quote: string;
  result: string;
  resultLabel: string;
  verified: boolean;
  featured: boolean;
  platform: "Twitter" | "Discord" | "Telegram";
}

const STRATEGY_COLORS: Record<string, string> = {
  CRT: "#00ff88", IFVG: "#6e40f3", QT: "#00b4d8", Mindset: "#ffbe0b",
};

const TESTIMONIALS: Testimonial[] = [
  { id: 1,  name: "Marcus D.",   handle: "@marcus_fx",      avatar: "MD", role: "Full-Time Trader · 2 yrs",  strategy: "CRT",     stars: 5, quote: "AlgoVision completely changed how I read candles. The CRT breakdowns are incredibly detailed — I finally understand WHY price sweeps before reversing. Went from breakeven to consistently profitable in 6 weeks.",                                result: "+$8,400",       resultLabel: "First 60 Days",       verified: true, featured: true,  platform: "Discord"  },
  { id: 2,  name: "Sofia R.",    handle: "@sofiatrades_",   avatar: "SR", role: "Prop Trader · 3 yrs",        strategy: "IFVG",    stars: 5, quote: "The IFVG module alone is worth 10x the subscription price. I passed two FTMO challenges using the inversion gap entry method. The precision is unreal — my stop losses are tighter than they've ever been.",                   result: "2x FTMO Passed",resultLabel: "Challenge Results",   verified: true, featured: true,  platform: "Twitter"  },
  { id: 3,  name: "Jordan T.",   handle: "@JTmarkets",      avatar: "JT", role: "Part-Time Trader · 1 yr",   strategy: "QT",      stars: 5, quote: "Quarterly Theory was the missing piece I'd been searching for three years. Knowing exactly which session quarter to trade — and which to sit out — slashed my loss rate almost overnight.",                                           result: "−62% Drawdown", resultLabel: "Max DD Reduction",    verified: true, featured: true,  platform: "Discord"  },
  { id: 4,  name: "Priya N.",    handle: "@priya_pips",     avatar: "PN", role: "Swing Trader · 4 yrs",       strategy: "CRT",     stars: 5, quote: "I trade XAU/USD exclusively and CRT is a natural fit for gold's sweeping moves. The live call channel alerts me before key levels — I've caught 11 winning trades in the last month alone.",                                result: "11/13 Wins",    resultLabel: "Last 30 Days",        verified: true, featured: false, platform: "Telegram" },
  { id: 5,  name: "Alex W.",     handle: "@AlexWFX",        avatar: "AW", role: "Day Trader · 2 yrs",         strategy: "IFVG",    stars: 5, quote: "The community here is elite. Everyone is serious about growth. The IFVG setups are shared live and explained step by step. I've learned more in 3 months here than in 2 years of YouTube.",                                    result: "3 : 1+ RR",     resultLabel: "Avg on IFVG Trades",  verified: true, featured: false, platform: "Discord"  },
  { id: 6,  name: "Carmen L.",   handle: "@carmenltrades",  avatar: "CL", role: "Futures Trader · 5 yrs",     strategy: "QT",      stars: 5, quote: "Trading NQ using QT's session-quarter model is almost unfair. The Q2 manipulation is so predictable once you know what to look for. My accuracy on Q3 entries is over 78% this quarter.",                                   result: "78% Q3 Accuracy",resultLabel: "NQ Session Trades",  verified: true, featured: false, platform: "Twitter"  },
  { id: 7,  name: "Daniel F.",   handle: "@danfolio_fx",    avatar: "DF", role: "Student Trader · 8 months",  strategy: "Mindset", stars: 5, quote: "What sets AlgoVision apart is the mindset training. The weekly accountability sessions keep me disciplined. I went from over-trading 15 times a day to 2–3 high-quality setups. Life changing.",                                result: "15→3 Daily Trades",resultLabel: "Discipline Shift",  verified: true, featured: false, platform: "Discord"  },
  { id: 8,  name: "Aisha M.",    handle: "@aisha_pips",     avatar: "AM", role: "Funded Trader · 1.5 yrs",    strategy: "CRT",     stars: 5, quote: "I was skeptical — I've tried many courses. But the CRT live breakdowns inside the Discord are next-level. You actually watch the reasoning happen in real time. Funded on my first attempt at $100K.",              result: "$100K Funded",  resultLabel: "First Attempt",       verified: true, featured: false, platform: "Telegram" },
  { id: 9,  name: "Ryan K.",     handle: "@ryankfx",        avatar: "RK", role: "Scalper · 3 yrs",            strategy: "IFVG",    stars: 5, quote: "Scalping IFVGs on the 1-minute chart with the 15-minute confirmation model is my bread and butter now. The setups are clean, the risk is defined, and the rewards are consistent. Zero regrets joining.",              result: "+22% Account",  resultLabel: "In 45 Days",          verified: true, featured: false, platform: "Twitter"  },
];

const FILTERS: Filter[] = ["All", "CRT", "IFVG", "QT", "Mindset"];

const STATS = [
  { value: "4,800+",  label: "Active Members",     sub: "across all tiers"      },
  { value: "83%",     label: "Reported Win Rate",   sub: "on tracked setups"     },
  { value: "$2.1M+",  label: "Community P&L",       sub: "logged in Discord"     },
  { value: "3.4 : 1", label: "Average Risk/Reward", sub: "across all strategies" },
];

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < stars ? "#ffbe0b" : "#ffffff20"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, featured = false }: { t: Testimonial; featured?: boolean }) {
  const color = STRATEGY_COLORS[t.strategy] ?? "#00ff88";
  return (
    <div className={`relative rounded-2xl border p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-1 ${featured ? "border-white/15 bg-white/[0.05]" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]"}`}>
      {featured && <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: `radial-gradient(ellipse at 30% 0%, ${color}10, transparent 60%)` }} />}
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background: `${color}22`, color, border: `2px solid ${color}44` }}>
            {t.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{t.name}</span>
              {t.verified && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-xs text-white/40">{t.handle} · {t.platform}</span>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 mt-1" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
          {t.strategy}
        </span>
      </div>
      <StarRating stars={t.stars} />
      <blockquote className="text-white/65 text-sm leading-relaxed relative">
        <span className="absolute -top-2 -left-1 text-3xl text-white/10 font-serif leading-none select-none">&ldquo;</span>
        <span className="relative z-10">{t.quote}</span>
      </blockquote>
      <div className="flex items-center gap-3 rounded-xl p-3 mt-auto" style={{ background: `${color}0d`, border: `1px solid ${color}22` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}22` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
          </svg>
        </div>
        <div>
          <p className="font-black text-sm" style={{ color }}>{t.result}</p>
          <p className="text-xs text-white/35">{t.resultLabel}</p>
        </div>
        <div className="ml-auto text-xs text-white/25">{t.role}</div>
      </div>
    </div>
  );
}

export default function TestimonialsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const featured = TESTIMONIALS.filter((t) => t.featured);
  const allFiltered = activeFilter === "All" ? TESTIMONIALS : TESTIMONIALS.filter((t) => t.strategy === activeFilter);

  return (
    <>
      <Head>
        <title>Testimonials — AlgoVision</title>
        <meta name="description" content="Real results from AlgoVision members — traders who mastered CRT, IFVG, and Quarterly Theory." />
      </Head>

      <div className="min-h-screen bg-[#030508] text-white overflow-x-hidden">
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: "linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="fixed inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(0,255,136,0.07) 0%, transparent 70%)" }} />

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
              <Link href="/examples"     className="hover:text-white transition-colors">Examples</Link>
              <Link href="/testimonials" className="text-[#00ff88] font-semibold">Testimonials</Link>
              <Link href="/faq"          className="hover:text-white transition-colors">FAQ</Link>
            </nav>
            <Link href="/join" className="hidden md:inline-flex items-center gap-2 bg-[#00ff88] text-black text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#00e67a] transition-colors">
              Join AlgoVision
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="relative z-10 pt-24 pb-20 text-center px-6">
          <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            Verified Results
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            Traders Who <span className="text-[#00ff88]">Changed Their Game</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
            These aren't paid actors or cherry-picked wins. Every result below is from a real AlgoVision member — documented in our community channels with trade logs attached.
          </p>
        </section>

        {/* Stats Bar */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
              {STATS.map((s) => (
                <div key={s.label} className="bg-[#030508] px-8 py-8 flex flex-col items-center text-center gap-1">
                  <span className="text-3xl md:text-4xl font-black text-[#00ff88]">{s.value}</span>
                  <span className="text-sm font-semibold text-white">{s.label}</span>
                  <span className="text-xs text-white/35">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-6 rounded-full bg-[#00ff88]" />
              <h2 className="text-xl font-bold text-white">Featured Stories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((t) => <TestimonialCard key={t.id} t={t} featured />)}
            </div>
          </div>
        </section>

        {/* Discord proof panel */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8 md:p-12 overflow-hidden relative">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 50%, rgba(0,255,136,0.06), transparent 60%)" }} />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] text-xs font-semibold px-3 py-1 rounded-full mb-4">Community Proof</div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Every win is logged.<br />Every loss is learned from.</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-6">
                    AlgoVision's Discord server has a dedicated <span className="text-white/80 font-semibold">#trade-log</span> channel where members post screenshots of every closed position — wins AND losses.
                  </p>
                  <ul className="space-y-3">
                    {["Trade entry & exit screenshots required", "Moderators verify RR and result accuracy", "Monthly P&L leaderboard with receipts", "Losing trades are analyzed openly, not deleted"].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-white/60">
                        <svg className="w-4 h-4 text-[#00ff88] flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Mock Discord */}
                <div className="flex-shrink-0 w-full md:w-80">
                  <div className="rounded-xl border border-white/10 bg-[#1e1f22] overflow-hidden shadow-2xl">
                    <div className="bg-[#2b2d31] px-4 py-2 flex items-center gap-2 border-b border-black/20">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ed4245]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#faa61a]" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#43b581]" />
                      <span className="text-xs text-white/30 ml-2"># trade-log</span>
                    </div>
                    <div className="p-4 space-y-4">
                      {[
                        { user: "marcus_fx", result: "+$840",   strategy: "CRT",  color: "#00ff88" },
                        { user: "sofia_r",   result: "FTMO ✓",  strategy: "IFVG", color: "#6e40f3" },
                        { user: "jordan_t",  result: "+$1,200", strategy: "QT",   color: "#00b4d8" },
                        { user: "priya_n",   result: "+$720",   strategy: "CRT",  color: "#00ff88" },
                      ].map((msg, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style={{ background: `${msg.color}22`, color: msg.color }}>
                            {msg.user[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-white/80">{msg.user}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold" style={{ color: msg.color, background: `${msg.color}22` }}>{msg.strategy}</span>
                            </div>
                            <div className="bg-[#2b2d31] rounded-lg p-2.5">
                              <div className="h-10 rounded bg-[#1e1f22] mb-2 flex items-center justify-center">
                                <span className="text-xs text-white/20">📸 Trade Screenshot</span>
                              </div>
                              <p className="text-sm font-black" style={{ color: msg.color }}>{msg.result}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filter + Grid */}
        <section className="relative z-10 px-6 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-1 h-6 rounded-full bg-[#00ff88]" />
                <h2 className="text-xl font-bold text-white">All Member Reviews</h2>
                <span className="text-xs text-white/30 bg-white/[0.05] px-2.5 py-1 rounded-full">{allFiltered.length} results</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${activeFilter === f ? "border-[#00ff88] bg-[#00ff88]/15 text-[#00ff88]" : "border-white/10 text-white/40 hover:text-white/70"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {allFiltered.map((t) => (
                <div key={t.id} className="break-inside-avoid">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative z-10 px-6 pb-24">
          <div className="max-w-4xl mx-auto text-center rounded-2xl border border-[#00ff88]/20 bg-[#00ff88]/[0.05] p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.10), transparent 70%)" }} />
            <h2 className="relative z-10 text-3xl md:text-4xl font-black text-white mb-4">Your results could be next.</h2>
            <p className="relative z-10 text-white/50 mb-8 max-w-xl mx-auto">Join 4,800+ traders already trading the AlgoVision system — with live alerts, daily breakdowns, and a community that holds each other accountable.</p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="inline-flex items-center justify-center gap-2 bg-[#00ff88] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#00e67a] transition-colors text-sm">
                Start My Free Trial
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link href="/examples" className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-semibold px-8 py-4 rounded-xl hover:border-white/30 hover:text-white transition-colors text-sm">
                See Live Trade Examples
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
            <p className="text-xs text-white/20 max-w-xs text-center md:text-right">Trading involves significant risk. Past results do not guarantee future performance.</p>
          </div>
        </footer>
      </div>
    </>
  );
}
