import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../hooks/contextHooks";

const Login: React.FC = () => {
  const { handleLogin, isLoggedIn, handleLogout, handleChangePassword } =
    useUserContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await handleLogin({ username, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await handleChangePassword(newPassword);
    } catch (error) {
      console.error("Password change failed:", error);
      setError("Password change failed");
    }
  };

  return (
    <>
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-left">
          <button className="back-button" onClick={() => navigate("/")}>
            ⬅ Back
          </button>
          </div>
          <div className="login-right">
            <div className="login-form-container">
              {isLoggedIn ? (
                <>
                  <h2 className="h2-login">You are already logged in as admin</h2>
                  <div>
                    <p className="p-login">Change password</p>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      className="loginButton"
                      onClick={handlePasswordChange}
                    >
                      Change Password
                    </button>
                  </div>
                  <button onClick={() => navigate("/")} className="loginButton">
                    Go to Dashboard
                  </button>
                  <button onClick={handleLogout} className="loginButton">
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <h2 className="h2-login">Log In to Admin Panel</h2>
                  <p className="p-login">
                    Enter your Username and password below
                  </p>
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

                    <button
                      type="submit"
                      disabled={loading}
                      className="loginButton"
                    >
                      {loading ? <div className="spinner"></div> : "Log In"}
                    </button>
                    {error && <p className="error-message">{error}</p>}
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
