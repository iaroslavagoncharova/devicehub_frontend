import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

interface LoginProps {
  onLogin: (username: string, password: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate(); // This hook allows for programmatic navigation

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin(username, password);
      
      // If login credentials are valid, navigate to the home page
      if (username === 'admin' && password === 'password') {
        navigate('/'); // Redirects to home page after login
      } else {
        alert('Invalid credentials');
      }
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-left"></div>
      <div className="login-right">
        <div className="login-form-container">
          <h2 className='h2-login'>Log In to Admin Panel</h2>
          <p className='.p-login'>Enter your Username and password below</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">USERNAME</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />

            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />

            <button type="submit" disabled={loading} className='loginButton'>
              {loading ? <div className="spinner"></div> : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
