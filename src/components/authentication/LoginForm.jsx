import { useState } from 'react';
import { useLogin } from './useLogin';
import LoadingComponent from '../LoadingComponent';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex flex-column mb-4">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          className="form-control"
        />
      </div>
      <div className="d-flex flex-column mb-4">
        <label htmlFor="password" className="form-label">
          Parolă
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          className="form-control"
        />
      </div>
      <div className="mb-4">
        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-success w-100"
        >
          {console.log('isLoading: ', isLoading)}
          {!isLoading ? 'Autentificare' : '...'}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
