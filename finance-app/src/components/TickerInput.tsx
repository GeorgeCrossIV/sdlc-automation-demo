/**
 * TickerInput.tsx
 * Text input + submit for the user-selected company chart (Issue #1).
 * Validates the symbol format client-side before triggering a fetch.
 */
import { useState, type FormEvent } from 'react';
import styles from './TickerInput.module.css';

interface Props {
  onSubmit: (ticker: string) => void;
  loading?: boolean;
}

export function TickerInput({ onSubmit, loading = false }: Props) {
  const [value, setValue] = useState('');
  const [validationError, setValidationError] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const symbol = value.toUpperCase().trim();
    if (!/^[A-Z]{1,5}$/.test(symbol)) {
      setValidationError('Enter a valid ticker symbol (1–5 letters, e.g. AAPL).');
      return;
    }
    setValidationError('');
    onSubmit(symbol);
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <input
        type="text"
        className={styles.input}
        placeholder="Enter ticker (e.g. AAPL)"
        value={value}
        maxLength={5}
        onChange={(e) => {
          setValue(e.target.value);
          setValidationError('');
        }}
        aria-label="Stock ticker symbol"
        disabled={loading}
      />
      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Loading…' : 'Search'}
      </button>
      {validationError && (
        <span className={styles.error} role="alert">
          {validationError}
        </span>
      )}
    </form>
  );
}
