"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #050806 0%, #0a1a0f 40%, #0f2d1a 100%)",
        color: "#f3f3f3",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* NAV */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "22px 60px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(5,7,11,0.7)",
          backdropFilter: "blur(6px)",
          alignItems: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: "20px",
            letterSpacing: "0.5px",
          }}
        >
          AlgoVision
        </div>

        {/* NAV LINKS */}
        <div
          style={{
            opacity: 0.8,
            fontSize: "14px",
            display: "flex",
            gap: "28px",
            alignItems: "center",
          }}
        >
          {/* Algorithms Dropdown */}
          <div style={{ position: "relative" }}>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Algorithms ▾
            </span>

            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "22px",
                  left: 0,
                  background: "rgba(10,15,12,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  width: "180px",
                  zIndex: 20,
                }}
              >
                <Link href="/crt" style={{ opacity: 0.8 }}>CRT Playbook</Link>
                <Link href="/ifvg" style={{ opacity: 0.8 }}>IFVG</Link>
                <Link href="/qt" style={{ opacity: 0.8 }}>Quarterly Theory</Link>
              </div>
            )}
          </div>

          <Link href="/examples" style={{ opacity: 0.8 }}>Examples</Link>
          <Link href="/testimonials" style={{ opacity: 0.8 }}>Testimonials</Link>
          <Link href="/faq" style={{ opacity: 0.8 }}>FAQ</Link>
          <span>Login</span>
        </div>
      </div>

      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "140px 20px 120px",
          position: "relative",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "700px",
            background: "rgba(34,197,94,0.08)",
            filter: "blur(180px)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        <h1
          style={{
            fontSize: "64px",
            marginBottom: "20px",
            fontWeight: 800,
            position: "relative",
            zIndex: 1,
            lineHeight: "1.1",
          }}
        >
          Trade Smarter with{" "}
          <span style={{ color: "#22c55e" }}>AlgoVision</span>
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            opacity: 0.7,
            fontSize: "20px",
            lineHeight: "1.6",
            position: "relative",
            zIndex: 1,
          }}
        >
          AI‑driven trading systems engineered for precision, backtesting, and
          institutional‑grade execution.
        </p>

        <div style={{ marginTop: "45px", position: "relative", zIndex: 1 }}>
          <Link href="/dashboard">
            <button
              style={{
                padding: "16px 30px",
                background: "#22c55e",
                border: "none",
                borderRadius: "12px",
                color: "black",
                fontWeight: 700,
                cursor: "pointer",
                marginRight: "12px",
                fontSize: "16px",
              }}
            >
              Get Started
            </button>
          </Link>

          <Link href="/dashboard">
            <button
              style={{
                padding: "16px 30px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              View Platform
            </button>
          </Link>
        </div>
      </section>

      {/* WHY ALGOVISION */}
      <section
        style={{
          padding: "80px 50px",
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          Why AlgoVision?
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            opacity: 0.7,
            fontSize: "18px",
            lineHeight: "1.6",
          }}
        >
          Because retail traders deserve institutional‑grade tools. AlgoVision
          gives you clarity, structure, and confidence — without the noise.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginTop: "50px",
          }}
        >
          {[
            [
              "Precision Models",
              "Built on institutional AMD models, liquidity, market structure, displacement logic, and smart‑money execution frameworks.",
            ],
            ["Institutional Logic", "Frameworks used by professionals worldwide."],
            ["Execution Clarity", "Know exactly when and why you're entering."],
          ].map(([title, desc], i) => (
            <div
              key={i}
              style={{
                padding: "26px",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  marginBottom: "8px",
                  fontWeight: 600,
                }}
              >
                {title}
              </h3>
              <p style={{ opacity: 0.6, fontSize: "15px", lineHeight: "1.5" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED BY EXCHANGES */}
<section
  style={{
    padding: "80px 50px",
    background: "rgba(12,20,16,0.55)",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    textAlign: "center",
    overflow: "hidden",
    position: "relative",
  }}
>
  <h2
    style={{
      fontSize: "42px",
      fontWeight: 700,
      marginBottom: "20px",
    }}
  >
    Trusted by Leading Exchanges
  </h2>

  <p
    style={{
      opacity: 0.7,
      fontSize: "18px",
      marginBottom: "50px",
      maxWidth: "700px",
      marginLeft: "auto",
      marginRight: "auto",
      lineHeight: "1.6",
    }}
  >
    AlgoVision is partnered with top global exchanges and trading platforms —
    ensuring institutional‑grade reliability, execution, and market alignment.
  </p>

  {/* MARQUEE */}
  <div
    style={{
      display: "flex",
      gap: "40px",
      whiteSpace: "nowrap",
      animation: "scrollRow 18s linear infinite",
    }}
  >
    {[
      "/images/mexc.png",
      "/images/phemex.png",
      "/images/bingx.png",
      "/images/kcex.png",
      "/images/blofin.png",
    ].map((src, i) => (
      <div
        key={i}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "180px",
          height: "80px",
        }}
      >
        <img
          src={src}
          alt="partner"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain",
            opacity: 0.9,
          }}
        />
      </div>
    ))}
  </div>

  <style>
    {`
      @keyframes scrollRow {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `}
  </style>
