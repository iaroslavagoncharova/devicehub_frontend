import React, { createContext, useState } from "react";
import { useAuth, useUser } from "../hooks/apiHooks";
import { AuthContextType, Values } from "../types/LocalTypes";
import { useNavigate } from "react-router-dom";

const UserContext = createContext<AuthContextType | null>(null);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<string | null>(null);
  const { postLogin } = useAuth();
  const { postPasswordChange } = useUser();
  const isLoggedIn = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogin = async (values: Values) => {
    try {
      const result = await postLogin(values);
      if (result) {
        localStorage.setItem("token", result.data.data.token);
        setRole(result.data.data.role);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await localStorage.removeItem("token");
      setRole(null);
      navigate("/");
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleChangePassword = async (password: string) => {
    try {
      const response = await postPasswordChange(password);
      if (response) {
        alert("Password changed successfully");
        navigate("/");
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        role,
        handleLogin,
        handleLogout,
        isLoggedIn,
        handleChangePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
