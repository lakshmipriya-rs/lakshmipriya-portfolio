import type { ReactNode } from "react";
import { Prompt } from "./Terminal";

interface SectionHeaderProps {
  command: string;
  title: string;
  titleId: string;
  children?: ReactNode;
}

export function SectionHeader({
  command,
  title,
  titleId,
  children,
}: SectionHeaderProps) {
  return (
    <header className="section-header">
      <Prompt command={command} />
      <h2 className="section-title" id={titleId}>
        {title}
      </h2>
      {children ? (
        <p className="section-lead">
          <span className="comment-mark" aria-hidden="true">
            #{" "}
          </span>
          {children}
        </p>
      ) : null}
    </header>
  );
}
