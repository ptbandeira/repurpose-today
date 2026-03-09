"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import {
  BookOpen,
  Compass,
  Search,
  Users,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { track } from "@vercel/analytics";

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
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ─── Animated counter ───
function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: string;
  suffix?: string;
}) {
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
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={() => {
          if (!open) track("faq_opened", { question: q });
          setOpen(!open);
        }}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors pr-4">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-neutral-600 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

// ─── Hero headline with word stagger ───
function HeroHeadline({ text }: { text: string }) {
  const { ref, isVisible } = useInView();
  return (
    <h1
      ref={ref}
      className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 text-neutral-900"
    >
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          className={`inline-block ${isVisible ? "word-reveal" : "opacity-0"}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {word}&nbsp;
        </span>
      ))}
    </h1>
  );
}

// ─── Main Page ───
export default function Home() {
  const [email, setEmail] = useState("");
  const [situation, setSituation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Google Translate auto-detect (once per session)
  useEffect(() => {
    const lang = navigator.language?.slice(0, 2);
    if (lang && lang !== "en" && !sessionStorage.getItem("gt_init")) {
      document.cookie = `googtrans=/en/${lang}; path=/`;
      sessionStorage.setItem("gt_init", "1");
      window.location.reload();
    }
  }, []);

  // Hero parallax
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.querySelector(".hero-bg") as HTMLElement;
      if (heroEl)
        heroEl.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    track("signup", { email_domain: email.split("@")[1] || "unknown" });
    setSubmitted(true);
    setLoading(false);
  };

  const clearTranslation = () => {
    document.cookie =
      "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    sessionStorage.removeItem("gt_init");
    window.location.reload();
  };

  return (
    <main className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative px-6 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 hero-bg">
          <Image
            src="/images/hero-bg.jpg"
            alt="Professional at work"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-primary-50/70" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeIn>
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                The Repurpose Framework™ — for professionals in transition
              </span>
            </div>
          </FadeIn>

          <HeroHeadline text="AI won't replace you. But it will replace your job description." />

          <FadeIn delay={200}>
            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              92 million jobs will be restructured by 2030. The reskilling
              industry says: take a course. We built a framework to help you
              find your purpose first — then the skills follow.
            </p>
          </FadeIn>

          {!submitted ? (
            <FadeIn delay={400}>
              <form
                onSubmit={handleSubmit}
                className="max-w-md mx-auto space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-3.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent text-base"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-primary w-full px-5 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-base transition-colors disabled:opacity-60"
                >
                  {loading
                    ? "Joining..."
                    : "Join the founding cohort — 10 spots"}
                </button>
                <p className="text-sm text-neutral-500">
                  Starting April 2026 · Free for founding members · No spam
                </p>
              </form>
            </FadeIn>
          ) : (
            <FadeIn>
              <div className="max-w-md mx-auto p-6 bg-primary-50 rounded-2xl border border-primary-200">
                <p className="text-primary-800 font-semibold text-lg mb-2">
                  You&apos;re in.
                </p>
                <p className="text-primary-700">
                  We&apos;ll reach out when the founding cohort opens. One quick
                  question:
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
                        track("persona_selected", { persona: option });
                      }}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                        situation === option
                          ? "border-primary-500 bg-primary-100 text-primary-800"
                          : "border-neutral-200 bg-white text-neutral-700 hover:border-primary-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {situation && (
                  <p className="mt-4 text-primary-600 text-sm">
                    Thank you! This helps us build the right experience for you.
                  </p>
                )}
              </div>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAR ─── */}
      <FadeIn>
        <section className="px-6 py-10 border-y border-neutral-200 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-neutral-500 uppercase tracking-wider mb-5">
              Built on research from
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-neutral-400">
              <span className="font-heading text-base md:text-lg text-neutral-500">
                World Economic Forum
              </span>
              <span className="hidden md:inline text-neutral-300">|</span>
              <span className="font-heading text-base md:text-lg text-neutral-500">
                McKinsey Global Institute
              </span>
              <span className="hidden md:inline text-neutral-300">|</span>
              <span className="font-heading text-base md:text-lg text-neutral-500">
                EU Skills Agenda
              </span>
              <span className="hidden md:inline text-neutral-300">|</span>
              <span className="font-heading text-base md:text-lg text-neutral-500">
                Ikigai Framework
              </span>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* ─── THE PROBLEM ─── */}
      <section className="px-6 py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-900">
              The reskilling industry has it backwards.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            <FadeIn delay={100}>
              <div className="p-6 bg-white rounded-2xl border border-neutral-200 shadow-sm h-full">
                <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-neutral-500" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-neutral-800">
                  What they offer
                </h3>
                <p className="text-neutral-600">
                  10,000 courses. Certificates. Video lectures. &quot;Learn
                  Python in 30 days.&quot; A $35 billion industry that assumes
                  you already know what you want to become.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={200}>
              <div className="p-6 bg-primary-50 rounded-2xl border border-primary-200 shadow-sm h-full">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-neutral-800">
                  What you actually need
                </h3>
                <p className="text-neutral-700">
                  A way to discover your purpose first. A community of people
                  navigating the same transition. Real humans to learn from —
                  not just screens.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── THE REPURPOSE FRAMEWORK™ ─── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-4 text-neutral-900">
            The Repurpose Framework™
          </h2>
          <p className="text-center text-neutral-600 mb-16 max-w-2xl mx-auto">
            Not a course. Not a quiz. A guided framework for career
            reinvention.
          </p>
        </FadeIn>

        <div className="relative">
          <div className="hidden md:block absolute top-10 left-[16.67%] right-[16.67%] h-px bg-primary-200" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Discover",
                desc: "An AI-guided Ikigai assessment that maps what you love, what you're good at, what the world needs, and what you can earn from. Not a quiz — a conversation that evolves over weeks.",
                bg: "bg-primary-400/10",
                iconColor: "text-primary-500",
                accent: "border-l-primary-400",
              },
              {
                step: "02",
                icon: Users,
                title: "Connect",
                desc: "Join a cohort of 10 people navigating the same transition. Meet weekly. Share openly. Find a consulting partner, a technical co-founder, or a mentor who's already made the transition you're planning.",
                bg: "bg-accent-500/10",
                iconColor: "text-accent-600",
                accent: "border-l-accent-500",
              },
              {
                step: "03",
                icon: Lightbulb,
                title: "Create",
                desc: "Turn your discovery into action. Whether it's a career pivot, a side project, or a new business — get micro-mentorship and co-creation support to make it real.",
                bg: "bg-neutral-400/10",
                iconColor: "text-neutral-600",
                accent: "border-l-neutral-400",
              },
            ].map(
              ({ step, icon: Icon, title, desc, bg, iconColor, accent }, i) => (
                <FadeIn key={step} delay={i * 150}>
                  <div
                    className={`relative border-l-4 ${accent} pl-6 md:border-l-0 md:pl-0 md:text-center`}
                  >
                    <div className="font-heading text-4xl text-primary-200 mb-3 md:mb-4 font-bold">
                      {step}
                    </div>
                    <div
                      className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center mb-4 md:mx-auto`}
                    >
                      <Icon className={`w-7 h-7 ${iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-neutral-800">
                      {title}
                    </h3>
                    <p className="text-neutral-600 leading-relaxed">{desc}</p>
                  </div>
                </FadeIn>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="px-6 py-20 bg-neutral-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-14">
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
                  <div className="text-3xl md:text-4xl font-bold text-primary-400 mb-1">
                    {prefix}
                    <AnimatedNumber value={value} suffix={suffix} />
                  </div>
                  <div className="text-neutral-300 text-sm mb-1">{label}</div>
                  <div className="text-neutral-500 text-xs">{source}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IS THIS FOR ─── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-900">
            Is this for you?
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title:
                "The senior professional watching AI reshape your industry",
              desc: "You've built a 15-year career in law, finance, or consulting. You're good at what you do — but the work itself is changing. You need clarity, not another webinar.",
              img: "/images/persona-1.jpg",
              alt: "Senior professional reflecting on career direction",
            },
            {
              title: "The leader carrying a team through transformation",
              desc: "Your company is restructuring around AI. You're expected to lead the change while privately wondering what it means for your own career.",
              img: "/images/persona-2.jpg",
              alt: "Team collaborating in modern office",
            },
            {
              title: "The expert whose expertise is being automated",
              desc: "Your deep knowledge was your edge. Now an AI does 80% of it. You know you need to evolve — but into what?",
              img: "/images/persona-3.jpg",
              alt: "Professional focused on laptop work",
            },
            {
              title: "The builder who hasn't started yet",
              desc: "You've had an idea for years — a consulting practice, a startup, a career pivot. You don't need another course. You need a framework and a push.",
              img: "/images/persona-4.jpg",
              alt: "Entrepreneur thinking about new project",
            },
          ].map(({ title, desc, img, alt }, i) => (
            <FadeIn key={title} delay={i * 100}>
              <div className="persona-card rounded-2xl border border-neutral-200 bg-white shadow-sm h-full overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={img}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 text-neutral-800">
                    {title}
                  </h3>
                  <p className="text-neutral-600">{desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ─── FOUNDER ─── */}
      <section className="px-6 py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-900">
              Who&apos;s behind this?
            </h2>
          </FadeIn>
          <FadeIn delay={150}>
            <div className="md:flex md:items-start md:gap-10">
              <div className="shrink-0 mb-6 md:mb-0 mx-auto md:mx-0">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
                  <span className="text-neutral-400 text-sm text-center px-4">
                    Photo coming soon
                  </span>
                </div>
              </div>
              <div>
                <h3 className="font-heading text-2xl font-bold text-neutral-900 mb-1">
                  Pedro Bandeira
                </h3>
                <p className="text-primary-600 text-sm font-medium mb-4">
                  Serial entrepreneur. Five-time career reinventor.
                </p>
                <div className="text-neutral-700 leading-relaxed mb-4 space-y-3">
                  <p>
                    I&apos;ve built companies in Portugal, Spain, France, and
                    Poland over 20 years. Corporate wellbeing, SaaS, consulting,
                    marketplaces — each one a reinvention. Not because I wanted
                    variety, but because the world kept changing and I had to
                    change with it.
                  </p>
                  <p>
                    I&apos;m not a career coach. I&apos;m not certified in
                    anything related to this. I&apos;m a practitioner — someone
                    who&apos;s been through the exact transition you&apos;re
                    facing, multiple times, and built a framework from what I
                    learned.
                  </p>
                  <p>
                    RepurposeToday exists because when I looked for something
                    like this, it didn&apos;t exist. The reskilling industry
                    sells courses. I wanted a framework and a community. So
                    I&apos;m building both.
                  </p>
                </div>
                <blockquote className="border-l-4 border-primary-300 pl-4 italic text-neutral-600 leading-relaxed">
                  &quot;I didn&apos;t read about career reinvention in a
                  textbook. I lived it — five times. This framework is what I
                  wish I&apos;d had.&quot;
                </blockquote>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-neutral-900">
            Questions you might have
          </h2>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm px-6 md:px-8">
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
              a="The founding cohort is free. Future cohorts will be priced affordably — we're building this for real professionals, not corporate budgets."
            />
          </div>
        </FadeIn>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="px-6 py-20 bg-neutral-900">
        <div className="max-w-lg mx-auto text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-white">
              Your next chapter won&apos;t come from a course catalogue.
            </h2>
            <p className="text-neutral-300 mb-8">
              10 professionals. 4 weeks. One framework. Starting April 2026.
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
                  className="w-full px-5 py-3.5 rounded-xl border border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="cta-primary w-full px-5 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition-colors disabled:opacity-60"
                >
                  Reserve your spot
                </button>
              </form>
            </FadeIn>
          ) : (
            <FadeIn>
              <p className="text-primary-400 font-medium">
                You&apos;re already on the list! We&apos;ll be in touch soon.
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-6 py-10 text-center text-neutral-500 text-sm">
        <p className="font-heading text-lg font-bold text-neutral-700 mb-2">
          RepurposeToday
        </p>
        <p className="text-neutral-400 text-xs mb-3">
          An{" "}
          <a
            href="https://analogai.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            Analog AI
          </a>{" "}
          program
        </p>
        <p>Your next chapter starts with a question, not a course.</p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-neutral-400">
          <span>&copy; {new Date().getFullYear()} RepurposeToday</span>
          <span>·</span>
          <span>Photos by Pexels</span>
          <span>·</span>
          <button
            onClick={clearTranslation}
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            View in English
          </button>
        </div>
      </footer>
    </main>
  );
}
