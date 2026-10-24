
import { useState } from 'react';
import './Auth.css';

const API_URL = 'http://localhost:3000/api/auth';

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/login' : '/register';

      const body =
        mode === 'login'
          ? { email, password }
          : { name, email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      if (mode === 'register') {
        setMessage('Account created successfully! You can now log in.');
        setMode('login');
        setPassword('');
      } else {
        if (!data.token) {
          throw new Error('The server did not return an authentication token.');
        }

        onLogin(data);
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setMessage('');
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <a className="auth-brand" href="/">
          <span className="brand-icon">C</span>
          CAR<span>DECK</span>
        </a>

        <p className="auth-eyebrow">
          {mode === 'login' ? 'WELCOME BACK' : 'JOIN CARDECK'}
        </p>

        <h1>
          {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
        </h1>

        <p className="auth-description">
          {mode === 'login'
            ? 'Sign in to continue to your account.'
            : 'Register to get started with CARDECK.'}
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete={
                mode === 'login' ? 'current-password' : 'new-password'
              }
              minLength={8}
              required
            />
          </label>

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account?" : 'Already registered?'}
          {' '}
          <button type="button" onClick={switchMode}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </section>
    </main>
  );
}

export default Auth;
