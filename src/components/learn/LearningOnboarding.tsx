"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ExperienceLevel, LearningGoal } from "@/types/learning";
import { FIRST_INVESTOR_PATH_ID } from "@/types/learning";

interface LearningOnboardingProps {
  saving?: boolean;
  onComplete: (profile: {
    experienceLevel: ExperienceLevel;
    learningGoal: LearningGoal;
    onboardingCompleted: boolean;
    activePathId: string;
  }) => Promise<void>;
}

export function LearningOnboarding({ saving, onComplete }: LearningOnboardingProps) {
  const router = useRouter();
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [goal, setGoal] = useState<LearningGoal | "">("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experience || !goal) {
      setError("Please choose both options to continue.");
      return;
    }
    setError(null);
    await onComplete({
      experienceLevel: experience,
      learningGoal: goal,
      onboardingCompleted: true,
      activePathId: FIRST_INVESTOR_PATH_ID,
    });
    if (experience === "brand_new") {
      router.refresh();
    }
  };

  return (
    <section className="mx-auto max-w-lg glass-card p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-accent shadow-lg shadow-accent/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </span>
        <div>
          <h1 className="text-xl font-bold">Welcome to Learn</h1>
          <p className="text-sm text-muted">Tell us where you&apos;re starting from</p>
        </div>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">
            Your investing experience
          </legend>
          {(
            [
              ["brand_new", "I'm brand new to investing"],
              ["some_knowledge", "I know a little already"],
              ["experienced", "I'm fairly experienced"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                experience === value
                  ? "border-accent/40 bg-accent/10"
                  : "border-border bg-surface-elevated/30 hover:bg-white/5"
              }`}
            >
              <input
                type="radio"
                name="experience"
                value={value}
                checked={experience === value}
                onChange={() => setExperience(value)}
                className="accent-accent"
              />
              {label}
            </label>
          ))}
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-foreground">
            What do you want from MarketMate?
          </legend>
          {(
            [
              ["learn_basics", "Understand the basics calmly"],
              ["mock_portfolio", "Build a mock starter portfolio"],
              ["track_investments", "Track real investments I already own"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                goal === value
                  ? "border-accent/40 bg-accent/10"
                  : "border-border bg-surface-elevated/30 hover:bg-white/5"
              }`}
            >
              <input
                type="radio"
                name="goal"
                value={value}
                checked={goal === value}
                onChange={() => setGoal(value)}
                className="accent-accent"
              />
              {label}
            </label>
          ))}
        </fieldset>

        {error && (
          <p className="text-sm text-loss rounded-xl border border-loss/30 bg-loss-muted px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={saving}>
          Start learning
        </Button>
      </form>
    </section>
  );
}
