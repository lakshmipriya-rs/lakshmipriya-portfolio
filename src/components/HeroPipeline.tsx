import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { content } from "../data/content";
import { useInView, usePrefersReducedMotion } from "../lib/motion";
import { TermBar } from "./Terminal";

const STAGE_MS = 1600;
const HOLD_MS = 2400;
const TARGET_SECONDS = 14 * 60;

const formatClock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

/**
 * Illustrative, looping run of the VM provisioning pipeline.
 * Every log line is always rendered (hidden until reached) so the pane keeps
 * a fixed height and never pushes the page content around while it animates.
 */
export function HeroPipeline() {
  const paneRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(paneRef, { threshold: 0.2 });
  const { caseId, hints, logs } = content.heroPipeline;
  const stages = content.cases.find((item) => item.id === caseId)?.steps ?? [];
  const runDuration = stages.length * STAGE_MS;

  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  const animating = !reduced && !paused && !hovered && !focused && inView;

  useEffect(() => {
    if (!animating) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const delta = now - last;
      last = now;
      setElapsed((current) =>
        current + delta >= runDuration + HOLD_MS ? 0 : current + delta,
      );
    }, 100);
    return () => window.clearInterval(timer);
  }, [animating, runDuration]);

  const progress = reduced ? runDuration : elapsed;
  const completed = progress >= runDuration;
  const active = completed
    ? stages.length - 1
    : Math.min(Math.floor(progress / STAGE_MS), stages.length - 1);
  const shownLogs = completed ? logs.length : Math.min(active + 1, logs.length);
  const clock = formatClock(
    Math.round(Math.min(progress / runDuration, 1) * TARGET_SECONDS),
  );

  const togglePlayback = () => {
    if (paused) {
      if (completed || selected !== null) setElapsed(0);
      setSelected(null);
      setPaused(false);
    } else {
      setPaused(true);
    }
  };

  const chooseStage = (index: number) => {
    setPaused(true);
    setSelected(index);
    setElapsed(index * STAGE_MS);
  };

  return (
    <section
      className="term hero-pipeline"
      ref={paneRef}
      aria-label="Illustrative VM provisioning pipeline run"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setFocused(false);
      }}
    >
      <TermBar
        title="~/pipelines/vm-provisioning"
        meta={
          <>
            <i className="live-dot" aria-hidden="true" /> simulated
          </>
        }
      >
        {reduced ? null : (
          <button
            className="pipeline-toggle"
            type="button"
            onClick={togglePlayback}
            aria-label={paused ? "Play pipeline" : "Pause pipeline"}
          >
            {paused ? <Play size={12} /> : <Pause size={12} />}
          </button>
        )}
      </TermBar>

      <div className="term-body">
        <p className="pipeline-run" aria-hidden="true">
          <span className="prompt-sign">$</span> pipeline run vm-provisioning{" "}
          <span className="pipeline-run-id">#1042</span>
        </p>
        <ol className="pipeline-stages">
          {stages.map((stage, index) => {
            const done = completed || index < active;
            const current = !done && index === active;
            const state = done ? "done" : current ? "active" : "pending";
            return (
              <li key={stage.id}>
                <button
                  className={`pipeline-stage ${state}`}
                  type="button"
                  onClick={() => chooseStage(index)}
                  aria-pressed={selected === index}
                  aria-label={`${stage.label}: ${done ? "complete" : current ? "running" : "pending"}`}
                >
                  <span className="pipeline-mark" aria-hidden="true">
                    {done ? "✓" : current ? "▸" : "○"}
                  </span>
                  <span className="pipeline-stage-copy">
                    <strong>{stage.label}</strong>
                    <small>{hints[stage.id] ?? ""}</small>
                  </span>
                  <span className="pipeline-state" aria-hidden="true">
                    {done ? "ok" : current ? "run" : "wait"}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <div className="pipeline-clock">
          <span>
            {completed ? "✓ ready · handoff complete" : `elapsed ${clock}`}
          </span>
          <span>target ~14:00</span>
        </div>

        <div className="pipeline-logs" aria-hidden="true">
          <p className="pipeline-logs-title">$ tail -f provision.log</p>
          {logs.map((log, index) => (
            <p
              className={[
                "pipeline-log",
                index < shownLogs ? "shown" : "",
                index === shownLogs - 1 ? "latest" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={log.time}
            >
              <span>{log.time}</span>
              {log.message}
            </p>
          ))}
        </div>
        <p className="pipeline-note"># illustrative log · time compressed</p>
      </div>
    </section>
  );
}
