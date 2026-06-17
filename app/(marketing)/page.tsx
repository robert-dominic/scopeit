"use client";

import { useState } from "react";
import { ArrowRight, Scissors, Map, Target } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);

  // TODO: When the scope creation UI is built, call the following from "lib/pendo-events":
  // - trackScopeIdeaSubmitted() in the form submission handler after the idea is sent to the AI endpoint
  // - trackScopeGenerated() in the success handler after the Groq AI response is processed
  // - trackScopeExportedPdf() after the @react-pdf/renderer PDF is generated and download triggered

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0]">
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <span className="text-xl font-bold tracking-tight">
          Scope<span className="text-[#2EC4B6]">It</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuthOpen(true)}
            className="hidden md:block text-sm font-medium text-[#0D1B2A] px-5 py-2.5 rounded-lg border border-[#D4CFC7] hover:border-[#0D1B2A] transition-colors duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthOpen(true)}
            className="text-sm font-semibold bg-[#0D1B2A] text-[#FFF8F0] px-5 py-2.5 rounded-lg hover:bg-[#2EC4B6] transition-colors duration-200 flex items-center gap-2"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-[#2EC4B6] uppercase tracking-widest">
                AI Product Scope Engine
              </p>
              <h1 className="text-5xl md:text-6xl font-bold text-[#0D1B2A] leading-[1.05] tracking-tight">
                From chaos<br />
                to <span className="text-[#2EC4B6]">clarity.</span>
              </h1>
              <p className="text-lg text-[#6B7280] leading-relaxed max-w-md">
                Dump your messy product idea in plain English.
                ScopeIt gives you back a structured MVP scope,
                sharp boundaries, and an execution path — in seconds.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setAuthOpen(true)}
                className="inline-flex items-center gap-2 bg-[#2EC4B6] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0D1B2A] transition-colors duration-200"
              >
                Create Your Scope <ArrowRight size={16} />
              </button>
              <button
                onClick={() => setAuthOpen(true)}
                className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-[#0D1B2A] px-6 py-3 rounded-lg border border-[#D4CFC7] hover:border-[#2EC4B6] hover:text-[#2EC4B6] transition-colors duration-200"
              >
                Sign In
              </button>
            </div>

            <p className="text-sm text-[#6B7280]">
              Free to use · No credit card · Built for builders
            </p>
          </div>

          {/* Right — Scout placeholder */}
          <div className="relative flex items-center justify-center">
            <div className="w-full aspect-square max-w-md bg-[#2EC4B6]/8 rounded-3xl border-2 border-dashed border-[#2EC4B6]/30 flex flex-col items-center justify-center gap-4 p-8">
              <div className="flex items-center gap-4 w-full justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#FF6B6B]/15 border border-[#FF6B6B]/30 flex items-center justify-center">
                    <span className="text-2xl">🌀</span>
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium">Messy idea</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-12 h-0.5 bg-[#2EC4B6]" />
                  <ArrowRight size={16} className="text-[#2EC4B6] -mt-2.5 ml-auto" />
                  <span className="text-xs text-[#2EC4B6] font-semibold">Scout</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl bg-[#2EC4B6]/15 border border-[#2EC4B6]/30 flex items-center justify-center">
                    <span className="text-2xl">📋</span>
                  </div>
                  <span className="text-xs text-[#6B7280] font-medium">Clear scope</span>
                </div>
              </div>

              <div className="w-full bg-white rounded-2xl border border-[#D4CFC7] p-4 space-y-3 shadow-sm">
                <div className="h-3 bg-[#0D1B2A] rounded-full w-2/3" />
                <div className="h-2 bg-[#E8E4DC] rounded-full w-full" />
                <div className="h-2 bg-[#E8E4DC] rounded-full w-4/5" />
                <div className="flex gap-2 pt-1">
                  <div className="flex-1 h-8 bg-[#2EC4B6]/15 rounded-lg border border-[#2EC4B6]/20" />
                  <div className="flex-1 h-8 bg-[#FF6B6B]/10 rounded-lg border border-[#FF6B6B]/20" />
                </div>
              </div>

              <p className="text-xs text-[#6B7280] text-center">
                Scout image coming soon ✦
              </p>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-24 md:mt-32">
          <p className="text-center text-sm font-semibold text-[#6B7280] uppercase tracking-widest mb-12">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative bg-white border border-[#D4CFC7] rounded-2xl p-7 hover:border-[#2EC4B6] hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
              >
                <span className="absolute top-5 right-6 text-5xl font-black text-[#0D1B2A]/4 select-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative flex flex-col flex-1 space-y-4">
                  <div className="inline-flex items-center justify-center w-11 h-11 bg-[#FFF8F0] border border-[#D4CFC7] rounded-xl group-hover:bg-[#2EC4B6]/10 group-hover:border-[#2EC4B6]/30 transition-colors duration-300">
                    <f.icon size={20} className="text-[#0D1B2A] group-hover:text-[#2EC4B6] transition-colors duration-300" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-semibold text-[#0D1B2A]">{f.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {f.description}
                    </p>
                  </div>
                  <span className="inline-block self-start text-xs font-semibold text-[#2EC4B6] bg-[#2EC4B6]/10 px-2.5 py-1 rounded-md mt-auto">
                    {f.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-[#D4CFC7]">
        <span className="text-sm font-bold">
          Scope<span className="text-[#2EC4B6]">It</span>
        </span>
        <p className="text-sm text-[#6B7280] text-center">
          Built for World Product Day 2026 ✦ Everyone Ships Now
        </p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Target,
    title: "Drop your messy idea",
    description:
      "Type your product idea in plain English — no structure needed. The messier, the better. Scout is built to handle chaos.",
    tag: "Step 1",
  },
  {
    icon: Scissors,
    title: "Scout scopes it down",
    description:
      "Scout defines your target user, cuts unnecessary features, and tells you exactly what NOT to build — and why.",
    tag: "Step 2",
  },
  {
    icon: Map,
    title: "Get your execution path",
    description:
      "Walk away with a clear MVP scope, a 3-phase roadmap, and one next move you can take today. No fluff.",
    tag: "Step 3",
  },
];