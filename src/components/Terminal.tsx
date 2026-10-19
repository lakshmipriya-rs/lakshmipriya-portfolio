import type { ReactNode } from "react";

/** macOS-style terminal title bar: traffic lights, a path/title, optional meta. */
export function TermBar({
  title,
  meta,
  children,
}: {
  title: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="term-bar">
      <span className="term-dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="term-title">{title}</span>
      {meta ? <span className="term-meta">{meta}</span> : null}
      {children}
    </div>
  );
}

/** A shell prompt line: `lakshmipriya@ops:~/path$ command`. Decorative. */
export function Prompt({
  path = "~",
  command,
  className,
}: {
  path?: string;
  command: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={className ? `prompt ${className}` : "prompt"}
      aria-hidden="true"
    >
      <span className="prompt-user">lakshmipriya@ops</span>
      <span className="prompt-path">:{path}</span>
      <span className="prompt-sign">$</span>{" "}
      <span className="prompt-cmd">{command}</span>
    </p>
  );
}
