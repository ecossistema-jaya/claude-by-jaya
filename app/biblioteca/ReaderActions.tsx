'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './reader.module.css';

export default function ReaderActions({ slug }: { slug: string }) {
  return (
    <div className={styles.actions}>
      <div className={styles.actionButtons}>
        <a href={`/biblioteca/${encodeURIComponent(slug)}/download`} download={`${slug}.md`}>Baixar em Markdown <span aria-hidden="true">↓</span></a>
        <button type="button" onClick={() => window.print()}>Imprimir / PDF</button>
      </div>
    </div>
  );
}

export function CopyPrompt({ text, label }: { text: string; label: string }) {
  const [message, setMessage] = useState('');
  const [manual, setManual] = useState(false);
  const fallback = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (manual) {
      fallback.current?.focus();
      fallback.current?.select();
    }
  }, [manual]);

  async function copy() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setManual(false);
      setMessage('Prompt copiado. Cole na sua conversa.');
    } catch {
      setManual(true);
      fallback.current?.focus();
      fallback.current?.select();
      setMessage('Selecione e copie o texto abaixo com Ctrl+C, ⌘C ou o menu do celular.');
    }
  }

  return (
    <div className={styles.promptBox}>
      <div className={styles.promptHeading}>
        <span>Para experimentar</span>
        <button type="button" onClick={copy} aria-label={`Copiar prompt: ${label}`}>Copiar prompt</button>
      </div>
      <pre className={styles.promptText}><code>{text}</code></pre>
      <p className={styles.copyFeedback} role="status" aria-live="polite">{message}</p>
      {manual && (
        <label className={styles.manualCopy}>
          Texto para copiar manualmente
          <textarea ref={fallback} readOnly value={text} rows={8} onFocus={(event) => event.currentTarget.select()} />
        </label>
      )}
    </div>
  );
}
