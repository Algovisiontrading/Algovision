"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050806] text-[#f3f3f3] font-inter flex flex-col">

      {/* ========================= */}
      {/*        NAVBAR             */}
      {/* ========================= */}{/* NAVBAR */}
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

          <Link
            href="https://whop.com/algo-vision-trading/algovision-pro/"
            className="hidden md:inline-flex items-center gap-2 bg-[#00ff88] text-black text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-[#00e67a] transition-colors"
          >
            Join AlgoVision
          </Link>

        </div>
      </header>

      {/* ========================= */}
      {/*       MOBILE MENU         */}
      {/* ========================= */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#050806]/95 flex flex-col p-8 gap-6">
          <button className="self-end text-white text-2xl" onClick={() => setMenuOpen(false)}>✕</button>

          <Link href="/crt" className="text-lg text-white" onClick={() => setMenuOpen(false)}>CRT Playbook</Link>
          <Link href="/ifvg" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>IFVG</Link>
          <Link href="/qt" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Quarterly Theory</Link>
          <Link href="/examples" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Examples</Link>
          <Link href="/testimonials" className="text-lg text-[#f3f3f3]/70 hover:text-white" onClick={() => setMenuOpen(false)}>Testimonials</Link>

          <button className="w-full py-3 rounded-full bg-green-500 text-black font-bold mt-4">
            Get Access
          </button>
        </div>
      )}

      {/* ========================= */}
      {/*          HERO             */}
      {/* ========================= */}
      <section className="text-center py-32 relative">

        {/* GREEN GLOW */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-green-500/10 blur-[180px] rounded-full pointer-events-none" />

        <h1 className="text-6xl font-extrabold leading-tight relative z-10">
          Trade Smarter with <span className="text-green-500">AlgoVision</span>
        </h1>

        <p className="max-w-xl mx-auto mt-6 text-lg opacity-70 leading-relaxed relative z-10">
          AI‑driven trading systems engineered for precision, backtesting, and institutional‑grade execution.
        </p>

        <div className="mt-10 relative z-10 flex justify-center gap-4">
          <Link href="https://whop.com/algo-vision-trading/algovision-pro/">
            <button className="px-8 py-4 bg-green-500 text-black font-bold rounded-xl text-lg">
              Get Started
            </button>
          </Link>


        </div>
      </section>

      {/* ========================= */}
      {/*     WHY ALGOVISION        */}
      {/* ========================= */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Why AlgoVision?</h2>

        <p className="max-w-2xl mx-auto opacity-70 text-lg leading-relaxed">
          Because retail traders deserve institutional‑grade tools. AlgoVision gives you clarity, structure, and confidence — without the noise.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            ["Precision Models", "Built on institutional AMD models, liquidity, market structure, displacement logic, and smart‑money execution frameworks."],
            ["Institutional Logic", "Frameworks used by professionals worldwide."],
            ["Execution Clarity", "Know exactly when and why you're entering."]
          ].map(([title, desc], i) => (
            <div key={i} className="p-6 border border-white/10 rounded-xl bg-white/5">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="opacity-60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================= */}
      {/*   TRUSTED BY EXCHANGES    */}
      {/* ========================= */}
      <section className="py-20 px-6 text-center bg-white/5 border-y border-white/10 relative overflow-hidden">

        <h2 className="text-4xl font-bold mb-4">Trusted by Leading Exchanges</h2>

        <p className="max-w-2xl mx-auto opacity-70 text-lg leading-relaxed mb-12">
          AlgoVision is partnered with top global exchanges and trading platforms — ensuring institutional‑grade reliability, execution, and market alignment.
        </p>

        {/* MARQUEE */}
        <div className="flex gap-16 whitespace-nowrap animate-[scrollRow_18s_linear_infinite]">
          {["mexc", "phemex", "bingx", "kcex", "blofin"].map((name, i) => (
            <div key={i} className="inline-flex items-center justify-center w-44 h-20">
              <img src={`/images/${name}.png`} alt={name} className="w-full h-auto opacity-90 object-contain" />
            </div>
          ))}
        </div>

        <style>{`
          @keyframes scrollRow {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </section>

      {/* ========================= */}
      {/*         PRICING           */}
      {/* ========================= */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>

        <p className="opacity-70 text-lg mb-12">Choose the plan that fits your trading journey.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* MONTHLY */}
          <div className="p-10 rounded-xl bg-white/5 border border-white/10">
            <p className="opacity-70">Monthly Access</p>
            <p className="text-5xl font-extrabold my-2">$49.99</p>
            <p className="opacity-70 mb-6">Billed Monthly</p>

            <ul className="opacity-70 text-sm leading-relaxed space-y-2 mb-8">
              <li>Full platform access</li>
              <li>All indicators included</li>
              <li>Premium Discord access</li>
              <li>All updates included</li>
            </ul>

            <Link href="https://whop.com/algo-vision-trading/algovision-pro/">
              <button className="w-full py-4 bg-green-500 text-black font-bold rounded-xl text-lg">
                Subscribe Monthly
              </button>
            </Link>

          </div>

          {/* LIFETIME */}
          <div className="p-10 rounded-xl bg-white/5 border border-white/10">
            <p className="opacity-70">One‑Time Payment</p>
            <p className="text-6xl font-extrabold my-2">$500</p>
            <p className="opacity-70 mb-6">Lifetime Access</p>

            <ul className="opacity-70 text-sm leading-relaxed space-y-2 mb-8">
              <li>Free updates and additions</li>
              <li>All future indicators included</li>
              <li>PDF files, trading models, and documentation</li>
              <li>Premium Discord access</li>
              <li>Institutional‑grade frameworks and tools</li>
            </ul>

            <Link href="https://whop.com/algo-vision-trading/algovision-pro/">
              <button className="w-full py-4 bg-green-500 text-black font-bold rounded-xl text-lg">
                Purchase Lifetime
              </button>
            </Link>

          </div>
        </div>
      </section>

      {/* ========================= */}
      {/*          FOOTER           */}
      {/* ========================= */}
      <footer className="py-10 text-center opacity-50 text-sm border-t border-white/10">
        © 2024 AlgoVision. All rights reserved.
      </footer>
    </main>
  );
}
