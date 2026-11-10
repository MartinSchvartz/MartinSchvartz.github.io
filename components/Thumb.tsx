import type { ThumbId } from "@/lib/projects";
import styles from "./Thumb.module.css";

const WEEK = ["L", "M", "M", "J", "V", "S", "D"];

/** Drawn product thumbnails. Decorative: the card text says the same thing. */
export function Thumb({ id }: { id: ThumbId }) {
  return (
    <div className={`${styles.thumb} ${styles[id]}`} aria-hidden="true">
      {id === "form" && <FormThumb />}
      {id === "meliplus" && <MeliPlusThumb />}
      {id === "address" && <AddressThumb />}
      {id === "delivery" && <DeliveryThumb />}
    </div>
  );
}

/** A shelf with one product boxed by the image recognition. */
function FormThumb() {
  const rows = [
    ["a", "a", "b", "b", "b", "c"],
    ["d", "d", "d", "e", "", "e"],
    ["f", "a", "a", "c", "c", "c"],
  ];
  return (
    <>
      <span className={styles.wordmark}>FORM</span>
      <div className={styles.shelf}>
        {rows.map((row, r) => (
          <div key={r} className={styles.shelfRow}>
            {row.map((p, i) => (
              <span key={i} className={styles.product} data-p={p || "empty"} />
            ))}
          </div>
        ))}
        <span className={styles.detect}>
          <span className={styles.detectLabel}>Out of stock</span>
        </span>
      </div>
    </>
  );
}

function MeliPlusThumb() {
  return (
    <div className={styles.inner}>
      <span className={styles.meliplusMark}>
        meli<span>+</span>
      </span>
      <ul className={styles.perks}>
        <li>Envío gratis</li>
        <li>Descuentos</li>
        <li>Streaming</li>
      </ul>
    </div>
  );
}

function AddressThumb() {
  return (
    <div className={styles.addressForm}>
      <span className={styles.fieldLabel}>Calle y número</span>
      <span className={styles.field}>
        Av. Corrientes 1234
        <svg viewBox="0 0 16 16" className={styles.check}>
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={styles.fieldLabel}>Piso / Depto</span>
      <span className={`${styles.field} ${styles.fieldShort}`}>4° B</span>
      <svg viewBox="0 0 24 32" className={styles.pin}>
        <path d="M12 1C6 1 1.5 5.5 1.5 11.5 1.5 19 12 31 12 31s10.5-12 10.5-19.5C22.5 5.5 18 1 12 1z" fill="currentColor" />
        <circle cx="12" cy="11.5" r="4" fill="#ffe600" />
      </svg>
    </div>
  );
}

function DeliveryThumb() {
  return (
    <div className={styles.inner}>
      <span className={styles.caption}>Tu día de entregas</span>
      <ol className={styles.week}>
        {WEEK.map((d, i) => (
          <li key={i} data-picked={i === 3 || undefined}>
            {d}
            {i === 3 && (
              <span className={styles.boxes}>
                <span />
                <span />
                <span />
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
