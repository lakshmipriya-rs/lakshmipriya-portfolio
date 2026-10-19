import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { FlowStep } from "../data/content";
import { useInView, usePrefersReducedMotion } from "../lib/motion";

/** Delay after the flow scrolls into view before the first step advances. */
const START_DELAY_MS = 1000;
/** How long each step stays active before the flow moves on. */
const STEP_MS = 2500;

type Status = "idle" | "running" | "stopped" | "done";

const pad = (value: number) => String(value).padStart(2, "0");

interface CaseFlowProps {
  caseId: string;
  steps: FlowStep[];
}

/** CI-style "how it works" run: auto-plays on scroll, one step at a time. */
export function CaseFlow({ caseId, steps }: CaseFlowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.35 });
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [held, setHeld] = useState(false);

  // Start automatically the first time the flow is scrolled into view.
  useEffect(() => {
    if (reduced || status !== "idle" || !inView) return;
    const timer = window.setTimeout(() => setStatus("running"), START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [reduced, status, inView]);

  // Advance one step at a time; pause while off-screen or while the reader
  // hovers / focuses the flow so longer step descriptions can be read.
  useEffect(() => {
    if (status !== "running" || !inView || held) return;
    const timer = window.setTimeout(() => {
      if (active >= steps.length - 1) setStatus("done");
      else setActive(active + 1);
    }, STEP_MS);
    return () => window.clearTimeout(timer);
  }, [status, inView, held, active, steps.length]);

  const play = () => {
    if (status === "done" || active >= steps.length - 1) setActive(0);
    setStatus("running");
  };

  const selectStep = (index: number) => {
    setActive(index);
    setStatus("stopped");
  };

  const statusLabel =
    status === "running"
      ? held
        ? "paused"
        : "running"
      : status === "done"
        ? "passed"
        : status === "stopped"
          ? "paused"
          : "queued";

  return (
    <div
      className="flow"
      ref={ref}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setHeld(false);
      }}
    >
      <div className="flow-toolbar">
        <p className="flow-heading" id={`${caseId}-flow`}>
          <span className="sr-only">How it works: </span>
          <span aria-hidden="true">
            <span className="prompt-sign">$</span> pipeline run{" "}
            <span className="flow-heading-arg">--case {caseId}</span>
          </span>
        </p>
        <div className="flow-status">
          <span className="flow-status-text" data-status={statusLabel}>
            {statusLabel}
          </span>
          {status === "running" ? (
            <button
              className="flow-control"
              type="button"
              onClick={() => setStatus("stopped")}
            >
              <Pause size={12} aria-hidden="true" /> pause
            </button>
          ) : status === "done" ? (
            <button className="flow-control" type="button" onClick={play}>
              <RotateCcw size={12} aria-hidden="true" /> replay
            </button>
          ) : (
            <button className="flow-control" type="button" onClick={play}>
              <Play size={12} aria-hidden="true" /> run
            </button>
          )}
        </div>
      </div>

      <div className="flow-body">
        <ol className="flow-steps" aria-labelledby={`${caseId}-flow`}>
          {steps.map((step, index) => {
            const done = status === "done" || index < active;
            const current = status !== "done" && index === active;
            const state = done ? "done" : current ? "current" : "upcoming";
            return (
              <li className={`flow-step-item ${state}`} key={step.id}>
                <button
                  className={`flow-step ${state}`}
                  type="button"
                  onClick={() => selectStep(index)}
                  aria-current={index === active ? "step" : undefined}
                  aria-controls={`${caseId}-step-${step.id}`}
                >
                  <span className="flow-step-mark" aria-hidden="true">
                    {done ? "✓" : current ? "▸" : "○"}
                  </span>
                  <span className="flow-step-index" aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <span className="flow-step-label">{step.label}</span>
                  <span className="flow-step-state" aria-hidden="true">
                    {done ? "ok" : current ? "run" : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="flow-detail">
          {steps.map((step, index) => (
            <div
              className="flow-detail-card"
              id={`${caseId}-step-${step.id}`}
              key={step.id}
              data-active={index === active}
              aria-hidden={index !== active}
            >
              <p className="flow-detail-kicker">
                [step {pad(index + 1)}/{pad(steps.length)}]
              </p>
              <h4 className="flow-detail-title">{step.label}</h4>
              <p className="flow-detail-summary">{step.summary}</p>
              <div className="flow-detail-tools">
                <span className="flow-tools-label" aria-hidden="true">
                  tools:
                </span>
                <ul className="chip-list" aria-label="Tools used in this step">
                  {step.tools.map((tool) => (
                    <li className="chip chip-sm" key={tool}>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
