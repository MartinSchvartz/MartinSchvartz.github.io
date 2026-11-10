import { CopyEmail } from "@/components/CopyEmail";
import { ClientLogo } from "@/components/ClientLogo";
import { LinkedInCard } from "@/components/LinkedInCard";
import { Thumb } from "@/components/Thumb";
import { Timeline } from "@/components/Timeline";
import { about, experience, focus, headline, intro, profile, stats } from "@/lib/content";
import { form, meli, type Company, type Project } from "@/lib/projects";
import styles from "./page.module.css";

const stagger = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Props for links that leave the site: they open in a new tab. */
const external = { target: "_blank", rel: "noopener noreferrer" } as const;

const usedAt = ["Mercado Libre", "PepsiCo", "AB InBev", "Kroger", "Flowers Foods", "Wendy's"];

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`${styles.wrap} ${styles.headerInner}`}>
          <a href="#top" className={styles.wordmark}>
            {profile.name}
          </a>
          <nav aria-label="Sections" className={styles.nav}>
            <a className="u-link" href="#work">Work</a>
            <a className="u-link" href="#experience">Experience</a>
            <a className={styles.navCta} href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section id="top" className={`${styles.wrap} ${styles.hero}`} aria-labelledby="intro-title">
          <div className={styles.heroText}>
            <p className={styles.kicker} data-reveal>
              {profile.role} · {profile.location}
            </p>
            <h1 id="intro-title" className={styles.name} data-reveal style={stagger(1)}>
              Martin <span>Schvartz</span>
            </h1>
            <p className={styles.headline} data-reveal style={stagger(2)}>
              {headline}
            </p>
            <div className={styles.lede} data-reveal style={stagger(3)}>
              {intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className={styles.ctas} data-reveal style={stagger(4)}>
              <a className={styles.button} href="#work">
                See my work
              </a>
              <a className={`${styles.button} ${styles.buttonGhost}`} href={profile.links.linkedin} {...external}>
                LinkedIn
              </a>
            </div>
          </div>
          <div className={styles.portraitWrap} data-reveal style={stagger(2)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is already sized */}
            <img
              className={styles.portrait}
              src="/images/martin.jpg"
              alt="Portrait of Martin"
              width={472}
              height={472}
              decoding="async"
            />
          </div>
        </section>

        <div className={styles.wrap}>
          <dl className={styles.stats} data-reveal>
            {stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className={styles.usedAt} data-reveal>
            <p>Software I&apos;ve built is used at</p>
            <ul>
              {usedAt.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>

        <section id="work" className={styles.band} aria-labelledby="work-title">
          <div className={styles.wrap}>
            <div className={styles.sectionHead} data-reveal>
              <p className={styles.label}>Selected work</p>
              <h2 id="work-title" className={styles.sectionTitle}>
                Things I&apos;ve built that people use every day.
              </h2>
            </div>

            <CompanyBlock company={form}>
              <ProjectCard project={form.projects[0]} wide />
            </CompanyBlock>

            <CompanyBlock company={meli}>
              <ul className={styles.grid}>
                {meli.projects.map((project, i) => (
                  <li key={project.title} data-reveal style={stagger(i)}>
                    <ProjectCard project={project} />
                  </li>
                ))}
              </ul>
            </CompanyBlock>
          </div>
        </section>

        <section className={`${styles.wrap} ${styles.section}`} aria-labelledby="focus-title">
          <div className={styles.sectionHead} data-reveal>
            <p className={styles.label}>What I work on</p>
            <h2 id="focus-title" className={styles.sectionTitle}>
              Four things I&apos;m good at, and how.
            </h2>
          </div>
          <div className={styles.focus}>
            {focus.map((area, i) => (
              <article key={area.id} className={styles.area} data-reveal style={stagger(i % 2)}>
                <p className={styles.areaNum}>{String(i + 1).padStart(2, "0")}</p>
                <h3 className={styles.areaTitle}>{area.title}</h3>
                <p className={styles.areaBody}>{area.body}</p>
                <ul className={styles.chips} aria-label={`${area.title} stack`}>
                  {area.stack.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className={`${styles.wrap} ${styles.section}`} aria-labelledby="experience-title">
          <div className={styles.experience}>
            <div className={styles.sectionHead} data-reveal>
              <p className={styles.label}>Experience</p>
              <h2 id="experience-title" className={styles.sectionTitle}>
                8+ years, four teams.
              </h2>
              <p className={styles.aboutText}>{about.body}</p>
              <p className={styles.muted}>
                The long version is on{" "}
                <a className="u-link" href={profile.links.linkedin} {...external}>
                  LinkedIn
                </a>
                .
              </p>
            </div>
            <Timeline roles={experience} />
          </div>
        </section>

        <section id="contact" className={`${styles.band} ${styles.contact}`} aria-labelledby="contact-title">
          <div className={`${styles.wrap} ${styles.contactInner}`} data-reveal>
            <div>
              <p className={styles.label}>Contact</p>
              <h2 id="contact-title" className={styles.contactTitle}>
                Building something and think I could help?
              </h2>
              <a className={styles.contactEmail} href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <div className={styles.contactRow}>
                <CopyEmail email={profile.email} />
                <a className="u-link" href={profile.links.linkedin} {...external}>
                  LinkedIn
                </a>
                <a className="u-link" href={profile.links.github} {...external}>
                  GitHub
                </a>
              </div>
            </div>
            <LinkedInCard />
          </div>
        </section>
      </main>

      <footer className={`${styles.wrap} ${styles.footer}`}>
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>Built with Next.js. Set in Geist.</p>
      </footer>
    </div>
  );
}

function CompanyBlock({ company, children }: { company: Company; children: React.ReactNode }) {
  return (
    <div className={styles.company}>
      <div className={styles.companyHead} data-reveal>
        <h3 className={styles.companyName}>
          {company.name} <span>{company.years}</span>
        </h3>
        <p className={styles.companySummary}>{company.summary}</p>
        {company.customers && (
          <ul className={styles.customers} aria-label={`${company.name} customers`}>
            {company.customers.map((c) => (
              <li key={c.name}>
                <ClientLogo client={c} />
              </li>
            ))}
          </ul>
        )}
      </div>
      {children}
    </div>
  );
}

function ProjectCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  return (
    <article className={`${styles.card} ${wide ? styles.cardWide : ""}`} data-reveal={wide || undefined}>
      <div className={styles.cardThumb}>
        <Thumb id={project.thumb} />
      </div>
      <div className={styles.cardBody}>
        {project.eyebrow && <p className={styles.eyebrow}>{project.eyebrow}</p>}
        <h4 className={styles.cardTitle}>
          {project.href ? (
            <a href={project.href} className={styles.cardLink} {...external}>
              {project.title}
            </a>
          ) : (
            project.title
          )}
        </h4>
        <p className={styles.cardText}>{project.description}</p>
        <ul className={styles.chips} aria-label={`${project.title} stack`}>
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {project.href && (
          <p className={styles.cardMore} aria-hidden="true">
            {project.linkLabel ?? new URL(project.href).host} <span>↗</span>
          </p>
        )}
      </div>
    </article>
  );
}
