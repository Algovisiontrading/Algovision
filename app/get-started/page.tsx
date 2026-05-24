"use client";

import Link from "next/link";
import { useState } from "react";


export default function GetStartedPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#05060A] text-slate-100">

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





      {/* Hero */}
      <section className="border-b border-white/5 bg-gradient-to-b from-black to-[#05060A]">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 lg:flex-row lg:items-center lg:py-20">
          <div className="flex-1 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300/80">
              Regime-aware market clarity
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
              Trade with{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                structure, signals
              </span>{" "}
              and confidence in any market.
            </h1>
            <p className="max-w-xl text-sm text-slate-300">
              AlgoVision blends higher‑timeframe structure, intraday precision, and liquidity mapping
              into one clean view—so you always know the bias, the level, and the invalidation.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="#pricing"
                className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-black shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-300"
              >
                Start now
              </Link>
              <a
                href="#demo"
                className="text-sm text-slate-300 hover:text-slate-100"
              >
                Watch how it works →
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span>• Regime‑aware bias</span>
              <span>• Entry Models</span>
              <span>• Liquidity map overlays</span>
              <span>• Performance tracking</span>
            </div>
          </div>

          {/* Visual mockup (REPLACED WITH IFVG IMAGE) */}
          <div id="demo" className="flex-1">
            <img
              src="/images/bullish-ifvg-flip.png"
              alt="Bullish IFVG flip example"
              className="mx-auto rounded-2xl border border-white/10 shadow-2xl shadow-emerald-500/30"
            />
            <p className="mt-3 text-center text-[11px] text-slate-500">
              Bullish IFVG flip example — bearish imbalance invalidated, retest, and expansion.
            </p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-b border-white/5 bg-[#05060A]" id="why">
        <div className="mx-auto max-w-6xl px-4 py-14 space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-semibold text-slate-50">
              What you get with AlgoVision
            </h2>
            <p className="text-sm text-slate-300">
              Not another noisy indicator. AlgoVision is a structured decision layer that sits on top
              of your charts and tells you: trend, context, and opportunity.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 text-sm">
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                01 • Structure engine
              </p>
              <p className="mt-2 text-slate-100">
                Blended 1H + 15m structure so you always know the dominant trend and intraday bias.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                02 • Entry Models
              </p>
              <p className="mt-2 text-slate-100">
                High‑probability entry zones with clear invalidation and session‑aware timing.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                03 • Liquidity map
              </p>
              <p className="mt-2 text-slate-100">
                Swing‑based liquidity detection so you see where price is likely to reach next.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
                04 • Performance layer
              </p>
              <p className="mt-2 text-slate-100">
                Track sessions, R‑multiple, and execution quality to refine your edge over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-b border-white/5 bg-gradient-to-b from-[#05060A] to-black" id="pricing">
        <div className="mx-auto max-w-6xl px-4 py-14 space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-semibold text-slate-50">
              Choose your access level
            </h2>
            <p className="text-sm text-slate-300">
              Start small, or go all‑in. All plans include the full AlgoVision engine and future
              updates.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 justify-center">


            

            {/* Monthly */}
            <div className="relative flex flex-col rounded-2xl border border-emerald-400/60 bg-gradient-to-b from-emerald-500/10 via-slate-950 to-black p-5 shadow-xl shadow-emerald-500/30">
              <div className="absolute right-4 top-4 rounded-full bg-emerald-400/90 px-2 py-0.5 text-[10px] font-semibold text-black">
                Most popular
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Pro
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-50">$49</p>
              <p className="text-xs text-slate-300">per month</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-200">
                <li>• Premium Discord Access</li>
                <li>• IFVG, CRT, Quarterly Theory</li>
                <li>• Full liquidity map overlays</li>
                <li>• Advanced performance analytics</li>
              </ul>
              <Link
                href="/checkout?plan=pro"
                className="mt-6 rounded-full bg-emerald-400 px-4 py-2 text-center text-xs font-semibold text-black hover:bg-emerald-300"
              >
                Get Pro
              </Link>
            </div>

            {/* Lifetime */}
            <div className="flex flex-col rounded-2xl border border-white/10 bg-slate-950/80 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Lifetime
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-50">$499</p>
              <p className="text-xs text-slate-400">one time</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li>• All Monthly</li>
                <li>• Lifetime updates</li>
                <li>• Priority feature requests</li>
                <li>• Strategy Vault</li>
              </ul>
              <Link
                href="/checkout?plan=lifetime"
                className="mt-6 rounded-full border border-slate-600 px-4 py-2 text-center text-xs font-semibold text-slate-100 hover:border-emerald-400 hover:text-emerald-200"
              >
                Get Lifetime
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-black" id="faq">
        <div className="mx-auto max-w-6xl px-4 py-14 space-y-8">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-semibold text-slate-50">
              Questions, answered
            </h2>
            <p className="text-sm text-slate-300">
              If you’re serious enough to be here, you deserve straight answers.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 text-sm">
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
              <p className="font-medium text-slate-100">
                Is this a bot or auto‑trader?
              </p>
              <p className="mt-2 text-slate-300">
                No. AlgoVision is a decision layer. You stay in control of execution—AlgoVision gives
                you structure, bias, and high‑probability zones.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
              <p className="font-medium text-slate-100">
                Does it repaint?
              </p>
              <p className="mt-2 text-slate-300">
                The logic is built around confirmed structure and session‑aware rules. Signals are
                designed to be stable, not hindsight art.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
              <p className="font-medium text-slate-100">
                What markets does it work on?
              </p>
              <p className="mt-2 text-slate-300">
                FX, indices, and crypto on major liquid pairs and instruments. If your broker feeds
                TradingView, you’re good.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
              <p className="font-medium text-slate-100">
                Is there a refund policy?
              </p>
              <p className="mt-2 text-slate-300">
                No refund policy, we are providing the indicators and resources as soon as you purchase. If you are extremely unhappy with our service
                please reach out via discord
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-sm md:flex-row md:items-center">
            <p className="text-slate-300">
              Ready to stop guessing and start trading with structure?
            </p>
            <Link
              href="/checkout?plan=pro"
              className="rounded-full bg-emerald-400 px-6 py-2 text-xs font-semibold text-black hover:bg-emerald-300"
            >
              Get started with Pro
            </Link>
          </div>
        </div>
      </section>


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
  );
}
 