"use client";

import { useState, useEffect } from "react";

/* ─── Data ─────────────────────────────────────────────── */

type Personality = "bold" | "cozy" | "sweet" | "indulgent";

interface Answer {
  emoji: string;
  text: string;
  type: Personality;
}

interface Question {
  question: string;
  answers: Answer[];
}

const questions: Question[] = [
  {
    question: "Pick your ideal Saturday morning",
    answers: [
      { emoji: "🏔️", text: "Hiking a new trail at sunrise", type: "bold" },
      { emoji: "📖", text: "Reading in bed with fuzzy socks", type: "cozy" },
      { emoji: "🧁", text: "Brunch with friends at a cute cafe", type: "sweet" },
      { emoji: "🍫", text: "Sleeping in, then pancakes with ALL the toppings", type: "indulgent" },
    ],
  },
  {
    question: "Pick a movie vibe",
    answers: [
      { emoji: "🎬", text: "Action thriller - explosions and car chases", type: "bold" },
      { emoji: "🎥", text: "A re-watch of your favorite comfort film", type: "cozy" },
      { emoji: "💕", text: "Feel-good rom-com that makes you smile", type: "sweet" },
      { emoji: "🍿", text: "Epic fantasy with stunning visuals", type: "indulgent" },
    ],
  },
  {
    question: "Pick a superpower",
    answers: [
      { emoji: "⚡", text: "Teleportation - go anywhere instantly", type: "bold" },
      { emoji: "⏰", text: "Time manipulation - pause and savor any moment", type: "cozy" },
      { emoji: "💫", text: "Mind reading - know what everyone's really thinking", type: "sweet" },
      { emoji: "✨", text: "Reality bending - make anything you imagine real", type: "indulgent" },
    ],
  },
  {
    question: "How do you take a vacation?",
    answers: [
      { emoji: "🗺️", text: "Backpacking somewhere you've never been", type: "bold" },
      { emoji: "🏡", text: "Cabin in the woods, no phone, no plans", type: "cozy" },
      { emoji: "🎡", text: "Road trip with friends, stopping at every cute town", type: "sweet" },
      { emoji: "🏖️", text: "All-inclusive resort - pool, room service, repeat", type: "indulgent" },
    ],
  },
  {
    question: "Pick a dessert that speaks to your soul",
    answers: [
      { emoji: "🌶️", text: "Dark chocolate with chili flakes", type: "bold" },
      { emoji: "🍪", text: "Warm chocolate chip cookie, fresh from the oven", type: "cozy" },
      { emoji: "🍰", text: "Strawberry shortcake with extra whipped cream", type: "sweet" },
      { emoji: "🍦", text: "Triple-layer sundae with every topping", type: "indulgent" },
    ],
  },
];

const personalities: Record<
  Personality,
  { name: string; drink: string; tagline: string; emoji: string; description: string }
> = {
  bold: {
    name: "Bold Adventurer",
    drink: "Double Espresso",
    tagline: "You live for intensity",
    emoji: "🏔️",
    description:
      "You're the first one up and the last one to call it a night. You crave new experiences, big flavors, and the kind of coffee that hits like a wake-up call. No cream, no sugar — just pure, unfiltered energy.",
  },
  cozy: {
    name: "Cozy Classic",
    drink: "Medium Roast Drip",
    tagline: "Comfort in every cup",
    emoji: "📖",
    description:
      "You know that the best things in life are simple and savored slowly. A familiar mug, a quiet morning, and a perfectly brewed cup — that's your kind of magic. You don't follow trends, you set the vibe.",
  },
  sweet: {
    name: "Sweet Enthusiast",
    drink: "Caramel Latte",
    tagline: "Life's too short for bitter",
    emoji: "🧁",
    description:
      "You bring warmth to every room and sweetness to every conversation. Your coffee order is an extension of your personality — bright, joyful, and unapologetically delicious. Extra caramel? Always.",
  },
  indulgent: {
    name: "Indulgent Treat",
    drink: "Mocha with Whip",
    tagline: "Coffee is dessert",
    emoji: "🍫",
    description:
      "Why choose between coffee and dessert when you can have both? You believe every day deserves a little luxury, and your coffee order proves it. Life is rich — your drink should be too.",
  },
};

/* ─── Helpers ──────────────────────────────────────────── */

function tallyResults(answers: Personality[]): Personality {
  const counts: Record<Personality, number> = { bold: 0, cozy: 0, sweet: 0, indulgent: 0 };
  for (const a of answers) counts[a]++;
  const order: Personality[] = ["bold", "cozy", "sweet", "indulgent"];
  return order.reduce((best, cur) => (counts[cur] > counts[best] ? cur : best), order[0]);
}

function trackEvent(event: string, data?: Record<string, string | number>) {
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      event,
      data,
    );
  }
  console.log("[analytics]", event, data ?? "");
}

