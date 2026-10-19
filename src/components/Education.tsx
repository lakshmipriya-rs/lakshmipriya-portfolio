import { content } from "../data/content";
import { SectionHeader } from "./SectionHeader";
import { TermBar } from "./Terminal";

export function Education() {
  return (
    <section
      className="section"
      id="education"
      aria-labelledby="education-title"
    >
      <div className="container">
        <SectionHeader
          command="cat education.yaml"
          title="Education"
          titleId="education-title"
        />
        <div className="term">
          <TermBar title="~/education.yaml" />
          <div className="term-body">
            <ul className="education-grid">
              {content.education.map((item) => (
                <li className="education-entry" key={item.school}>
                  <span className="yaml-dash" aria-hidden="true">
                    -
                  </span>
                  <dl className="yaml-map">
                    <div>
                      <dt>degree:</dt>
                      <dd>
                        <h3 className="education-degree">{item.degree}</h3>
                      </dd>
                    </div>
                    <div>
                      <dt>school:</dt>
                      <dd className="education-school">{item.school}</dd>
                    </div>
                    <div>
                      <dt>location:</dt>
                      <dd>{item.location}</dd>
                    </div>
                    <div>
                      <dt>dates:</dt>
                      <dd>{item.dates}</dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
