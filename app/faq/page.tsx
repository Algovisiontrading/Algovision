"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

type CategoryKey =
  | "Getting Started"
  | "Strategies"
  | "Membership"
  | "Technical"
  | "Risk & Results";

interface FAQItem {
  q: string;
  a: string;
  popular?: boolean;
}

interface FAQCategory {
  key: CategoryKey;
  color: string;
  description: string;
  icon: string;
  items: FAQItem[];
}

const CATEGORIES: FAQCategory[] = [
  {
    key: "Getting Started",
    color: "#00ff88",
    description: "New to AlgoVision? Start here.",
    icon: "🚀",
    items: [
      {
        q: "What exactly is AlgoVision?",
        a: "AlgoVision is a professional trading education community built around three institutional-grade strategies: Candle Range Theory (CRT), Inversion Fair Value Gaps (IFVG), and Quarterly Theory (QT). Members get access to a full video curriculum, live trade alerts, daily session breakdowns, and a Discord community of 4,800+ serious traders.",
        popular: true,
      },
      {
        q: "Do I need prior trading experience to join?",
        a: "No prior experience is required. AlgoVision is structured for all levels — from complete beginners to experienced traders looking to refine their edge. The curriculum begins with foundational market structure concepts before progressing to the three core strategies. Members who dedicate 2-3 hours per week see results fastest.",
      },
      {
        q: "What markets can I trade with these strategies?",
        a: "CRT, IFVG, and QT are strategy frameworks rooted in market structure and liquidity — they work across any liquid market. Most AlgoVision members trade Forex pairs (EUR/USD, GBP/USD, GBP/JPY), indices (NAS100, SPX, US30), and commodities (XAU/USD). Crypto traders also apply the strategies successfully on BTC and ETH.",
      },
      {
        q: "How long before I can trade the strategies independently?",
        a: "Most members are trading the basic CRT setups with confidence within 3-4 weeks of joining. Full proficiency across all three strategies typically takes 2-3 months of active engagement. We always recommend demo trading until you are consistently profitable over at least 30 sessions.",
        popular: true,
      },
      {
        q: "Is AlgoVision a signals service?",
        a: "No. AlgoVision is an education-first community, not a signals service. While we share live setups and trade ideas in our alert channels, the primary goal is to teach you to identify and execute setups independently. We want you to understand the why behind every entry, not just copy trades blindly.",
      },
      {
        q: "What time zones are the live sessions in?",
        a: "AlgoVision's live breakdowns focus on the London Open (02:00-05:00 EST) and New York Open (09:30-12:30 EST) sessions. Recordings are always posted within 30 minutes of session end for members in other time zones.",
      },
    ],
  },
  {
    key: "Strategies",
    color: "#6e40f3",
    description: "Deep dives into CRT, IFVG & Quarterly Theory.",
    icon: "📈",
    items: [
      {
        q: "What is Candle Range Theory (CRT)?",
        a: "CRT is a precision entry methodology that exploits the market's tendency to sweep the prior candle's high or low before reversing. A key candle is identified on the higher time frame (1H/4H), and the strategy targets a re-entry after a wick sweep and rejection. CRT excels in trending markets where liquidity rests above or below recent swing points.",
        popular: true,
      },
      {
        q: "What is an Inversion Fair Value Gap (IFVG)?",
        a: "A Fair Value Gap (FVG) is a three-candle imbalance where price moves so aggressively that it leaves an uncovered gap between candles 1 and 3. An Inversion FVG occurs when price fully overlaps and closes through a prior FVG in the opposite direction, converting a former support zone into resistance (or vice versa). These inverted zones are extremely high-probability re-test entries.",
        popular: true,
      },
      {
        q: "What is Quarterly Theory (QT)?",
        a: "Quarterly Theory divides each trading session into four equal time segments: Q1 (Accumulation), Q2 (Manipulation / stop hunt), Q3 (Distribution / entry), and Q4 (Continuation or Reversal). By understanding which quarter you are in, you avoid fading the manipulation move and instead enter with institutional flow during Q3.",
        popular: true,
      },
      {
        q: "Which strategy should I learn first?",
        a: "We recommend starting with CRT. It is the most visually intuitive of the three — you can literally see the sweep and rejection on a clean chart with no indicators. Once you have CRT down, IFVG complements it perfectly as a precise entry filter. QT is layered on top as a session-timing framework.",
      },
      {
        q: "Do these strategies use indicators?",
        a: "No. All three strategies are pure price-action methods. You need nothing beyond a clean candlestick chart and horizontal levels. AlgoVision's approach is anti-indicator by design — indicators are lagging and mask the liquidity dynamics that make these setups work.",
      },
      {
        q: "Can I combine CRT, IFVG, and QT in the same trade?",
        a: "Absolutely — and this is where AlgoVision's system becomes exceptionally powerful. The Triple Confluence setup occurs when a CRT sweep happens inside an IFVG zone during the Q3 window of a session. When all three align, win rates and average risk/reward both improve significantly. This is covered in the Advanced Modules.",
      },
      {
        q: "What time frames do the strategies work on?",
        a: "The HTF context (daily, 4H, 1H) provides the directional bias and identifies key levels. Entries are executed on LTF (15m, 5m, sometimes 1m for scalp entries). The multi-timeframe framework is core to AlgoVision's approach — never trade a LTF setup that contradicts the HTF bias.",
      },
      {
        q: "What is a realistic win rate with these strategies?",
        a: "Community-logged data across 1,200+ documented trades shows a 79-83% win rate on high-confluence setups (all three criteria met). Isolated single-strategy setups run 65-72%. Win rate alone is not a useful metric — a 60% win rate with a 3:1 RR is far more profitable than an 80% win rate at 1:1.",
      },
    ],
  },
  {
    key: "Membership",
    color: "#ffbe0b",
    description: "Plans, pricing, billing, and cancellation.",
    icon: "💳",
    items: [
      {
        q: "What membership tiers does AlgoVision offer?",
        a: "AlgoVision offers three tiers: Core (full curriculum + community access), Pro (Core + live alert channels + weekly Q&A calls), and Elite (Pro + 1-on-1 mentorship sessions + prop firm roadmap coaching). All tiers include the full video library for CRT, IFVG, and QT.",
        popular: true,
      },
      {
        q: "Is there a free trial?",
        a: "Yes. All new members get a 7-day free trial on the Core and Pro tiers with no credit card required. Elite tier trials are available on application. If you cancel within 7 days, you are never charged — no questions asked.",
        popular: true,
      },
      {
        q: "Can I switch between plans?",
        a: "Yes, you can upgrade or downgrade at any time from your account dashboard. Upgrades take effect immediately with prorated billing. Downgrades take effect at the start of your next billing cycle — you retain higher-tier access until then.",
      },
      {
        q: "Is there a refund policy?",
        a: "We offer a 14-day money-back guarantee on all first-time subscriptions. If you are not satisfied for any reason within 14 days of your first payment, contact support and we will issue a full refund with no hoops and no forms. After 14 days, subscriptions are non-refundable but you retain access until the end of the billing period.",
      },
      {
        q: "Do you offer annual billing?",
        a: "Yes. Annual billing is available on all tiers at a 30% discount compared to monthly billing. Annual subscribers also receive two bonus 1-on-1 strategy review sessions regardless of tier.",
      },
      {
        q: "Is there a student or group discount?",
        a: "We offer group rates for trading desks or prop firms onboarding 5+ members. Reach out to our support team directly for group pricing. Student discounts are not currently available but are on our roadmap.",
      },
    ],
  },
  {
    key: "Technical",
    color: "#00b4d8",
    description: "Platform access, tools, and compatibility.",
    icon: "⚙️",
    items: [
      {
        q: "Where does AlgoVision content live?",
        a: "All structured course content (video modules, PDF guides, exercise files) is hosted on our private member portal at app.algovision.io. The live community, trade alerts, and Q&A sessions take place in our private Discord server. Both are accessible immediately after joining.",
      },
      {
        q: "What trading platform do I need?",
        a: "AlgoVision's strategies are platform-agnostic. All you need is a charting platform that shows candlestick charts. Most members use TradingView (free plan is sufficient), MetaTrader 4/5, or cTrader. We provide TradingView chart templates you can import instantly.",
        popular: true,
      },
      {
        q: "Are there any AlgoVision custom indicators?",
        a: "Yes. Pro and Elite members get access to AlgoVision's proprietary Pine Script indicator suite for TradingView — including the CRT Range Detector, IFVG Scanner, and QT Session Quarters overlay. These are quality-of-life tools only; the strategies are designed to be traded without any indicators.",
      },
      {
        q: "Is there a mobile app?",
        a: "There is no standalone AlgoVision mobile app. However, the member portal is fully responsive and works in mobile browsers. The Discord community is fully accessible via the Discord mobile app. Chart alerts can be pushed to your phone via TradingView's mobile app.",
      },
      {
        q: "Can I download the course videos?",
        a: "Videos are streamed through the member portal and cannot be downloaded for offline use. All videos are available 24/7 with no streaming limits. Transcripts and PDF summaries are downloadable for every module.",
      },
      {
        q: "How do I access the Discord after joining?",
        a: "After completing checkout, you will receive a welcome email containing a unique Discord invite link. Click the link while logged into your Discord account, accept the invite, and our onboarding bot will automatically assign your member role. The process takes under 60 seconds. If you do not receive the email within 5 minutes, check your spam folder or contact support.",
      },
    ],
  },
  {
    key: "Risk & Results",
    color: "#ff4d6d",
    description: "Risk management, expectations, and disclosures.",
    icon: "🛡️",
    items: [
      {
        q: "Is trading forex and futures risky?",
        a: "Yes. Trading leveraged financial instruments including forex, indices, and futures involves a significant risk of loss and is not suitable for all investors. You should never trade with money you cannot afford to lose entirely. AlgoVision's education and community are designed to help you manage risk intelligently — they do not eliminate it.",
        popular: true,
      },
      {
        q: "Are the community P&L results verified?",
        a: "Community-posted results in our #trade-log Discord channel are self-reported with required screenshot evidence (broker statement or trade confirmation). Moderators verify that the stated result matches the screenshot. However, we cannot independently verify the authenticity of broker screenshots or confirm members followed proper risk management on unreported trades.",
      },
      {
        q: "What risk management rules does AlgoVision recommend?",
        a: "AlgoVision's universal risk rules are: never risk more than 1-2% of your account per trade, always define your stop loss before entering, target a minimum 2:1 risk/reward ratio on every setup, and never add to a losing position. These rules are embedded throughout the curriculum and reinforced daily in the community.",
        popular: true,
      },
      {
        q: "Can AlgoVision guarantee I will be profitable?",
        a: "No — and any trading education service that guarantees profitability is making a claim they cannot legally or ethically support. AlgoVision provides strategies, frameworks, and community support that give you a documented statistical edge. Whether you capture that edge depends on your discipline, risk management, and adherence to the system.",
      },
      {
        q: "Is AlgoVision regulated or licensed?",
        a: "AlgoVision is an educational platform and community — not a regulated financial advisory or investment management firm. We do not manage capital, provide personalized investment advice, or hold any financial licenses. All content is for educational purposes only. Always consult a qualified financial professional before making investment decisions.",
      },
      {
        q: "Should I use a prop firm or my own capital?",
        a: "Both paths are viable and well-supported within AlgoVision. Many members pursue prop firm funding (FTMO, Funded Engineer, etc.) to access larger capital without risking personal savings. Our Elite tier includes a dedicated Prop Firm Roadmap coaching track. We recommend proving your edge on a demo account for a minimum of 60 sessions before going live.",
      },
    ],
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16" height="16" viewBox="0 0 16 16" fill="none"
      className="flex-shrink-0 transition-transform duration-300"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AccordionItem({
  item, accent, isOpen, onToggle,
}: {
  item: FAQItem; accent: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div className={`border rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? "border-white/15 bg-white/[0.04]" : "border-white/[0.07] bg-white/[0.015] hover:border-white/12 hover:bg-white/[0.03]"}`}>
      <button onClick={onToggle} className="w-full flex items-start gap-4 px-6 py-5 text-left group" aria-expanded={isOpen}>
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-2.5 transition-opacity" style={{ background: accent, opacity: isOpen ? 1 : 0.4 }} />
        <div className="flex-1 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`text-sm font-semibold transition-colors ${isOpen ? "text-white" : "text-white/70 group-hover:text-white/90"}`}>
              {item.q}
            </span>
            {item.popular && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ color: accent, background: `${accent}18`, border: `1px solid ${accent}30` }}>
                Popular
              </span>
            )}
          </div>
          <span className="text-white/30 flex-shrink-0 mt-0.5"><ChevronIcon open={isOpen} /></span>
        </div>
      </button>
      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isOpen ? 600 : 0 }}>
        <p className="px-6 pb-6 pl-12 text-sm text-white/55 leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

