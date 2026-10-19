import { useEffect, useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Mail } from "lucide-react";
import type { ReactNode } from "react";
import { content } from "../data/content";
import { GitHubIcon, LinkedInIcon } from "./Icons";
import { SectionHeader } from "./SectionHeader";
import { Prompt, TermBar } from "./Terminal";

const base = import.meta.env.BASE_URL;

interface Channel {
  key: string;
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
}

const CHANNELS: Channel[] = [
  {
    key: "email",
    label: "Email",
    value: content.email,
    href: `mailto:${content.email}`,
    icon: <Mail size={22} />,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    value: content.linkedinHandle,
    href: content.linkedin,
    icon: <LinkedInIcon size={20} />,
    external: true,
  },
  {
    key: "github",
    label: "GitHub",
    value: `@${content.githubHandle}`,
    href: content.github,
    icon: <GitHubIcon size={20} />,
    external: true,
  },
];

export function Contact() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(content.email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${content.email}`;
    }
  };

  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="container">
        <SectionHeader
          command="./contact.sh"
          title="Let’s build the next reliable thing."
          titleId="contact-title"
        >
          Open to DevOps, SRE, and Platform Engineering roles where automation,
          reliability, and operational clarity matter. Email is the fastest way
          to reach me.
        </SectionHeader>

        <div className="term contact-term">
          <TermBar title="~/contact — ./contact.sh" meta="3 channels" />
          <div className="term-body">
            <ul className="contact-list">
              {CHANNELS.map((channel) => (
                <li key={channel.key}>
                  <a
                    className={`contact-row contact-${channel.key}`}
                    href={channel.href}
                    {...(channel.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    <span className="contact-icon" aria-hidden="true">
                      {channel.icon}
                    </span>
                    <span className="contact-label">{channel.label}</span>
                    <span className="contact-value">{channel.value}</span>
                    <ArrowUpRight
                      className="contact-arrow"
                      size={22}
                      aria-hidden="true"
                    />
                    {channel.external ? (
                      <span className="sr-only"> (opens in a new tab)</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>

            <div className="contact-actions">
              <button
                className="button button-secondary"
                type="button"
                onClick={copyEmail}
              >
                {copied ? (
                  <Check size={15} aria-hidden="true" />
                ) : (
                  <Copy size={15} aria-hidden="true" />
                )}
                {copied ? "Email copied" : "Copy email"}
              </button>
              <a
                className="button button-secondary"
                href={`${base}${content.resume}`}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={15} aria-hidden="true" /> Download resume
              </a>
              <p className="availability">
                <i className="status-dot" aria-hidden="true" /> open to work ·
                open to relocate
              </p>
            </div>
            <Prompt path="~/contact" command={<i className="caret" />} />
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {copied ? "Email address copied to clipboard" : ""}
        </p>
      </div>
    </section>
  );
}
