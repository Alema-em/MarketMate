import type { LearningPath, LessonContent } from "@/types/learning";
import { FIRST_INVESTOR_PATH_ID } from "@/types/learning";

export const FIRST_INVESTOR_PATH: LearningPath = {
  id: FIRST_INVESTOR_PATH_ID,
  title: "First Investor",
  description:
    "A calm, step-by-step path from zero to understanding how a starter portfolio works—without pressure or jargon.",
  lessonIds: [
    "why-invest",
    "what-is-stock",
    "what-is-etf",
    "risk-volatility",
    "diversification",
    "long-term-habits",
    "first-portfolio-readiness",
  ],
};

export const FIRST_INVESTOR_LESSONS: LessonContent[] = [
  {
    id: "why-invest",
    pathId: FIRST_INVESTOR_PATH_ID,
    order: 1,
    title: "Why invest?",
    subtitle: "What investing is really for",
    durationMinutes: 4,
    sections: [
      {
        heading: "Saving vs investing",
        body: "Saving keeps money safe and easy to access. Investing puts money to work in assets like stocks or funds so it can grow over time. Growth is not guaranteed, but historically many investors use investing to stay ahead of inflation and build long-term wealth.",
      },
      {
        heading: "Time is your advantage",
        body: "Students often have decades before major goals like retirement. Longer time horizons can help smooth out short-term market swings—if you stay patient and keep learning.",
      },
    ],
    example: {
      title: "Meet Jordan",
      body: "Jordan puts $25 a month into a broad market fund during university instead of leaving cash idle. Some months the balance dips, but Jordan keeps going because the goal is learning and long-term habits—not quick wins.",
    },
    quiz: {
      question: "What is the main long-term purpose of investing (not a promise of returns)?",
      choices: [
        { id: "a", label: "To grow wealth over time and beat inflation" },
        { id: "b", label: "To double money every year" },
        { id: "c", label: "To avoid all risk" },
      ],
      correctChoiceId: "a",
      explanation:
        "Investing is about long-term growth potential and staying ahead of inflation. No strategy guarantees fast or fixed returns.",
    },
    copilotPrompt:
      "I'm learning why people invest. Can you explain in simple terms how investing differs from saving, without giving buy or sell advice?",
  },
  {
    id: "what-is-stock",
    pathId: FIRST_INVESTOR_PATH_ID,
    order: 2,
    title: "What is a stock?",
    subtitle: "Owning a tiny slice of a company",
    durationMinutes: 4,
    sections: [
      {
        heading: "A share means ownership",
        body: "When you buy a stock, you buy a small ownership stake in a public company. If the company does well over time, the share price may rise—but it can also fall if business struggles or markets panic.",
      },
      {
        heading: "Prices move with news and expectations",
        body: "Stock prices reflect what investors collectively believe about future profits, competition, and the economy. That is why prices change daily even when the underlying business changes slowly.",
      },
    ],
    example: {
      title: "Think of a pizza shop",
      body: "If a popular pizza chain sells shares to the public, buying one share does not let you run the kitchen—but you participate in the company's success (or setbacks) as an owner.",
    },
    quiz: {
      question: "What do you own when you buy a stock?",
      choices: [
        { id: "a", label: "A small ownership stake in a company" },
        { id: "b", label: "A loan the company must repay with fixed interest" },
        { id: "c", label: "A guaranteed monthly payment" },
      ],
      correctChoiceId: "a",
      explanation:
        "Stocks represent equity (ownership). Bonds are closer to loans with interest—different risk profile.",
    },
    copilotPrompt:
      "Explain what a stock is for a complete beginner. Use a simple analogy and avoid recommending specific companies to buy.",
  },
  {
    id: "what-is-etf",
    pathId: FIRST_INVESTOR_PATH_ID,
    order: 3,
    title: "What is an ETF?",
    subtitle: "One fund, many companies",
    durationMinutes: 4,
    sections: [
      {
        heading: "A basket you can trade",
        body: "An ETF (exchange-traded fund) holds a bundle of stocks or bonds and trades on an exchange like a single stock. Many ETFs track an index—such as hundreds of large U.S. companies in one ticker.",
      },
      {
        heading: "Why beginners often start here",
        body: "ETFs can spread money across many names quickly, which helps reduce reliance on any one company. Fees and tracking error still matter, so read the fund summary before investing real money.",
      },
    ],
    example: {
      title: "Playlist vs single song",
      body: "Buying one stock is like betting on one song. An index ETF is like a curated playlist of the market—still volatile, but less dependent on a single artist.",
    },
    quiz: {
      question: "What is a common benefit of a broad index ETF?",
      choices: [
        { id: "a", label: "Instant diversification across many companies" },
        { id: "b", label: "Zero market risk" },
        { id: "c", label: "Guaranteed profit every quarter" },
      ],
      correctChoiceId: "a",
      explanation:
        "Broad ETFs diversify across many holdings. They still go up and down with markets—no guarantees.",
    },
    copilotPrompt:
      "What is an ETF in plain English? Compare it briefly to owning a single stock, education only.",
  },
  {
    id: "risk-volatility",
    pathId: FIRST_INVESTOR_PATH_ID,
    order: 4,
    title: "Risk and volatility",
    subtitle: "Ups and downs are normal",
    durationMinutes: 5,
    sections: [
      {
        heading: "Volatility is movement",
        body: "Volatility means prices swing up and down. Higher volatility can mean larger short-term gains or losses. It is uncomfortable but normal in stocks and many ETFs.",
      },
      {
        heading: "Risk is the chance things go wrong",
        body: "Risk includes losing purchasing power, concentrating in one company, or needing cash during a downturn. Understanding your time horizon and comfort with swings helps you choose sensible allocations—educationally, not as personal advice.",
      },
    ],
    example: {
      title: "Roller coaster vs walkway",
      body: "A volatile stock might feel like a roller coaster. A savings account feels like a flat walkway—smoother, but inflation may erode buying power over decades.",
    },
    quiz: {
      question: "What does volatility describe?",
      choices: [
        { id: "a", label: "How much prices move up and down over time" },
        { id: "b", label: "A promise that prices only go up" },
        { id: "c", label: "The fee charged by a broker" },
      ],
      correctChoiceId: "a",
      explanation:
        "Volatility measures price movement. Higher volatility does not mean higher guaranteed returns.",
    },
    copilotPrompt:
      "Help me understand risk vs volatility as a beginner. Keep it educational with no buy or sell suggestions.",
  },
  {
    id: "diversification",
    pathId: FIRST_INVESTOR_PATH_ID,
    order: 5,
    title: "Diversification",
    subtitle: "Don't bet everything on one outcome",
    durationMinutes: 4,
    sections: [
      {
        heading: "Spreading exposure",
        body: "Diversification means spreading investments across companies, sectors, or asset types so one bad event does not sink the whole plan. It reduces concentration risk—not all risk.",
      },
      {
        heading: "Simple ways to diversify",
        body: "Index ETFs, mixing sectors, and avoiding oversized bets in a single stock are common educational examples. Real portfolios still need periodic review.",
      },
    ],
    example: {
      title: "Exam prep across subjects",
      body: "Studying only one subject before finals is risky. Diversifying study time across courses is like diversifying investments—you are less exposed if one area surprises you.",
    },
    quiz: {
      question: "What is diversification mainly meant to reduce?",
      choices: [
        { id: "a", label: "Concentration in a single company or bet" },
        { id: "b", label: "All investment risk completely" },
        { id: "c", label: "Taxes on dividends" },
      ],
      correctChoiceId: "a",
      explanation:
        "Diversification spreads risk; it cannot eliminate market risk or guarantee profits.",
    },
    copilotPrompt:
      "Explain diversification with a simple student-friendly analogy. No stock picks please.",
  },
  {
    id: "long-term-habits",
    pathId: FIRST_INVESTOR_PATH_ID,
    order: 6,
    title: "Long-term investing habits",
    subtitle: "Consistency beats timing",
    durationMinutes: 4,
    sections: [
      {
        heading: "Habits over hype",
        body: "Regular contributions, learning before leaping, and avoiding panic selling during dips are habits many long-term investors cultivate. Missing the best market days often hurts more than missing the worst.",
      },
      {
        heading: "What you can control",
        body: "You control savings rate, fees, diversification, and how much news you consume. You cannot control daily headlines. Build a routine that fits student life—small, steady steps count.",
      },
    ],
    example: {
      title: "Gym membership mindset",
      body: "Skipping the gym for a month then sprinting one weekend rarely works. Investing habits are similar—steady contributions and patience tend to beat frantic all-in bets.",
    },
    quiz: {
      question: "Which habit best supports long-term investing education?",
      choices: [
        { id: "a", label: "Consistent contributions and patience" },
        { id: "b", label: "Chasing every viral stock tip" },
        { id: "c", label: "Selling everything after one red day" },
      ],
      correctChoiceId: "a",
      explanation:
        "Consistency and patience are widely taught principles. Chasing hype or panic selling often undermines long-term plans.",
    },
    copilotPrompt:
      "What are healthy long-term investing habits for a student? Educational only, no financial advice.",
  },
  {
    id: "first-portfolio-readiness",
    pathId: FIRST_INVESTOR_PATH_ID,
    order: 7,
    title: "First portfolio readiness",
    subtitle: "Checklist before real money",
    durationMinutes: 5,
    sections: [
      {
        heading: "Know your basics",
        body: "Before real money, understand what you own, why you own it, and how long you plan to invest. Emergency cash, basic budgeting, and comfort with volatility are practical checkpoints.",
      },
      {
        heading: "Practice vs real portfolio",
        body: "MarketMate lets you learn and use a Practice Portfolio separately from My Portfolio. Practice is for experiments; My Portfolio is for tracking real holdings you enter yourself.",
      },
    ],
    example: {
      title: "Ready when…",
      body: "You can explain the difference between a stock and ETF, you know diversification basics, and you have a small amount you could afford not to touch for several years—only then consider real investing with a licensed provider.",
    },
    quiz: {
      question: "What should a beginner understand before investing real money?",
      choices: [
        { id: "a", label: "What they own, why, and their time horizon" },
        { id: "b", label: "A secret formula for guaranteed gains" },
        { id: "c", label: "How to day-trade every lunch break" },
      ],
      correctChoiceId: "a",
      explanation:
        "Clarity on holdings, purpose, and time horizon matters. No formula guarantees returns.",
    },
    copilotPrompt:
      "What should a university student check before building a first real portfolio? Keep it educational, not prescriptive buy/sell advice.",
  },
];

export function getLessonById(id: string): LessonContent | undefined {
  return FIRST_INVESTOR_LESSONS.find((l) => l.id === id);
}

export function getLessonsForPath(pathId: string): LessonContent[] {
  if (pathId !== FIRST_INVESTOR_PATH_ID) return [];
  return [...FIRST_INVESTOR_LESSONS].sort((a, b) => a.order - b.order);
}