function CategoryTab({ category, isActive, onClick }: { category: FAQCategory; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left w-full"
      style={isActive ? { color: category.color, background: `${category.color}12`, border: `1px solid ${category.color}25` } : { color: "rgba(255,255,255,0.4)", border: "1px solid transparent" }}
    >
      <span className="text-base leading-none">{category.icon}</span>
      <span>{category.key}</span>
      <span className="ml-auto text-xs rounded-full px-2 py-0.5" style={isActive ? { color: category.color, background: `${category.color}18` } : { color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.05)" }}>
        {category.items.length}
      </span>
    </button>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("Getting Started");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");

  const currentCategory = CATEGORIES.find((c) => c.key === activeCategory)!;
  const toggle = (key: string) => setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  const isSearching = searchQuery.trim().length >= 2;
  const totalQuestions = CATEGORIES.reduce((acc, c) => acc + c.items.length, 0);

  const searchResults = isSearching
    ? CATEGORIES.flatMap((cat) =>
        cat.items
          .filter((item) =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item) => ({ item, category: cat }))
      )
    : [];

  return (
    <>
      <Head>
        <title>FAQ — AlgoVision</title>
        <meta name="description" content="Frequently asked questions about AlgoVision — CRT, IFVG, Quarterly Theory, membership, risk management, and more." />
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
              <Link href="/testimonials" className="hover:text-white transition-colors">Testimonials</Link>
              <Link href="/faq"          className="text-[#00ff88] font-semibold">FAQ</Link>
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
            {totalQuestions} Questions Answered
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-5">
            Everything You Need <span className="text-[#00ff88]">to Know</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            {"Can't find your answer? Join our Discord and ask the community — or reach out to support directly."}
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search all questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#00ff88]/40 focus:bg-white/[0.07] transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white/60 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Search Results */}
        {isSearching && (
          <section className="relative z-10 px-6 pb-16">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm text-white/40 mb-4">
                {searchResults.length === 0 ? "No results found." : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${searchQuery}"`}
              </p>
              <div className="space-y-3">
                {searchResults.map(({ item, category }, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: category.color, background: `${category.color}18`, border: `1px solid ${category.color}30` }}>
                        {category.key}
                      </span>
                    </div>
                    <AccordionItem item={item} accent={category.color} isOpen={!!openItems[`search-${i}`]} onToggle={() => toggle(`search-${i}`)} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main FAQ */}
        {!isSearching && (
          <section className="relative z-10 px-6 pb-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

              {/* Sidebar */}
              <aside className="lg:w-64 flex-shrink-0">
                <div className="lg:sticky lg:top-8 space-y-2">
                  <p className="text-xs font-semibold text-white/25 uppercase tracking-widest px-4 mb-3">Categories</p>
                  {CATEGORIES.map((cat) => (
                    <CategoryTab key={cat.key} category={cat} isActive={activeCategory === cat.key} onClick={() => setActiveCategory(cat.key)} />
                  ))}
                  <div className="mt-8 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">
                    <div className="w-10 h-10 rounded-xl bg-[#00ff88]/10 flex items-center justify-center mb-3 text-xl">💬</div>
                    <p className="text-sm font-semibold text-white mb-1">Still have questions?</p>
                    <p className="text-xs text-white/40 mb-4 leading-relaxed">Our team typically responds within 2 hours on Discord.</p>
                    <Link href="/join" className="block text-center text-xs font-bold text-[#00ff88] border border-[#00ff88]/25 py-2 rounded-lg hover:bg-[#00ff88]/10 transition-colors">
                      Join Discord →
                    </Link>
                  </div>
                </div>
              </aside>

              {/* Accordion */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: `${currentCategory.color}15`, border: `1px solid ${currentCategory.color}25` }}>
                    {currentCategory.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">{currentCategory.key}</h2>
                    <p className="text-sm text-white/40 mt-0.5">{currentCategory.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {currentCategory.items.map((item, i) => {
                    const key = `${activeCategory}-${i}`;
                    return <AccordionItem key={key} item={item} accent={currentCategory.color} isOpen={!!openItems[key]} onToggle={() => toggle(key)} />;
                  })}
                </div>

                {/* Cross-category nav */}
                <div className="mt-12 grid grid-cols-2 gap-4">
                  {CATEGORIES.filter((c) => c.key !== activeCategory).slice(0, 4).map((cat) => (
                    <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all text-left group">
                      <span className="text-lg">{cat.icon}</span>
                      <div>
                        <p className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{cat.key}</p>
                        <p className="text-[11px] text-white/30">{cat.items.length} questions</p>
                      </div>
                      <svg className="ml-auto w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="relative z-10 px-6 pb-24">
          <div className="max-w-4xl mx-auto text-center rounded-2xl border border-[#00ff88]/20 bg-[#00ff88]/[0.03] p-12 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,136,0.10), transparent 70%)" }} />
            <h2 className="relative z-10 text-3xl md:text-4xl font-black text-white mb-4">Ready to join AlgoVision?</h2>
            <p className="relative z-10 text-white/50 mb-8 max-w-xl mx-auto">Start your 7-day free trial today. No credit card required. Cancel any time.</p>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="inline-flex items-center justify-center gap-2 bg-[#00ff88] text-black font-bold px-8 py-4 rounded-xl hover:bg-[#00e67a] transition-colors text-sm">
                Start Free Trial
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link href="/testimonials" className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 font-semibold px-8 py-4 rounded-xl hover:border-white/30 hover:text-white transition-colors text-sm">
                Read Member Stories
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
