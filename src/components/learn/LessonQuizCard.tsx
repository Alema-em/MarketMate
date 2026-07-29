"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LessonQuiz } from "@/types/learning";

interface LessonQuizCardProps {
  quiz: LessonQuiz;
  onAnswered: (passed: boolean) => void;
  disabled?: boolean;
}

export function LessonQuizCard({
  quiz,
  onAnswered,
  disabled,
}: LessonQuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const passed = submitted && selected === quiz.correctChoiceId;

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    onAnswered(selected === quiz.correctChoiceId);
  };

  return (
    <section className="glass-card space-y-4 p-5 sm:p-6" aria-labelledby="quiz-heading">
      <h2 id="quiz-heading" className="text-lg font-semibold">
        Quick check
      </h2>
      <p className="text-sm text-foreground">{quiz.question}</p>
      <ul className="space-y-2" role="list">
        {quiz.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isCorrect = choice.id === quiz.correctChoiceId;
          let ring = "ring-border hover:ring-accent/30";
          if (submitted && isSelected && isCorrect) {
            ring = "ring-gain/40 bg-gain-muted";
          } else if (submitted && isSelected && !isCorrect) {
            ring = "ring-loss/40 bg-loss-muted";
          } else if (isSelected) {
            ring = "ring-accent/40 bg-accent/10";
          }

          return (
            <li key={choice.id}>
              <button
                type="button"
                disabled={disabled || submitted}
                onClick={() => setSelected(choice.id)}
                className={`w-full rounded-xl border border-border bg-surface-elevated/40 px-4 py-3 text-left text-sm transition-all ring-2 ring-transparent ${ring} disabled:cursor-default`}
              >
                {choice.label}
              </button>
            </li>
          );
        })}
      </ul>
      {!submitted ? (
        <Button
          onClick={handleSubmit}
          disabled={!selected || disabled}
          className="w-full sm:w-auto"
        >
          Check answer
        </Button>
      ) : (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            passed
              ? "border-gain/30 bg-gain-muted text-gain"
              : "border-amber-500/30 bg-amber-500/10 text-amber-100"
          }`}
          role="status"
        >
          <p className="flex items-center gap-2 font-medium">
            {passed ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 shrink-0" />
            )}
            {passed ? "Correct!" : "Not quite — here's why:"}
          </p>
          <p className="mt-2 text-muted leading-relaxed">{quiz.explanation}</p>
        </div>
      )}
    </section>
  );
}
