import { act, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { CaseFlow } from "./components/CaseFlow";
import { content } from "./data/content";

describe("portfolio layout", () => {
  it("renders every hero pipeline log row up front so the card never changes height", () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll(".pipeline-log")).toHaveLength(
      content.heroPipeline.logs.length,
    );
  });

  it("shows case studies directly, with no filters or search", () => {
    render(<App />);
    const cases = screen.getByRole("region", { name: "Case Studies" });
    expect(within(cases).queryByRole("button", { name: /^all$/i })).toBeNull();
    expect(within(cases).queryByRole("textbox")).toBeNull();
    expect(within(cases).queryByText(/clear filter/i)).toBeNull();
  });

  it("keeps every case study open, each with its pipeline flow", () => {
    render(<App />);
    const cases = screen.getByRole("region", { name: "Case Studies" });
    expect(within(cases).getAllByRole("article")).toHaveLength(
      content.cases.length,
    );
    expect(within(cases).getAllByText(/How it works/)).toHaveLength(
      content.cases.length,
    );
    expect(cases.querySelector("[aria-expanded]")).toBeNull();
  });

  it("labels the forward-looking field future implementations instead of 'next'", () => {
    render(<App />);
    expect(screen.getAllByText("future_implementations:")).toHaveLength(
      content.cases.length,
    );
    expect(screen.queryByText(/^next$/i)).toBeNull();
  });

  it("names the tools section Skills, not capabilities", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(within(nav).getByRole("link", { name: /skills/ })).toHaveAttribute(
      "href",
      "#skills",
    );
    expect(within(nav).queryByText(/capabilities/i)).toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Skills & Tools" }),
    ).toBeInTheDocument();
  });

  it("keeps every experience entry expanded with no toggles", () => {
    render(<App />);
    const experience = screen.getByRole("region", { name: "Experience" });
    for (const item of content.experience) {
      for (const bullet of item.bullets) {
        expect(within(experience).getByText(bullet)).toBeVisible();
      }
    }
    expect(within(experience).queryByRole("button")).toBeNull();
  });

  it("shows large email, LinkedIn, and GitHub contact links", () => {
    render(<App />);
    const contact = screen.getByRole("region", {
      name: /build the next reliable thing/i,
    });
    expect(
      within(contact).getByRole("link", { name: new RegExp(content.email) }),
    ).toHaveAttribute("href", `mailto:${content.email}`);
    expect(
      within(contact).getByRole("link", { name: /linkedin/i }),
    ).toHaveAttribute("href", content.linkedin);
    expect(
      within(contact).getByRole("link", { name: /github/i }),
    ).toHaveAttribute("href", content.github);
  });

  it("keeps the footer to status and relocation only", () => {
    render(<App />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("status: open to work | open to relocate");
    expect(footer).not.toHaveTextContent(/philadelphia|region|last deploy/i);
  });
});

describe("identity and wording", () => {
  it("uses the first name only and plain 'resume' spelling", () => {
    const { container } = render(<App />);
    expect(container).not.toHaveTextContent(/RajeshKanna/);
    expect(container).not.toHaveTextContent(/résumé/i);
    expect(
      screen.getAllByRole("link", { name: /download resume/i }).length,
    ).toBeGreaterThan(0);
  });

  it("positions the profile for DevOps, SRE, and Platform Engineering", () => {
    render(<App />);
    expect(
      screen.getByText("DevOps · SRE · Platform Engineering"),
    ).toBeInTheDocument();
  });
});

describe("case study flow", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("starts when scrolled into view and advances one step at a time", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(private callback: IntersectionObserverCallback) {}
        observe() {
          this.callback(
            [{ isIntersecting: true } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
        }
        disconnect() {}
        unobserve() {}
      },
    );
    const steps = [
      { id: "a", label: "Alpha", tools: [], summary: "first" },
      { id: "b", label: "Beta", tools: [], summary: "second" },
      { id: "c", label: "Gamma", tools: [], summary: "third" },
    ];
    render(<CaseFlow caseId="demo" steps={steps} />);
    const current = () =>
      screen
        .getAllByRole("button")
        .find((button) => button.getAttribute("aria-current") === "step");

    expect(current()).toHaveTextContent("Alpha");
    act(() => vi.advanceTimersByTime(1000)); // start delay
    act(() => vi.advanceTimersByTime(2500));
    expect(current()).toHaveTextContent("Beta");
    act(() => vi.advanceTimersByTime(2500));
    expect(current()).toHaveTextContent("Gamma");
    act(() => vi.advanceTimersByTime(2500));
    expect(screen.getByRole("button", { name: /replay/i })).toBeInTheDocument();
  });
});
