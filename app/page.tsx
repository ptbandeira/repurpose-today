"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import {
  BookOpen,
  Compass,
  Search,
  Users,
  Lightbulb,
  ChevronDown,
} from "lucide-react";

// ─── Scroll animation hook ───
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Animated counter ───
function AnimatedNumber({ value, suffix = "" }: { value: string; suffix?: string }) {
  const { ref, isVisible } = useInView(0.3);
  const [display, setDisplay] = useState("0");
  const numericPart = value.replace(/[^0-9.]/g, "");
  const prefix = value.replace(/[0-9.].*/g, "");

  useEffect(() => {
    if (!isVisible) return;
    const target = parseFloat(numericPart);
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(String(current));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isVisible, numericPart]);

  return (
    <span ref={ref}>
      {prefix}
      {isVisible ? display : "0"}
      {suffix}
    </span>
  );
}

// ─── FAQ Accordion ───
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-warm-200 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-semibold text-warm-800 group-hover:text-sage-700 transition-colors pr-4">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-warm-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-warm-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ─── Main Page ───
export default function Home() {
  const [email, setEmail] = useState("");
  const [situation, setSituation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, situation }),
      });
    } catch {
      // Silently fail — Supabase handles persistence
    }
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative px-6 py-24 md:py-32 max-w-4xl mx-auto text-center">
        <FadeIn>
          <div className="mb-6">
            <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 text-sm font-medium rounded-full">
              For professionals who want more than a certificate
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl md:text-6xl font-normal leading-tight mb-6 text-warm-900">
            Your next chapter starts with a question,{" "}
            <span className="text-sage-600 italic">not a course.</span>
          </h1>

          <p className="text-lg md:text-xl text-warm-700 max-w-2xl mx-auto mb-10 leading-relaxed">
            The World Economic Forum says 92 million jobs disappear by 2030.
            The reskilling industry says: take a course. We say: find your
            purpose first — then the skills follow.
          </p>
        </FadeIn>

        {!submitted ? (
          <FadeIn delay={200}>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3.5 rounded-xl border border-warm-200 bg-white text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent text-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-5 py-3.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold text-base transition-colors disabled:opacity-60"
              >
                {loading ? "Joining..." : "Join the first cohort — 10 spots"}
              </button>
              <p className="text-sm text-warm-500">
                Starting April 2026. Free for founding members. No spam.
              </p>
            </form>
          </FadeIn>
        ) : (
          <FadeIn>
            <div className="max-w-md mx-auto p-6 bg-sage-50 rounded-2xl border border-sage-200">
              <p className="text-sage-800 font-semibold text-lg mb-2">
                You&apos;re in.
              </p>
              <p className="text-sage-700">
                We&apos;ll reach out when the first cohort opens. One quick question:
              </p>
              <div className="mt-4 space-y-2">
                {[
                  "I feel stuck in my career and want direction",
                  "I'm worried AI will affect my job",
                  "I want to learn new skills but don't know which ones",
                  "I have skills to share and want to teach others",
                  "I want to build something new but need co-creators",
                ].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSituation(option);
                      fetch("/api/signup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email,
                          situation: option,
                          type: "persona_update",
                        }),
                      }).catch(() => {});
                    }}
                    className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                      situation === option
                        ? "border-sage-500 bg-sage-100 text-sage-800"
                        : "border-warm-200 bg-white text-warm-700 hover:border-sage-300"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {situation && (
                <p className="mt-4 text-sage-600 text-sm">
                  Thank you! This helps us build the right experience for you.
                </p>
              )}
            </div>
          </FadeIn>
        )}
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <FadeIn>
        <section className="px-6 py-10 border-y border-warm-200 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-warm-500 uppercase tracking-wider mb-5">
              Built on research from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-warm-400">
              <span className="font-heading text-base md:text-lg text-warm-500">
                World Economic Forum
              </span>
              <span className="hidden md:inline text-warm-300">|</span>
              <span className="font-heading text-base md:text-lg text-warm-500">
                McKinsey Global Institute
              </span>
              <span className="hidden md:inline text-warm-300">|</span>
              <span className="font-heading text-base md:text-lg text-warm-500">
                EU Skills Agenda
              </span>
              <span className="hidden md:inline text-warm-300">|</span>
              <span className="font-heading text-base md:text-lg text-warm-500">
                Ikigai Framework
              </span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ─── THE PROBLEM ─── */}
      <section className="px-6 py-20 bg-warm-100/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl text-center mb-12 text-warm-800">
              The reskilling industry has it backwards.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={100}>
              <div className="p-6 bg-white rounded-2xl border border-warm-200 h-full">
                <div className="w-12 h-12 bg-warm-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-warm-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-warm-800">
                  What they offer
                </h3>
                <p className="text-warm-600">
                  10,000 courses. Certificates. Video lectures. &quot;Learn Python in 30
                  days.&quot; A $35 billion industry that assumes you already know what
                  you want to become.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="p-6 bg-sage-50 rounded-2xl border border-sage-200 h-full">
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-sage-800">
                  What you actually need
                </h3>
                <p className="text-sage-700">
                  A way to discover your purpose first. A community of people
                  navigating the same transition. Real humans to learn from — not
                  just screens.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── THREE STEPS (Timeline) ─── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl text-center mb-4 text-warm-800">
            Three steps to your next chapter
          </h2>
          <p className="text-center text-warm-600 mb-16 max-w-2xl mx-auto">
            Based on Ikigai — but designed for the AI age.
          </p>
        </FadeIn>

        <div className="relative">
          {/* Connecting line — desktop */}
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-sage-200" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Discover",
                desc: "An AI-guided Ikigai assessment that maps what you love, what you're good at, what the world needs, and what you can earn from. Not a quiz — a conversation that evolves over weeks.",
                bg: "bg-sunset-400/10",
                iconColor: "text-sunset-500",
                accent: "border-l-sunset-400",
              },
              {
                step: "02",
                icon: Users,
                title: "Connect",
                desc: "Join a cohort of 10 people navigating the same transition. Meet weekly. Share openly. Find someone with a pottery studio, a coding mentor, or a co-founder who complements your strengths.",
                bg: "bg-sage-400/10",
                iconColor: "text-sage-600",
                accent: "border-l-sage-400",
              },
              {
                step: "03",
                icon: Lightbulb,
                title: "Create",
                desc: "Turn your discovery into action. Whether it's a career pivot, a side project, or a new business — get micro-mentorship and co-creation support to make it real.",
                bg: "bg-warm-400/10",
                iconColor: "text-warm-600",
                accent: "border-l-warm-400",
              },
            ].map(({ step, icon: Icon, title, desc, bg, iconColor, accent }, i) => (
              <FadeIn key={step} delay={i * 150}>
                <div className={`relative border-l-4 ${accent} pl-6 md:border-l-0 md:pl-0 md:text-center`}>
                  <div className="font-heading text-4xl text-sage-200 mb-3 md:mb-4">
                    {step}
                  </div>
                  <div
                    className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-4 md:mx-auto`}
                  >
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 text-warm-800">
                    {title}
                  </h3>
                  <p className="text-warm-600 leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="px-6 py-20 bg-sage-800 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl mb-14">
              The numbers behind the movement
            </h2>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-6">
            {[
              {
                value: "92",
                suffix: "M",
                label: "Jobs displaced by 2030",
                source: "World Economic Forum",
              },
              {
                value: "170",
                suffix: "M",
                label: "New roles being created",
                source: "WEF Future of Jobs",
              },
              {
                value: "67",
                suffix: "%",
                label: "Young adults lack community",
                source: "Harvard, 2023",
              },
              {
                value: "20",
                suffix: "B+",
                prefix: "€",
                label: "EU funding for reskilling",
                source: "EU Skills Agenda",
              },
              {
                value: "4",
                suffix: " weeks",
                label: "Your guided journey",
                source: "First cohort",
              },
            ].map(({ value, suffix, prefix, label, source }) => (
              <FadeIn key={label}>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-sage-200 mb-1">
                    {prefix}
                    <AnimatedNumber value={value} suffix={suffix} />
                  </div>
                  <div className="text-sage-300 text-sm mb-1">{label}</div>
                  <div className="text-sage-500 text-xs">{source}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IS THIS FOR ─── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl text-center mb-12 text-warm-800">
            Is this for you?
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "The anxious professional",
              desc: "You see AI reshaping your industry and wonder: will my skills still matter in 3 years?",
            },
            {
              title: "The stuck mid-career worker",
              desc: "You're good at your job but feel no purpose. Sunday evenings fill you with dread.",
            },
            {
              title: "The hidden teacher",
              desc: "You have skills — woodworking, coding, design, cooking — and would love to share them with someone who needs them.",
            },
            {
              title: "The would-be builder",
              desc: "You have an idea for something new but need co-creators, not another business course.",
            },
          ].map(({ title, desc }, i) => (
            <FadeIn key={title} delay={i * 100}>
              <div className="p-6 rounded-2xl border border-warm-200 bg-white hover:border-sage-300 hover:shadow-sm transition-all h-full">
                <h3 className="font-semibold text-lg mb-2 text-warm-800">
                  {title}
                </h3>
                <p className="text-warm-600">{desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── FOUNDER ─── */}
      <section className="px-6 py-20 bg-warm-100/50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl text-center mb-12 text-warm-800">
              Who&apos;s behind this?
            </h2>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="md:flex md:items-start md:gap-10">
              {/* Photo */}
              <div className="shrink-0 mb-6 md:mb-0 mx-auto md:mx-0">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-sage-100 border border-sage-200 overflow-hidden flex items-center justify-center">
                  {/* Replace with <Image> when pedro.jpg is provided */}
                  <span className="text-sage-400 text-sm text-center px-4">
                    Photo coming soon
                  </span>
                </div>
              </div>
              {/* Bio */}
              <div>
                <h3 className="font-heading text-2xl text-warm-800 mb-1">
                  Pedro Bandeira
                </h3>
                <p className="text-warm-500 text-sm mb-4">
                  Founder, RepurposeToday
                </p>
                <p className="text-warm-700 leading-relaxed mb-4">
                  20 years building companies across Portugal, Spain, and Poland.
                  Corporate wellbeing, tech startups, consulting — the works.
                  Now building the platform he wished existed when AI started
                  changing everything.
                </p>
                <blockquote className="border-l-4 border-sage-300 pl-4 italic text-warm-600 leading-relaxed">
                  &quot;I didn&apos;t start this because I read a McKinsey report. I started it
                  because I watched good people — smart people — freeze when they realized
                  their skills might not matter in 3 years. That&apos;s not a reskilling
                  problem. That&apos;s a purpose problem.&quot;
                </blockquote>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl text-center mb-12 text-warm-800">
            Questions you might have
          </h2>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="bg-white rounded-2xl border border-warm-200 px-6 md:px-8">
            <FAQItem
              q="Is this a course?"
              a="No. It's a guided experience — part self-discovery, part community, part action plan. No lectures, no certificates, no homework."
            />
            <FAQItem
              q="Do I need to be tech-savvy?"
              a="Not at all. If you can use email and video calls, you're ready. This isn't about learning AI — it's about finding your path through the AI transition."
            />
            <FAQItem
              q="What happens after the 4 weeks?"
              a="You'll have a clear direction, a support network, and an action plan. Many participants continue meeting with their cohort independently."
            />
            <FAQItem
              q="How much does it cost?"
              a="The founding cohort is free. Future cohorts will be priced affordably — we're building this for real workers, not corporate budgets."
            />
          </div>
        </FadeIn>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-6 py-20 bg-warm-100/50">
        <div className="max-w-lg mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl mb-4 text-warm-800">
              Your next chapter is waiting.
            </h2>
            <p className="text-warm-600 mb-8">
              10 people. 4 weeks. Starting April 2026. Free for founding members.
            </p>
          </FadeIn>
          {!submitted ? (
            <FadeIn delay={150}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-warm-200 bg-white text-warm-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-5 py-3.5 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-semibold transition-colors disabled:opacity-60"
                >
                  Reserve your spot
                </button>
              </form>
            </FadeIn>
          ) : (
            <FadeIn>
              <p className="text-sage-700 font-medium">
                You&apos;re already on the list! We&apos;ll be in touch soon.
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-6 py-10 text-center text-warm-500 text-sm">
        <p className="font-heading text-lg text-warm-700 mb-2">
          RepurposeToday
        </p>
        <p>Your next chapter starts with a question, not a course.</p>
        <p className="mt-4">
          &copy; {new Date().getFullYear()} RepurposeToday. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
