"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

type CategoryKey = "Getting Started" | "Strategies" | "Membership" | "Technical" | "Risk & Results";

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
      { q: "What exactly is AlgoVision?", a: "AlgoVision is a professional trading education community built around three institutional-grade strategies: Candle Range Theory (CRT), Inversion Fair Value Gaps (IFVG), and Quarterly Theory (QT). Members get access to a full video curriculum, live trade alerts, daily session breakdowns, and a Discord community of 4,800+ serious traders.", popular: true },
      { q: "Do I need prior trading experience to join?", a: "No prior experience is required. AlgoVision is structured for all levels — from complete beginners to experienced traders looking to refine their edge. The curriculum begins with foundational market structure concepts before progressing to the three core strategies. Members who dedicate 2–3 hours per week