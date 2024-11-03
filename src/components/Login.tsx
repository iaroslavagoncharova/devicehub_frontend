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
    <div className="flex items-center justify-center h-full bg-background">
      <div className="flex flex-col md:flex-row w-[70vw] max-w-[1440px] min-w-[800px] bg-white rounded-2xl shadow-lg overflow-hidden h-[80vh] md:h-[70vh]">
        <div className="relative md:w-1/2 h-64 md:h-auto bg-cover bg-center background-login">
          <button
            className="absolute top-4 left-4 bg-black/60 text-white px-3 py-2 rounded transition-colors duration-300 ease-in-out hover:bg-black/80"
            onClick={() => navigate("/")}
          >
            ⬅ Back
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 md:p-8 bg-white">
          <div className="w-11/12 md:w-4/5">
            {isLoggedIn ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-titleText">
                  You are already logged in as admin
                </h2>
                <div>
                  <p className="text-lg mb-4 text-darkText">Change password</p>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                  />
                  <button
                    onClick={handlePasswordChange}
                    className="w-full py-2 px-4 bg-purple text-white rounded-md transition-colors duration-300 hover:bg-dark-text"
                  >
                    Change Password
                  </button>
                </div>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-2 px-4 mt-4 bg-purple text-white rounded-md transition-colors duration-300 hover:bg-dark-text"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 px-4 mt-4 bg-purple text-white rounded-md transition-colors duration-300 hover:bg-dark-text"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <h2 className="text-xl md:text-2xl font-bold mb-2 text-titleText">
                  Log In to Admin Panel
                </h2>
                <p className="mb-4 text-gray-600">
                  Enter your username and password below
                </p>
                <form onSubmit={handleSubmit}>
                  <label
                    htmlFor="username"
                    className="block font-semibold mb-1 text-darkText"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter your username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-darkText"
                  />

                  <label
                    htmlFor="password"
                    className="block font-semibold mb-1 text-darkText"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded text-darkText"
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-purple text-white rounded-md transition-colors duration-300 hover:bg-dark-text"
                  >
                    {loading ? <div className="spinner"></div> : "Log In"}
                  </button>
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