/* ─── Component ────────────────────────────────────────── */

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "quiz" | "brewing" | "result">("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Personality[]>([]);
  const [toast, setToast] = useState(false);
  const [resultReady, setResultReady] = useState(false);

  useEffect(() => {
    if (screen === "brewing") {
      const timer = setTimeout(() => setScreen("result"), 2000);
      return () => clearTimeout(timer);
    }
    if (screen === "result") {
      const resultType = tallyResults(answers);
      trackEvent("quiz_result", { personality: personalities[resultType].name });
      const timer = setTimeout(() => setResultReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [screen]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleStart() {
    trackEvent("quiz_start");
    setScreen("quiz");
  }

  function handleAnswer(type: Personality) {
    const next = [...answers, type];
    trackEvent("quiz_answer", { question: currentQ + 1, answer: type });
    setAnswers(next);
    if (next.length === questions.length) {
      setResultReady(false);
      setScreen("brewing");
    } else {
      setCurrentQ(currentQ + 1);
    }
  }

  function goBack() {
    if (currentQ > 0) {
      setAnswers(answers.slice(0, -1));
      setCurrentQ(currentQ - 1);
    }
  }

  function restart() {
    setScreen("welcome");
    setCurrentQ(0);
    setAnswers([]);
    setResultReady(false);
  }

  function share(result: { name: string; drink: string }) {
    trackEvent("quiz_share", { personality: result.name });
    const text = `I'm a ${result.name}! My perfect brew is ${result.drink}. What's your coffee personality?`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: "My Coffee Personality", text, url });
    } else {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setToast(true);
      setTimeout(() => setToast(false), 2500);
    }
  }

  /* ── Welcome ── */
  if (screen === "welcome") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-dark-brown leading-tight">
            What&rsquo;s Your Coffee Personality?
          </h1>
          <p className="text-lg text-dark-brown/70">
            Answer 5 fun questions and discover your perfect brew.
          </p>
          <button
            onClick={handleStart}
            className="inline-block rounded-full bg-warm-brown px-8 py-3 text-lg font-semibold text-cream shadow-md transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  /* ── Quiz ── */
  if (screen === "quiz") {
    const q = questions[currentQ];
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full space-y-8">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {questions.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i <= currentQ ? "bg-warm-brown" : "bg-warm-brown/25"
                }`}
              />
            ))}
          </div>

          {/* Question card */}
          <div className="rounded-2xl bg-cream p-8 shadow-md">
            <h2 className="font-serif text-2xl font-bold text-dark-brown mb-6 text-center">
              {q.question}
            </h2>

            <div className="space-y-3">
              {q.answers.map((a, i) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(a.type)}
                  className="w-full rounded-xl border-2 border-warm-brown/15 bg-warm-bg px-5 py-4 text-left text-dark-brown transition hover:-translate-y-0.5 hover:shadow-md hover:border-warm-brown/40 cursor-pointer"
                >
                  <span className="mr-3 text-xl">{a.emoji}</span>
                  {a.text}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-dark-brown/50">
            {currentQ > 0 && (
              <button
                onClick={goBack}
                className="underline underline-offset-2 hover:text-dark-brown/70 transition cursor-pointer"
              >
                Back
              </button>
            )}
            <span>Question {currentQ + 1} of {questions.length}</span>
          </div>
        </div>
      </div>
    );
  }

  /* ── Brewing (loading) ── */
  if (screen === "brewing") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center space-y-4">
          <span className="text-5xl block animate-bounce">☕</span>
          <p className="font-serif text-2xl font-bold text-dark-brown">
            Brewing your results&hellip;
          </p>
        </div>
      </div>
    );
  }

  /* ── Result ── */
  const result = personalities[tallyResults(answers)];

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div
        className={`max-w-md w-full text-center space-y-6 transition-all duration-700 ${
          resultReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="rounded-2xl bg-cream p-10 shadow-md space-y-5">
          <span className="text-6xl block">{result.emoji}</span>
          <h2 className="font-serif text-3xl font-bold text-dark-brown">
            You&rsquo;re a {result.name}!
          </h2>
          <p className="text-lg text-dark-brown/70 italic">&ldquo;{result.tagline}&rdquo;</p>
          <p className="text-dark-brown/80 leading-relaxed">{result.description}</p>
          <div className="rounded-xl bg-warm-bg px-6 py-4">
            <p className="text-sm text-dark-brown/60 uppercase tracking-wide">Your coffee</p>
            <p className="text-xl font-semibold text-dark-brown mt-1">{result.drink}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-cream/60 border-2 border-dashed border-warm-brown/20 px-6 py-5">
          <p className="font-serif text-lg font-semibold text-dark-brown">
            Show this to your barista
          </p>
          <p className="text-dark-brown/60 text-sm mt-1">
            Ask for your {result.drink} at any Basecamp Coffee location
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
          <button
            onClick={() => share(result)}
            className="rounded-full bg-warm-brown px-8 py-3 text-lg font-semibold text-cream shadow-md transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
          >
            Share My Result
          </button>
          <button
            onClick={restart}
            className="rounded-full border-2 border-warm-brown/30 px-8 py-3 text-lg font-semibold text-dark-brown transition hover:-translate-y-0.5 hover:shadow-md hover:border-warm-brown/50 cursor-pointer"
          >
            Retake Quiz
          </button>
        </div>

        {/* Toast */}
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-dark-brown px-6 py-3 text-cream text-sm shadow-lg transition-all duration-300 ${
            toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          Copied to clipboard!
        </div>
      </div>
    </div>
  );
}
