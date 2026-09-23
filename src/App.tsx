import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  Command,
  Download,
  Mail,
  Menu,
  Moon,
  Pause,
  Play,
  Sun,
  X,
} from "lucide-react";
import {
  allTags,
  content,
  type CaseStudy,
  type CaseTag,
} from "./data/content";

const base = import.meta.env.BASE_URL;
const buildTime = import.meta.env.VITE_BUILD_TIME ?? "unknown";
const caseMatchesTool = (item: CaseStudy, tool: string) =>
  item.stack.some(
    (entry) =>
      entry.toLowerCase().includes(tool.toLowerCase()) ||
      tool.toLowerCase().includes(entry.toLowerCase()),
  );
const toolIndexedCases = content.cases.slice(2);
const experienceForTool = (tool: string) =>
  content.experience.find((item) => item.stack.includes(tool));

function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: string;
}) {
  return (
    <p className="section-label">
      <span>{index}</span>
      {children}
    </p>
  );
}

function CountMetric({
  value,
  detail,
  onClick,
  caseTitle,
}: {
  value: string;
  detail: string;
  onClick?: () => void;
  caseTitle?: string;
}) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    if (!/^\s*[~$]?\d+(?:\.\d+)?\s*[%+]?\s*$/.test(value)) return;
    const numeric = Number.parseFloat(value.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(numeric)) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1);
      const next = numeric * (1 - Math.pow(1 - progress, 3));
      const prefix = value.startsWith("$")
        ? "$"
        : value.startsWith("~")
          ? "~"
          : "";
      const suffix = value.includes("%")
        ? "%"
        : value.includes("+")
          ? "+"
          : value.includes(" min")
            ? " min"
            : "";
      setDisplay(
        `${prefix}${Number.isInteger(numeric) ? Math.round(next) : next.toFixed(2)}${suffix}`,
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  const contentNode = (
    <>
      <strong>{display}</strong>
      <span>{detail}</span>
    </>
  );
  return onClick ? (
    <button
      className="metric metric-button"
      onClick={onClick}
      title={caseTitle}
    >
      {contentNode}
      <span className="metric-tip">open {caseTitle}</span>
    </button>
  ) : (
    <div className="metric">{contentNode}</div>
  );
}