</section>

      {/* PRICING */}
      <section
        style={{
          padding: "100px 20px",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            fontWeight: 700,
            marginBottom: "20px",
          }}
        >
          Simple, Transparent Pricing
        </h2>

        <p
          style={{
            opacity: 0.7,
            fontSize: "18px",
            marginBottom: "50px",
          }}
        >
          Choose the plan that fits your trading journey.
        </p>

        {/* TWO-COLUMN PRICING */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {/* MONTHLY PLAN */}
          <div
            style={{
              padding: "40px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ opacity: 0.7 }}>Monthly Access</p>
            <p
              style={{
                fontSize: "48px",
                fontWeight: 800,
                margin: "10px 0",
              }}
            >
              $49.99
            </p>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>Billed Monthly</p>

            <ul
              style={{
                opacity: 0.7,
                fontSize: "16px",
                lineHeight: "1.6",
                listStyle: "none",
                padding: 0,
                marginBottom: "30px",
              }}
            >
              <li>Full platform access</li>
              <li>All indicators included</li>
              <li>Premium Discord access</li>
              <li>All updates included</li>
            </ul>

            <button
              style={{
                padding: "16px 30px",
                background: "#22c55e",
                border: "none",
                borderRadius: "12px",
                color: "black",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "18px",
                width: "100%",
              }}
            >
              Subscribe Monthly
            </button>
          </div>

          {/* LIFETIME PLAN */}
          <div
            style={{
              padding: "40px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p style={{ opacity: 0.7 }}>One‑Time Payment</p>
            <p
              style={{
                fontSize: "56px",
                fontWeight: 800,
                margin: "10px 0",
              }}
            >
              $500
            </p>
            <p style={{ opacity: 0.7, marginBottom: "20px" }}>Lifetime Access</p>

            <ul
              style={{
                opacity: 0.7,
                fontSize: "16px",
                lineHeight: "1.6",
                listStyle: "none",
                padding: 0,
                marginBottom: "30px",
              }}
            >
              <li>Free updates and additions</li>
              <li>All future indicators included</li>
              <li>PDF files, trading models, and documentation</li>
              <li>Premium Discord access</li>
              <li>Institutional‑grade frameworks and tools</li>
            </ul>

            <button
              style={{
                padding: "16px 30px",
                background: "#22c55e",
                border: "none",
                borderRadius: "12px",
                color: "black",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "18px",
                width: "100%",
              }}
            >
              Purchase Lifetime
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          padding: "40px 20px",
          textAlign: "center",
          opacity: 0.5,
          fontSize: "14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        © 2024 AlgoVision. All rights reserved.
      </footer>
    </main>
  );
}
