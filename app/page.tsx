import { AccentButton } from "@/components/AccentButton";
import { CopyEmail } from "@/components/CopyEmail";
import { Timeline } from "@/components/Timeline";
import { experience, profile } from "@/lib/content";
import { projects } from "@/lib/projects";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <a href="#top" className={styles.wordmark}>
          {profile.name}
        </a>
        <nav aria-label="Sections" className={styles.nav}>
          <a className="u-link" href="#work">Work</a>
          <a className="u-link" href="#projects">Projects</a>
          <a className="u-link" href="#contact">Contact</a>
          <AccentButton />
        </nav>
      </header>

      <main id="main">
        <section id="top" className={styles.intro} aria-labelledby="intro-title">
          <p className={styles.kicker} data-reveal>
            {profile.role} · {profile.location}
          </p>
          <h1 id="intro-title" className={styles.title} data-reveal style={{ "--i": 1 } as React.CSSProperties}>
            I build products people use every day, <em>from the database to the button</em>.
          </h1>
          <div className={styles.lede} data-reveal style={{ "--i": 2 } as React.CSSProperties}>
            <p>
              I&apos;m Martin, a product-minded fullstack engineer with eight years of shipping
              customer-facing features at scale, from MercadoLibre&apos;s platform for 220M+ users to
              small US startups.
            </p>
            <p>
              I like owning work end to end: Go and Python services on PostgreSQL, React and
              TypeScript on the front.
            </p>
          </div>
        </section>

        <section id="work" className={styles.section} aria-labelledby="work-title">
          <h2 id="work-title" className={styles.label} data-reveal>
            Experience
          </h2>
          <Timeline roles={experience} />
        </section>

        <section id="projects" className={styles.section} aria-labelledby="projects-title">
          <h2 id="projects-title" className={styles.label} data-reveal>
            Projects
          </h2>
          {projects.length === 0 ? (
            <div className={styles.empty} data-reveal>
              <p className={styles.emptyTitle}>Nothing here yet.</p>
              <p className={styles.muted}>
                A subscription metrics dashboard is on the way. In the meantime, my code lives on{" "}
                <a className="u-link" href={profile.links.github}>
                  GitHub
                </a>
                .
              </p>
            </div>
          ) : (
            <ul className={styles.projects}>
              {projects.map((project, i) => (
                <li key={project.title} data-reveal style={{ "--i": i % 2 } as React.CSSProperties}>
                  <article className={styles.card}>
                    <h3 className={styles.cardTitle}>
                      {project.href ? (
                        <a href={project.href} className={styles.cardLink}>
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    <p className={styles.muted}>{project.description}</p>
                    <p className={styles.stack}>{project.stack.join(" · ")}</p>
                    {project.repo && (
                      <a className={`u-link ${styles.repo}`} href={project.repo}>
                        Source
                      </a>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="contact" className={styles.section} aria-labelledby="contact-title">
          <h2 id="contact-title" className={styles.label} data-reveal>
            Contact
          </h2>
          <div data-reveal>
            <p className={styles.contactLine}>
              If you&apos;re building something and think I could help, write to me at{" "}
              <a className="u-link" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              .
            </p>
            <div className={styles.contactRow}>
              <CopyEmail email={profile.email} />
              <a className="u-link" href={profile.links.github}>
                GitHub
              </a>
              <a className="u-link" href={profile.links.linkedin}>
                LinkedIn
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Built with Next.js. Set in Newsreader and IBM Plex Sans.</p>
      </footer>
    </div>
  );
}
