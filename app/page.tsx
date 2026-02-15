"use client";

import { useState } from "react";

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
  { name: string; drink: string; tagline: string; emoji: string }
> = {
  bold: {
    name: "Bold Adventurer",
    drink: "Double Espresso",
    tagline: "You live for intensity",
    emoji: "🏔️",
  },
  cozy: {
    name: "Cozy Classic",
    drink: "Medium Roast Drip",
    tagline: "Comfort in every cup",
    emoji: "📖",
  },
  sweet: {
    name: "Sweet Enthusiast",
    drink: "Caramel Latte",
    tagline: "Life's too short for bitter",
    emoji: "🧁",
  },
  indulgent: {
    name: "Indulgent Treat",
    drink: "Mocha with Whip",
    tagline: "Coffee is dessert",
    emoji: "🍫",
  },
};

/* ─── Helpers ──────────────────────────────────────────── */

function tallyResults(answers: Personality[]): Personality {
  const counts: Record<Personality, number> = { bold: 0, cozy: 0, sweet: 0, indulgent: 0 };
  for (const a of answers) counts[a]++;
  const order: Personality[] = ["bold", "cozy", "sweet", "indulgent"];
  return order.reduce((best, cur) => (counts[cur] > counts[best] ? cur : best), order[0]);
}

/* ─── Component ────────────────────────────────────────── */

export default function Home() {
  const [screen, setScreen] = useState<"welcome" | "quiz" | "result">("welcome");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Personality[]>([]);

  function handleAnswer(type: Personality) {
    const next = [...answers, type];
    setAnswers(next);
    if (next.length === questions.length) {
      setScreen("result");
    } else {
      setCurrentQ(currentQ + 1);
    }
  }

  function restart() {
    setScreen("welcome");
    setCurrentQ(0);
    setAnswers([]);
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
            onClick={() => setScreen("quiz")}
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

          <p className="text-center text-sm text-dark-brown/50">
            Question {currentQ + 1} of {questions.length}
          </p>
        </div>
      </div>
    );
  }

  /* ── Result ── */
  const result = personalities[tallyResults(answers)];
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="rounded-2xl bg-cream p-10 shadow-md space-y-4">
          <span className="text-5xl">{result.emoji}</span>
          <h2 className="font-serif text-3xl font-bold text-dark-brown">
            You&rsquo;re a {result.name}!
          </h2>
          <p className="text-lg text-dark-brown/70 italic">&ldquo;{result.tagline}&rdquo;</p>
          <div className="rounded-xl bg-warm-bg px-6 py-4">
            <p className="text-sm text-dark-brown/60 uppercase tracking-wide">Your coffee</p>
            <p className="text-xl font-semibold text-dark-brown mt-1">{result.drink}</p>
          </div>
        </div>
        <button
          onClick={restart}
          className="inline-block rounded-full bg-warm-brown px-8 py-3 text-lg font-semibold text-cream shadow-md transition hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
}
