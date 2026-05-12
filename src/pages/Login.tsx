import { useState, type FormEvent } from 'react';
import useAuth from '@/hooks/useAuth';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const { login, error, isAuthenticating } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username || !password) {
      setInputError('Please provide both username and password.');
      return;
    }

    setInputError(null);
    await login({ username, password });
  };

  return (
    <main className="relative grid min-h-screen w-full place-items-center px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(60% 50% at 50% 0%, rgba(232,182,90,0.08), transparent 70%)',
        }}
      />

      <section className="w-full max-w-[420px]">
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="brand-mark">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <h1 className="font-display text-3xl font-normal">
            Welcome to <span className="text-accent-italic">Crosswalk</span>
          </h1>
          <p className="text-sm text-[color:var(--ink-3)]">
            Sign in with your Navidrome credentials.
          </p>
        </div>

        <div className="surface-panel-2 rounded-[10px] p-7">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="section-eyebrow">Username</span>
              <input
                className="h-10 w-full rounded-md border border-[color:var(--hairline)] bg-[color:var(--panel)] px-3 text-sm text-foreground outline-none transition placeholder:text-[color:var(--muted-strong)] focus:border-[color:var(--hairline-2)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin"
              />
            </label>

            <label className="grid gap-2">
              <span className="section-eyebrow">Password</span>
              <input
                className="h-10 w-full rounded-md border border-[color:var(--hairline)] bg-[color:var(--panel)] px-3 text-sm text-foreground outline-none transition placeholder:text-[color:var(--muted-strong)] focus:border-[color:var(--hairline-2)] focus:ring-2 focus:ring-[color:var(--accent-soft)]"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-[color:var(--accent-gold)] text-sm font-semibold text-[color:var(--on-accent)] shadow-[var(--shadow-accent)] transition hover:bg-[color:var(--accent-deep)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuthenticating ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          {inputError ? (
            <p className="mt-4 text-sm text-[color:var(--destructive)]">{inputError}</p>
          ) : null}
          {!inputError && error ? (
            <p className="mt-4 text-sm text-[color:var(--destructive)]">{error}</p>
          ) : null}
        </div>

        <p className="mt-6 text-center text-[11.5px] uppercase tracking-[0.16em] text-[color:var(--muted-strong)]">
          A Navidrome client
        </p>
      </section>
    </main>
  );
}

export default Login;
