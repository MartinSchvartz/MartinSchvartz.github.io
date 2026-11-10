import styles from "./ClientLogo.module.css";

export type Client = {
  name: string;
  href: string;
  /** Path under /public. Without one, the name is set as a wordmark. */
  logo?: string;
  /** Brand color for the wordmark fallback. */
  color?: string;
};

/**
 * Gray at rest, brand color on hover with the name in a tooltip. The color layer
 * sits on top of a grayscale copy and only its opacity animates.
 */
export function ClientLogo({ client }: { client: Client }) {
  const mark = client.logo ? (
    // eslint-disable-next-line @next/next/no-img-element -- static export, SVGs
    <img src={client.logo} alt="" loading="lazy" decoding="async" />
  ) : (
    <span className={styles.wordmark}>{client.name}</span>
  );

  return (
    <a className={styles.client} href={client.href} target="_blank" rel="noopener noreferrer" aria-label={client.name}>
      <span className={styles.gray}>{mark}</span>
      <span className={styles.color} style={{ color: client.color }}>
        {mark}
      </span>
      <span className={styles.tip} aria-hidden="true">
        {client.name}
      </span>
    </a>
  );
}
