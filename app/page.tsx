"use client";

import { useState } from "react";

// ─── Validation metrics (tracked via form submissions) ───
// 1. Email signups → demand signal
// 2. "What describes you best?" → persona validation
// 3. Scroll depth → content engagement (add analytics later)

export default function Home() {
  const [email, setEmail] = useState("");
  const [situation, setSituation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    // For now, log to console. Replace with Supabase/Vercel KV/Google Sheets API
    console.log("Signup:", { email, situation, timestamp: new Date().toISOString() });

    // TODO: Connect to backend (Supabase table or Vercel KV)
    // For MVP, use Vercel's form handling or a simple API route
    try {
      await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, situation }),
      });
    } catch {
      // Silently fail for now — we'll add proper storage
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative px-6 py-20 md:py-32 max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <span className="inline-block px-4 py-1.5 bg-sage-100 text-sage-700 text-sm font-medium rounded-full">
            For workers navigating the AI transition
          </span>
        </div>

        <h1 className="font-heading text-4xl md:text-6xl font-normal leading-tight mb-6 text-warm-900">
          Your next chapter starts with a question,{" "}
          <span className="text-sage-600 italic">not a course.</span>
        </h1>

        <p className="text-lg md:text-xl text-warm-700 max-w-2xl mx-auto mb-10 leading-relaxed">
          AI is reshaping 92 million jobs by 2030. But the answer isn&apos;t another
          online certificate. It&apos;s discovering who you could become — then finding
          others on the same path.
        </p>

        {!submitted ? (
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
              {loading ? "Joining..." : "Join the waitlist — it's free"}
            </button>
            <p className="text-sm text-warm-500">
              No spam. Just early access to a guided purpose-discovery experience.
            </p>
          </form>
        ) : (
          <div className="max-w-md mx-auto p-6 bg-sage-50 rounded-2xl border border-sage-200">
            <p className="text-sage-800 font-semibold text-lg mb-2">
              You&apos;re in.
            </p>
            <p className="text-sage-700">
              We&apos;ll reach out when the first cohort opens. In the meantime — one
              quick question:
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
                    // Log the persona selection
                    console.log("Persona:", { email, situation: option });
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
        )}
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section className="px-6 py-20 bg-warm-100/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl text-center mb-12 text-warm-800">
            The reskilling industry has it backwards.
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-2xl border border-warm-200">
              <div className="text-2xl mb-3">📚</div>
              <h3 className="font-semibold text-lg mb-2 text-warm-800">
                What they offer
              </h3>
              <p className="text-warm-600">
                10,000 courses. Certificates. Video lectures. &quot;Learn Python in 30
                days.&quot; A $35 billion industry that assumes you already know what
                you want to become.
              </p>
            </div>
            <div className="p-6 bg-sage-50 rounded-2xl border border-sage-200">
              <div className="text-2xl mb-3">🧭</div>
              <h3 className="font-semibold text-lg mb-2 text-sage-800">
                What you actually need
              </h3>
              <p className="text-sage-700">
                A way to discover your purpose first. A community of people
                navigating the same transition. Real humans to learn from — not
                just screens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THREE PILLARS ─── */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-4 text-warm-800">
          Three steps to your next chapter
        </h2>
        <p className="text-center text-warm-600 mb-14 max-w-2xl mx-auto">
          Inspired by Ikigai — the Japanese concept of finding your reason for being.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-sunset-400/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="font-semibold text-xl mb-3 text-warm-800">
              Discover
            </h3>
            <p className="text-warm-600 leading-relaxed">
              An AI-guided Ikigai assessment that maps what you love, what
              you&apos;re good at, what the world needs, and what you can earn from.
              Not a quiz — a conversation that evolves over weeks.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-sage-400/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🤝</span>
            </div>
            <h3 className="font-semibold text-xl mb-3 text-warm-800">
              Connect
            </h3>
            <p className="text-warm-600 leading-relaxed">
              Join a cohort of 10 people navigating the same transition. Meet
              weekly. Share openly. Find someone with a pottery studio, a coding
              mentor, or a co-founder who complements your strengths.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-warm-400/15 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="font-semibold text-xl mb-3 text-warm-800">
              Create
            </h3>
            <p className="text-warm-600 leading-relaxed">
              Turn your discovery into action. Whether it&apos;s a career pivot, a
              side project, or a new business — get micro-mentorship and
              co-creation support to make it real.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / DATA ─── */}
      <section className="px-6 py-20 bg-sage-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl mb-12">
            The numbers behind the movement
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "92M", label: "Jobs displaced by 2030" },
              { number: "170M", label: "New roles being created" },
              { number: "67%", label: "Young adults lack community" },
              { number: "€20B+", label: "EU funding for reskilling" },
            ].map(({ number, label }) => (
              <div key={label}>
                <div className="text-3xl md:text-4xl font-bold text-sage-200 mb-1">
                  {number}
                </div>
                <div className="text-sage-300 text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO IS THIS FOR ─── */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl text-center mb-12 text-warm-800">
          Is this for you?
        </h2>
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
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-warm-200 bg-white hover:border-sage-300 transition-colors"
            >
              <h3 className="font-semibold text-lg mb-2 text-warm-800">
                {title}
              </h3>
              <p className="text-warm-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECOND CTA ─── */}
      <section className="px-6 py-20 bg-warm-100/50">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl mb-4 text-warm-800">
            Your next chapter is waiting.
          </h2>
          <p className="text-warm-600 mb-8">
            The first cohort launches soon. 10 people. 4 weeks. A guided journey
            to discover what&apos;s next.
          </p>
          {!submitted ? (
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
                Join the waitlist
              </button>
            </form>
          ) : (
            <p className="text-sage-700 font-medium">
              You&apos;re already on the list! We&apos;ll be in touch soon.
            </p>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="px-6 py-10 text-center text-warm-500 text-sm">
        <p className="font-heading text-lg text-warm-700 mb-2">
          RepurposeToday
        </p>
        <p>
          Your next chapter starts with a question, not a course.
        </p>
        <p className="mt-4">
          © {new Date().getFullYear()} RepurposeToday. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
