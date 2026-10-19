import { content, isFeaturedTool } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { TermBar } from "./Terminal";

export function Skills() {
  const total = content.skills.reduce((sum, g) => sum + g.tools.length, 0);
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeader
          command="cat skills.yaml"
          title="Skills & Tools"
          titleId="skills-title"
        >
          The toolchain I run day to day for delivery, platform, and reliability
          work, grouped by discipline.
        </SectionHeader>

        <div className="term skills-term">
          <TermBar
            title="~/skills.yaml"
            meta={`${content.skills.length} groups · ${total} tools`}
          />
          <div className="term-body">
            <p className="skills-legend">
              <span className="comment-mark" aria-hidden="true">
                #{" "}
              </span>
              <span
                className="chip chip-featured chip-sample"
                aria-hidden="true"
              >
                <i className="chip-dot" /> tool
              </span>
              = used in a production case study above
            </p>

            <ul className="skills-grid">
              {content.skills.map((group) => (
                <li className="skill-group" key={group.key}>
                  <h3 className="skill-title">
                    <span className="yaml-key" aria-hidden="true">
                      {group.key}:
                    </span>
                    <span className="skill-name">
                      <span className="comment-mark" aria-hidden="true">
                        #{" "}
                      </span>
                      {group.name}
                      <span className="skill-count">
                        {" "}
                        · {group.tools.length}
                        <span className="sr-only"> tools</span>
                      </span>
                    </span>
                  </h3>
                  <ul className="chip-list" aria-label={`${group.name} tools`}>
                    {group.tools.map((tool) => {
                      const featured = isFeaturedTool(tool);
                      return (
                        <li
                          className={featured ? "chip chip-featured" : "chip"}
                          key={tool}
                        >
                          {featured ? (
                            <i className="chip-dot" aria-hidden="true" />
                          ) : null}
                          {tool}
                          {featured ? (
                            <span className="sr-only">
                              {" "}
                              (used in a case study)
                            </span>
                          ) : null}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
