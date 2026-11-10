import { profile } from "@/lib/content";
import styles from "./LinkedInCard.module.css";

/**
 * A LinkedIn profile card drawn in-house. LinkedIn's own badge script often renders
 * blank (it redirects to a login wall), so this is the reliable version.
 */
export function LinkedInCard() {
  return (
    <a className={styles.card} href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
      <span className={styles.top}>
        <svg className={styles.logo} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, image is already sized */}
      <img className={styles.photo} src="/images/martin.jpg" alt="" width={472} height={472} loading="lazy" decoding="async" />
      <span className={styles.name}>{profile.name}</span>
      <span className={styles.role}>{profile.role}</span>
      <span className={styles.meta}>{profile.location}</span>
      <span className={styles.meta}>Mercado Libre · FORM</span>
      <span className={styles.button}>
        View profile <span aria-hidden="true">↗</span>
      </span>
    </a>
  );
}
