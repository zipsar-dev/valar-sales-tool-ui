import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  memo,
} from "react";
import { api } from "../lib/api";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: "admin" | "sales_manager" | "sales_rep";
  permissions: [];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = memo(
  ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      let isMounted = true;
      console.log("AuthProvider useEffect triggered");
      const savedToken = localStorage.getItem("auth_token");
      const savedUser = localStorage.getItem("auth_user");

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        refreshUserAccess().catch((err) => {
          if (isMounted) {
            console.error("Failed to refresh user access:", err);
          }
        });
      }
      setIsLoading(false);

      return () => {
        isMounted = false;
        console.log("AuthProvider useEffect cleanup");
      };
    }, []);

    const refreshUserAccess = async () => {
      console.log("Refreshing user access");
      try {
        const res = await api.get("/users/access");
        const newPermissions = res.data.data.permissions;
        setUser((prev) => {
          if (!prev) return prev;
          const updatedUser = { ...prev, permissions: newPermissions };
          localStorage.setItem("auth_user", JSON.stringify(updatedUser));
          return updatedUser;
        });
      } catch (error) {
        console.error("Error refreshing user access:", error);
        throw error;
      }
    };

    const login = async (email: string, password: string) => {
      try {
        const response = await api.post("/auth/login", { email, password });
        const { token: newToken, user: newUser } = response.data.data;

        setToken(newToken);
        setUser(newUser);

        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      } catch (error: any) {
        console.error("Login API error:", error);
        if (error.response?.status === 401) {
          throw new Error("Invalid email or password");
        } else if (error.response?.status === 422) {
          throw new Error("Please check your email and password format");
        } else if (error.response?.status === 500) {
          throw new Error("Server error. Please try again later");
        } else {
          throw new Error(
            error.response?.data?.error ||
              "Login failed. Please check your connection"
          );
        }
      }
    };

    const register = async (data: RegisterData) => {
      try {
        const response = await api.post("/auth/register", data);
        const { token: newToken, user: newUser } = response.data.data;

        setToken(newToken);
        setUser(newUser);

        localStorage.setItem("auth_token", newToken);
        localStorage.setItem("auth_user", JSON.stringify(newUser));
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      } catch (error: any) {
        console.error("Registration API error:", error);
        if (error.response?.status === 409) {
          throw new Error("Email already registered");
        } else if (error.response?.status === 422) {
          throw new Error("Please check your registration details");
        } else {
          throw new Error(error.response?.data?.error || "Registration failed");
        }
      }
    };

    const logout = async () => {
      try {
        await api.post("/auth/logout");
      } catch (error) {
        console.warn("Logout API call failed, continuing with local logout");
      }

      setUser(null);
      setToken(null);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      delete api.defaults.headers.common["Authorization"];
    };

    const updateUser = (updatedUser: User) => {
      setUser(updatedUser);
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    };

    return (
      <AuthContext.Provider
        value={{
          user,
          token,
          isLoading,
          login,
          register,
          logout,
          updateUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
);

AuthProvider.displayName = "AuthProvider";

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
