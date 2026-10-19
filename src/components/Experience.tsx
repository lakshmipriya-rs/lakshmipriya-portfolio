import { content } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { TermBar } from "./Terminal";

export function Experience() {
  return (
    <section
      className="section"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="container">
        <SectionHeader
          command="git log --graph --decorate"
          title="Experience"
          titleId="experience-title"
        />
        <div className="term">
          <TermBar
            title="~/career — git log"
            meta={`${content.experience.length} commits`}
          />
          <div className="term-body">
            <ol className="gitlog">
              {content.experience.map((item) => (
                <li className="commit" key={item.hash}>
                  <article className="commit-body">
                    <p className="commit-line">
                      <span className="commit-word" aria-hidden="true">
                        commit{" "}
                      </span>
                      <span className="commit-hash">{item.hash}</span>
                      {item.current ? (
                        <span className="commit-ref">
                          {" "}
                          (HEAD <span aria-hidden="true">→</span> current)
                        </span>
                      ) : null}
                    </p>
                    <h3 className="commit-title">
                      {item.role}{" "}
                      <span className="commit-at">@ {item.company}</span>
                    </h3>
                    <p className="commit-date">
                      <span className="commit-key">Date:</span> {item.dates}
                    </p>
                    <ul className="commit-bullets">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <div className="commit-stack">
                      <span className="commit-key" aria-hidden="true">
                        stack:
                      </span>
                      <ul
                        className="chip-list"
                        aria-label={`${item.company} stack`}
                      >
                        {item.stack.map((tool) => (
                          <li className="chip chip-sm" key={tool}>
                            {tool}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