function FilterChips({
  active,
  select,
  tools,
}: {
  active: string;
  select: (tag: string) => void;
  tools?: string[];
}) {
  const chips = tools ?? allTags;
  return (
    <div className="filter-row" aria-label="Filter case studies">
      <button
        className={active === "all" ? "filter active" : "filter"}
        onClick={() => select("all")}
      >
        all
      </button>
      {chips.map((tag) => (
        <button
          className={active === tag ? "filter active" : "filter"}
          key={tag}
          onClick={() => select(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

function HeroPipelineCard() {
  const cardRef = useRef<HTMLElement>(null);
  const stages = content.cases.find((item) => item.id === "vm-provisioning")?.steps ?? [];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stageDuration = 1600;
  const runDuration = stages.length * stageDuration;
  const [elapsed, setElapsed] = useState(reduced ? runDuration : 0);
  const [paused, setPaused] = useState(reduced);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onVisibility = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  useEffect(() => {
    if (reduced || paused || hovered || focused || !visible) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      setElapsed((current) => {
        const next = current + now - last;
        last = now;
        return next >= runDuration + 2000 ? 0 : Math.min(next, runDuration + 2000);
      });
    }, 50);
    return () => window.clearInterval(timer);
  }, [focused, hovered, paused, reduced, runDuration, visible]);

  const completed = elapsed >= runDuration;
  const active = completed ? stages.length - 1 : Math.min(Math.floor(elapsed / stageDuration), stages.length - 1);
  const visibleLogs = reduced ? content.pipelineLogs : content.pipelineLogs.slice(0, Math.min(content.pipelineLogs.length, active + 1));
  const clockSeconds = Math.round(Math.min(elapsed / runDuration, 1) * 14 * 60);
  const clock = `${String(Math.floor(clockSeconds / 60)).padStart(2, "0")}:${String(clockSeconds % 60).padStart(2, "0")}:00`;
  const reset = () => {
    setElapsed(0);
    setSelected(null);
    setPaused(false);
  };
  const chooseStage = (index: number) => {
    setPaused(true);
    setSelected(index);
    setElapsed(index * stageDuration);
  };
  return (
    <section
      className="hero-pipeline"
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
      }}
      aria-label="Illustrative VM provisioning pipeline"
    >
      <div className="pipeline-header">
        <span>vm-provisioning</span>
        <span className="pipeline-badge"><i /> simulated run</span>
        <button className="pipeline-toggle" onClick={() => (paused ? reset() : setPaused(true))} aria-label={paused ? "Play pipeline" : "Pause pipeline"}>
          {paused ? <Play size={13} /> : <Pause size={13} />}
        </button>
      </div>
      <div className="pipeline-stages">
        {stages.map((stage, index) => {
          const done = reduced || index < active || completed;
          const isActive = !done && index === active;
          return (
            <div className="pipeline-stage-row" key={stage.id}>
              {index > 0 ? <span className={done || isActive ? "pipeline-connector flowing" : "pipeline-connector"} /> : null}
              <button className={`pipeline-stage ${done ? "done" : isActive ? "active" : ""}`} onClick={() => chooseStage(index)} aria-pressed={selected === index}>
                <span className="pipeline-stage-mark">{done ? <span>✓</span> : isActive ? <i /> : null}</span>
                <span><strong>{stage.label}</strong><small>{stage.id === "request" ? "self-service · RBAC" : stage.id === "placement" ? "vSphere · ESXi" : stage.id === "network" ? "IPAM · DNS" : stage.id === "configure" ? "Windows · Ansible · WinRM" : stage.id === "environment" ? "environment-specific config" : "handoff"}</small></span>
              </button>
            </div>
          );
        })}
      </div>
      <div className="pipeline-clock"><span>{completed ? "ready" : `${clock} elapsed`}</span><span>target ~14 min</span></div>
      <div className="pipeline-logs" aria-live="polite">
        {visibleLogs.map((log) => <p className="pipeline-log" key={log.time}><span>{log.time}</span>{log.message}</p>)}
      </div>
      <p className="pipeline-note">illustrative log · time compressed</p>
      <div className="pipeline-metrics">
        {content.metrics.map((metric) => <CountMetric key={metric.detail} value={metric.value} detail={metric.detail} />)}
      </div>
    </section>
  );
}

function CaseDetail({
  item,
  onClose,
}: {
  item: CaseStudy;
  onClose?: () => void;
}) {
  const [selected, setSelected] = useState(0);
  const [running, setRunning] = useState(true);
  const [completed, setCompleted] = useState(false);
  useEffect(() => {
    if (!running) return;
    let cursor = 0;
    const timer = window.setInterval(() => {
      setSelected(cursor);
      cursor += 1;
      if (cursor >= item.steps.length) {
        window.clearInterval(timer);
        setRunning(false);
        setCompleted(true);
      }
    }, 1200);
    return () => window.clearInterval(timer);
  }, [item.steps.length, running]);

  const caseDefaults: Record<string, { problem: string; result: string; next: string }> = {
    "vm-provisioning": {
      problem: "Manual coordination delayed every VM request by days",
      result: "7 days → ~14 min · 7+ steps automated · 15+ VMs",
      next: "More products and VM templates with requirement-based selection"
    },
    "environment-navigator": {
      problem: "Fleet operations and connectivity were spread across multiple systems",
      result: "453+ Windows servers · FA-EAM + M5 · centralized operations",
      next: "Expand M5 workflows and automate more provisioning paths"
    },
    "config-drift": {
      problem: "Manual audits could not scale across shared tenants",
      result: "144+ files · 13 servers · 64 tenants · 15 min cycle",
      next: "Expand customer coverage and provide deeper configuration-drift details"
    },
    "synthetic-testing": {
      problem: "No repeatable way to validate 169+ customers post-change",
      result: "169+ customers · checks every 5–10 min · self-service YAML",
      next: "Standardize test configurations and improve failure reporting and diagnosis"
    },
    "eks-platform": {
      problem: "Platform needed stronger scaling, reliability, and cost visibility",
      result: "$700 → $450/month · 45% less downtime · images 35% smaller",
      next: "Improve autoscaling and observability with stronger platform SLOs"
    },
    "mlops": {
      problem: "Millions of logs made abnormal production behavior hard to detect",
      result: "Millions of logs · Isolation Forest · automated anomaly detection",
      next: "Expand anomaly detection with richer signals and more actionable alerts"
    },
    "event-organizer": {
      problem: "No repeatable path from infrastructure definition to production",
      result: "10+ deploys/day · self-healing sync · 99.9% uptime",
      next: "Verify RDS backup and restore workflows"
    }
  };
  const caseInfo = caseDefaults[item.id] || { problem: item.problem, result: item.result, next: "iterate" };

  return (
    <div className="case-detail">
      <div 
        className="detail-zone identity" 
        onClick={() => onClose ? onClose() : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClose) {
            e.preventDefault();
            onClose();
          }
        }}
        role={onClose ? "button" : undefined}
        tabIndex={onClose ? 0 : -1}
        style={{ cursor: onClose ? 'pointer' : 'default' }}>
        <div className="detail-eyebrow">CASE {item.index} · {item.phase} <span className={`tool-chip case-tag ${item.tags[0]}`}>{item.tags[0]}</span></div>
        <h3 id={`case-${item.id}`} className="case-title large">{item.title}</h3>
        {item.impact ? <p className="case-impact">{item.impact}</p> : null}
      </div>

      <div className="detail-zone live-flow">
        <div className="flow-controls-row">
          <button className="flow-control-btn" onClick={() => { setRunning(false); setSelected(0); setRunning(true); setCompleted(false); document.querySelector('.case-detail')?.scrollIntoView({ behavior: 'smooth' }); }}>Run flow</button>
          <button className="flow-control-btn" onClick={() => setRunning((v) => !v)} aria-pressed={running}>{running ? "Auto-flow: On" : "Auto-flow"}</button>
        </div>
        <div className="flow-stepper">
          {item.steps.flatMap((s, i) => {
            const isLast = i === item.steps.length - 1;
            const isPassed = i < selected || (i === selected && isLast) || (completed && isLast);
            const nextIsPassed = i < item.steps.length - 1 && (i + 1 <= selected || (completed && i + 1 === item.steps.length - 1));
            return [
              <div key={`node-${s.id}`} className="flow-node-wrapper">
                <button
                  className={`flow-node-circle ${isPassed ? "passed" : i === selected ? "selected" : ""}`}
                  onClick={() => { setSelected(i); setRunning(false); }}
                  aria-pressed={i === selected}
                >
                  {i + 1}
                </button>
                <div className="flow-node-label">{s.label}</div>
              </div>,
              !isLast && <div key={`connector-${s.id}`} className={`flow-connector ${nextIsPassed ? "passed" : ""}`} />
            ];
          })}
        </div>
        {item.steps[selected] && (
          <div className="flow-detail-row active">
            <div className="flow-detail">&gt; {item.steps[selected].summary}</div>
          </div>
        )}
        {!item.steps[selected] && (
          <div className="flow-detail-row" />
        )}
      </div>

      <div className="detail-zone definition-list">
        <div className="tf-caption">// case summary</div>
        <div className="def-row">
          <div className="def-label">problem</div>
          <div className="def-value">{caseInfo.problem}</div>
        </div>
        <div className="def-row">
          <div className="def-label">result</div>
          <div className="def-value">{caseInfo.result}</div>
        </div>
        <div className="def-row">
          <div className="def-label">next</div>
          <div className="def-value">{caseInfo.next}</div>
        </div>
      </div>
    </div>
  );
}

function CaseIndex({
  openCase,
  setOpenCase,
  selectedTag,
  setSelectedTag,
}: {
  openCase: string | null;
  setOpenCase: (id: string | null) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
}) {
  const [search, setSearch] = useState("");
  const displayTagMap: Record<string, string> = {
    "vm-provisioning": "provisioning",
    "environment-navigator": "fleet",
    "config-drift": "reliability",
    "synthetic-testing": "validation",
    epilogue: "observability",
    "event-organizer": "gitops",
    "mlops": "mlops",
  } as const;

  const filtered = content.cases.filter((item) => {
    const matchesTag =
      selectedTag === "all" ||
      item.tags.includes(selectedTag as CaseTag) ||
      caseMatchesTool(item, selectedTag) ||
      (displayTagMap[item.id] ?? item.phase) === selectedTag;
    const matchesSearch = `${item.title} ${item.company} ${item.stack.join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });
  
  const desiredTags = [
    "provisioning",
    "fleet",
    "reliability",
    "validation",
    "observability",
    "gitops",
    "cost",
  ];
  const toolsToShow = desiredTags.filter((tag) =>
    content.cases.some((item) => (displayTagMap[item.id] ?? item.phase) === tag || item.tags.includes(tag as CaseTag)),
  );
  useEffect(() => {
    const onSlash = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") {
        event.preventDefault();
        document.getElementById("case-search")?.focus();
      }
    };
    window.addEventListener("keydown", onSlash);
    return () => window.removeEventListener("keydown", onSlash);
  }, []);
  useEffect(() => {
    if (!openCase) return;
    const timer = window.setTimeout(() => {
      document.getElementById(`case-${openCase}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    }, 40);
    return () => window.clearTimeout(timer);
  }, [openCase]);
  return (
    <section className="section-wrap cases-section" id="cases">
      <div className="section-intro">
        <SectionLabel index="01">ls -la ./cases</SectionLabel>
        <h2>Case Studies</h2>
        <p>
          Filter the index, then open a case for its architecture, flow, and
          postmortem. Every unknown stays marked for confirmation.
        </p>
      </div>
      <div className="index-toolbar">
        <FilterChips active={selectedTag} select={setSelectedTag} tools={toolsToShow} />
        <label className="search-box">
          <span>/</span>
          <input
            id="case-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="filter cases"
          />
        </label>
      </div>
      {selectedTag !== "all" ? (
        <div className="filter-banner">
          Showing {filtered.length} {filtered.length === 1 ? "case" : "cases"}{" "}
          using {selectedTag}
          <button onClick={() => setSelectedTag("all")}>clear filter</button>
        </div>
      ) : null}
      <div className="case-index-list">
        {filtered.map((item) => {
          const displayTagMap: Record<string, string> = {
            "vm-provisioning": "provisioning",
            "environment-navigator": "fleet",
            "config-drift": "reliability",
            "synthetic-testing": "validation",
            epilogue: "observability",
            "event-organizer": "gitops",
            "mlops": "mlops",
          } as const;
          const displayTag = displayTagMap[item.id] ?? item.phase;
          return (
            <article
              className={
                openCase === item.id ? "experience-item case-card expanded" : "experience-item case-card"
              }
              id={`case-${item.id}`}
              key={item.id}
            >
              {openCase === item.id ? (
                <CaseDetail item={item} onClose={() => setOpenCase(null)} />
              ) : (
                <button
                  className="case-card-trigger"
                  aria-expanded={false}
                  onClick={() => setOpenCase(item.id)}
                >
                  <div className="case-left">
                    <span className={`tool-chip case-tag ${displayTag}`}>{displayTag}</span>
                    <span className="case-year">2026</span>
                  </div>
                  <div className="case-main">
                    <h3 className="case-title">{item.title}</h3>
                    <p className="case-desc">{item.result}</p>
                    <div className="case-metrics">
                      {item.metrics.slice(0, 3).map((m) => `${m.value} ${m.detail}`).join(" · ")}
                    </div>
                  
                  </div>
                  <div className="case-right">
                    <span className="case-arrow" aria-hidden>
                      →
                    </span>
                  </div>
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function StackManifest({
  selectedTag,
  setSelectedTag,
  onTool = (tool) => {
    setSelectedTag?.(selectedTag === tool ? "all" : tool);
    window.setTimeout(
      () =>
        document
          .getElementById("cases")
          ?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
            block: "start",
          }),
      0,
    );
  },
  onExperience = (hash) => {
    Array.from(
      document.querySelectorAll<HTMLButtonElement>(".experience-trigger"),
    )
      .find((button) => button.textContent?.includes(hash))
      ?.click();
    window.setTimeout(
      () =>
        document
          .getElementById("experience")
          ?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "auto"
              : "smooth",
            block: "start",
          }),
      0,
    );
  },
}: {
  selectedTag: string;
  setSelectedTag?: (tool: string) => void;
  onTool?: (tool: string) => void;
  onExperience?: (hash: string) => void;
}) {
  const counts = (tool: string) =>
    toolIndexedCases.filter((item) => caseMatchesTool(item, tool)).length;
  return (
    <section className="section-wrap capabilities" id="capabilities">
      <div className="section-intro">
        <SectionLabel index="02">cat stack.yaml</SectionLabel>
        <h2>Tools, indexed by use.</h2>
        <p>
          Click a tool to focus the relevant work. Tools without an indexed
          entry route to the experience log.
        </p>
      </div>
      <div className="manifest">
        <div className="manifest-top">
          <span>stack.yaml</span>
          <span>
            {selectedTag === "all" ? "all tools" : `filter: ${selectedTag}`}
          </span>
        </div>
        {Object.entries(content.capabilities).map(([group, items]) => (
          <div className="manifest-group" key={group}>
            <span className="manifest-key">
              {group.toLowerCase().replaceAll(" ", "_")}
            </span>
            <div>
              {items.map((tool) => {
                const count = counts(tool);
                const experience = experienceForTool(tool);
                return (
                  <button
                    className={
                      selectedTag === tool ? "tool-chip selected" : "tool-chip"
                    }
                    key={tool}
                    onClick={() =>
                      count
                        ? onTool(tool)
                        : experience
                          ? onExperience(experience.hash)
                          : undefined
                    }
                  >
                    {tool}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience({
  open,
  setOpen,
}: {
  open: string | null;
  setOpen: (id: string | null) => void;
}) {
  return (
    <section className="section-wrap experience-section" id="experience">
      <div className="section-intro">
        <SectionLabel index="03">git log --oneline</SectionLabel>
        <h2>Experience</h2>
      </div>
      <div className="experience-list">
        {content.experience.map((item) => (
          <article className="experience-item" key={item.hash}>
            <button
              className="experience-trigger"
              aria-expanded={open === item.hash}
              onClick={() => setOpen(open === item.hash ? null : item.hash)}
            >
              <span className="hash">{item.hash}</span>
              <span>{item.dates}</span>
              <strong>{item.company}</strong>
              <span>{item.role}</span>
              <ChevronDown
                className={open === item.hash ? "rotated" : ""}
                size={15}
              />
            </button>
            {open === item.hash ? (
              <div className="experience-detail">
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <div className="stack">
                  {item.stack.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function CommandPalette({
  open,
  close,
  setCase,
  toggleTheme,
}: {
  open: boolean;
  close: () => void;
  setCase: (id: string) => void;
  toggleTheme: () => void;
}) {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [mode, setMode] = useState<"yaml" | "json" | "plain">("yaml");
  const inputRef = useRef<HTMLInputElement>(null);
  const commands = [
    "whoami",
    "ls cases",
    ...content.cases.map((item) => `open ${item.id}`),
    "cat resume.yaml",
    "stack",
    "log",
    "contact",
    "theme",
    "help",
    "clear",
  ];
  const filtered = commands.filter((command) =>
    command.includes(query.toLowerCase()),
  );
  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && filtered[0]) {
        const command = filtered[0];
        setHistory((items) => [command, ...items].slice(0, 5));
        if (command === "clear") setHistory([]);
        if (command === "theme") toggleTheme();
        if (command === "contact")
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" });
        if (command === "stack")
          document
            .getElementById("capabilities")
            ?.scrollIntoView({ behavior: "smooth" });
        if (command === "log")
          document
            .getElementById("experience")
            ?.scrollIntoView({ behavior: "smooth" });
        if (command === "ls cases")
          document
            .getElementById("cases")
            ?.scrollIntoView({ behavior: "smooth" });
        if (command.startsWith("open")) {
          const target = content.cases.find(
            (item) => command === `open ${item.id}`,
          );
          if (target) setCase(target.id);
        }
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, filtered, open, setCase, toggleTheme]);
  if (!open) return null;
  const yaml = `name: ${content.name}\nrole: ${content.role}\nlocation: ${content.location}\nopen_to_relocation: true`;
  const output =
    mode === "yaml"
      ? yaml
      : mode === "json"
        ? JSON.stringify(
            {
              name: content.name,
              role: content.role,
              location: content.location,
            },
            null,
            2,
          )
        : `${content.name}\n${content.role}\n${content.location}`;
  return (
    <div className="console-backdrop">
      <div
        className="console"
        role="dialog"
        aria-modal="true"
        aria-label="Operations console"
      >
        <div className="console-input">
          <span>lakshmi@ops:~$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="type a command..."
            aria-label="Command input"
          />
        </div>
        <div className="command-list">
          {filtered.map((command, index) => (
            <button
              className={index === 0 ? "command active" : "command"}
              key={command}
              onClick={() => {
                setQuery(command);
              }}
            >
              <span>{command}</span>
              <small>{index === 0 ? "press enter to run" : ""}</small>
              <kbd>{index === 0 ? "ENTER" : ""}</kbd>
            </button>
          ))}
        </div>
        {history.length ? (
          <div className="history">
            <span>history</span>
            {history.map((item) => (
              <code key={item}>{item}</code>
            ))}
          </div>
        ) : null}
        <div className="console-resume">
          <div className="mode-tabs">
            {(["yaml", "json", "plain"] as const).map((item) => (
              <button
                className={mode === item ? "selected" : ""}
                key={item}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <pre>{output}</pre>
        </div>
        <p className="console-hint">
          ESC close · ? shortcuts · history retained this session
        </p>
      </div>
    </div>
  );
}

function Education() {
  return (
    <section className="section-wrap education-section" id="education">
      <div className="section-intro">
        <SectionLabel index="04">cat education.yaml</SectionLabel>
        <h2>Education.</h2>
      </div>
      <div className="education-grid">
        {content.education.map((item) => (
          <article className="education-card" key={item.school}>
            <span className="education-badge">{item.dates}</span>
            <h3>{item.degree}</h3>
            <p>{item.school}</p>
            <small>{item.location}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact section-wrap" id="contact">
      <SectionLabel index="05">contact</SectionLabel>
      <h2>Build the next reliable thing.</h2>
      <p>
        Seeking DevOps, Cloud, and Platform Engineer roles where automation,
        delivery, and operational clarity matter.
      </p>
      <div className="contact-links">
        <a href={`mailto:${content.email}`}>
          <Mail size={16} /> {content.email}
        </a>
        <a href={content.linkedin} target="_blank" rel="noreferrer">
          in / LinkedIn
        </a>
        <a href={content.github} target="_blank" rel="noreferrer">
          gh / GitHub
        </a>
      </div>
      <span className="relocation">open_to_relocation: true</span>
    </section>
  );
}

function App() {
  const [openCase, setOpenCase] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState("all");
  const [openExperience, setOpenExperience] = useState<string | null>(null);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(
    () => localStorage.getItem("portfolio-theme") ?? "system",
  );
  const [promptText, setPromptText] = useState("");
  const [heroReady, setHeroReady] = useState(false);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.dataset.theme = next;
  };
  useEffect(() => {
    if (theme !== "system") document.documentElement.dataset.theme = theme;
  }, [theme]);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);
  useEffect(() => {
    const prompt = "lakshmipriya@ops:~$ whoami";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPromptText(prompt);
      setHeroReady(true);
      return;
    }
    let index = 0;
    const timer = window.setInterval(() => {
      setPromptText(prompt.slice(0, index + 1));
      index += 1;
      if (index === prompt.length) {
        window.clearInterval(timer);
        window.setTimeout(() => setHeroReady(true), 160);
      }
    }, 45);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setConsoleOpen(true);
      }
      if (event.key === "Escape") setConsoleOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const selectCase = (id: string) => {
    setOpenCase(id);
  };
    return (
      <>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <header className="site-header">
          <a className="wordmark" href="#hero">
            ops://<span>LP</span>
          </a>
          <nav className={menuOpen ? "nav open" : "nav"}>
            {["cases", "capabilities", "experience", "education", "contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ),
            )}
          </nav>
          <div className="header-actions">
            <button
              className="theme-button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              className="console-trigger"
              onClick={() => setConsoleOpen(true)}
            >
              <Command size={14} /> Console <kbd>⌘K</kbd>
            </button>
            <button
              className="menu-trigger"
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>
        <main id="main-content">
          <section className="hero section-wrap" id="hero">
            <div className="prompt-line">
              <span>{promptText}</span>
              <i />
            </div>
            <p className="whoami-name"></p>
            <div className={heroReady ? "hero-copy revealed" : "hero-copy"}>
              <SectionLabel index="00">DevOps / Cloud / Reliability</SectionLabel>
              <h1 className="role-hero-h1">
                Automation
                <br />
                that runs reliably.
              </h1>
              <p className="hero-value">
                DevOps Engineer who turns multi-day manual operations into
                minutes-long, auditable automation across Azure, AWS, and
                Kubernetes.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#cases">
                  ls cases <ArrowUpRight size={15} />
                </a>
                <a
                  className="button button-secondary"
                  href={`${base}projects/Lakshmipriya.pdf`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download size={15} /> wget resume.pdf
                </a>
                <button
                  className="text-button"
                  onClick={() => setConsoleOpen(true)}
                >
                  open console <span>⌘K</span>
                </button>
              </div>
              <div className="status-json">
                <span>{"{"}</span>
                <p>
                  "status": <b>"open to work"</b>,
                </p>
                <p>
                  "seeking": <b>"DevOps / Cloud / Platform Engineer roles"</b>,
                </p>
                <p>
                  "region": <b>"{content.location} / open to relocation"</b>
                </p>
                <span>{"}"}</span>
              </div>
            </div>
            <HeroPipelineCard />
          </section>
          <CaseIndex
            openCase={openCase}
            setOpenCase={setOpenCase}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
          <StackManifest
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />
          <Experience open={openExperience} setOpen={setOpenExperience} />
          <Education />
          <Contact />
        </main>
        <footer className="status-bar">
          <span>
            <i /> status: open to work
          </span>
          <span>region: {content.location}</span>
          <span>open to relocation</span>
          <span>last deploy: {buildTime}</span>
        </footer>
        <CommandPalette
          open={consoleOpen}
          close={() => setConsoleOpen(false)}
          setCase={selectCase}
          toggleTheme={toggleTheme}
        />
      </>
  );
}

export default App;
