import Link from "next/link";
import { CopyEmail } from "@/components/CopyEmail";
import { Timeline } from "@/components/Timeline";
import { experience, focus, intro, profile } from "@/lib/content";
import { projects } from "@/lib/projects";
import styles from "./page.module.css";

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

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
          <Link className={`u-link ${styles.play}`} href="/play/">
            Explore in 3D
          </Link>
        </nav>
      </header>

      <main id="main">
        <section id="top" className={styles.intro} aria-labelledby="intro-title">
          <p className={styles.kicker} data-reveal>
            {profile.role} · {profile.location}
          </p>
          <h1 id="intro-title" className={styles.title} data-reveal style={stagger(1)}>
            Hi, I&apos;m Martin.
          </h1>
          <div className={styles.lede} data-reveal style={stagger(2)}>
            {intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section id="work" className={styles.section} aria-labelledby="work-title">
          <h2 id="work-title" className={styles.label} data-reveal>
            What I work on
          </h2>
          <div className={styles.focus}>
            {focus.map((area) => (
              <article key={area.id} className={styles.area} data-reveal>
                <h3 className={styles.areaTitle}>{area.title}</h3>
                <p>{area.body}</p>
                <ul className={styles.stack} aria-label={`${area.title} stack`}>
                  {area.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="experience-title">
          <h2 id="experience-title" className={styles.label} data-reveal>
            Experience
          </h2>
          <Timeline roles={experience} />
          <p className={`${styles.muted} ${styles.more}`} data-reveal>
            The long version is on{" "}
            <a className="u-link" href={profile.links.linkedin}>
              LinkedIn
            </a>
            .
          </p>
        </section>

        <section id="projects" className={styles.section} aria-labelledby="projects-title">
          <h2 id="projects-title" className={styles.label} data-reveal>
            Projects
          </h2>
          {projects.length === 0 ? (
            <div className={styles.empty} data-reveal>
              <p className={styles.emptyTitle}>Nothing here yet.</p>
              <p className={styles.muted}>
                A subscription metrics dashboard is on the way. Until then, my code lives on{" "}
                <a className="u-link" href={profile.links.github}>
                  GitHub
                </a>
                .
              </p>
            </div>
          ) : (
            <ul className={styles.projects}>
              {projects.map((project, i) => (
                <li key={project.title} data-reveal style={stagger(i % 2)}>
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
                    <p className={styles.cardStack}>{project.stack.join(" · ")}</p>
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
              Building something and think I could help? Write to me at{" "}
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
