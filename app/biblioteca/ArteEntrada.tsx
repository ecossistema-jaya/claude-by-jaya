import styles from './library.module.css';

/* O círculo da capa da biblioteca, sem os rótulos, para as telas de entrada. */
export default function ArteEntrada() {
  return (
    <div className={styles.art} aria-hidden="true">
      <div className={styles.ring} /><div className={styles.innerRing} /><div className={styles.radial} />
      <div className={styles.core}><span>j</span></div>
    </div>
  );
}
