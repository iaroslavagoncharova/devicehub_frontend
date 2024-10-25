import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/contextHooks";

const Login: React.FC = () => {
  const { handleLogin} = useUserContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(username, password);
      await handleLogin({ username, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-container">
        <div className="login-left"></div>
        <div className="login-right">
          <div className="login-form-container">
            <h2 className="h2-login">Log In to Admin Panel</h2>
            <p className="p-login">Enter your Username and password below</p>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">USERNAME</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label htmlFor="password">PASSWORD</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" disabled={loading} className="loginButton">
                {loading ? <div className="spinner"></div> : "Log In"}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
