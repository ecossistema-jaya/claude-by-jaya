'use client';

import { useState } from 'react';
import styles from './library.module.css';

export default function SairBiblioteca() {
  const [saindo, setSaindo] = useState(false);

  async function sair() {
    setSaindo(true);
    await fetch('/biblioteca/sair', { method: 'POST' });
    window.location.href = '/biblioteca/entrar?erro=saiu';
  }

  return (
    <button type="button" className={styles.sair} onClick={sair} disabled={saindo}>
      {saindo ? 'Saindo…' : 'Sair'}
    </button>
  );
}
