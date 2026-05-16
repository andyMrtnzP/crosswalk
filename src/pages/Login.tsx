import { useState, type SubmitEvent } from 'react';
import useAuth from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const { login, error, isAuthenticating } = useAuth();

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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

      <section className="w-full max-w-105">
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
          <p className="text-sm text-ink-3">
            Sign in with your Navidrome credentials.
          </p>
        </div>

        <div className="surface-panel-2 rounded-lg p-7">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2">
              <span className="section-eyebrow">Username</span>
              <input
                className="h-10 w-full rounded-md border border-hairline bg-panel px-3 text-sm text-foreground outline-none transition placeholder:text-muted-strong focus:border-hairline-2 focus:ring-2 focus:ring-accent-soft"
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
                className="h-10 w-full rounded-md border border-hairline bg-panel px-3 text-sm text-foreground outline-none transition placeholder:text-muted-strong focus:border-hairline-2 focus:ring-2 focus:ring-(--accent-soft)"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </label>

            <Button
              type="submit"
              disabled={isAuthenticating}
              variant='glow'
            >
              {isAuthenticating ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {inputError ? (
            <p className="mt-4 text-sm text-destructive">{inputError}</p>
          ) : null}
          {!inputError && error ? (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          ) : null}
        </div>

        <p className="mt-6 text-center text-[11.5px] uppercase tracking-[0.16em] text-muted-strong">
          A Navidrome client
        </p>
      </section>
    </main>
  );
}
