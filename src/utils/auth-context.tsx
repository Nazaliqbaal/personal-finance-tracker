import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth, signOut, User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/loader/loader";

const auth = getAuth();

// Create AuthContext
const AuthContext = createContext<{
  user: User | null | undefined;
  loggingOut: boolean;
  loading: boolean;
  theme: string;
  toggleTheme: () => void;

  logout: () => void;
}>({
  user: undefined,
  loggingOut: false,
  logout: () => {},
  loading: true,
  theme: "light",
  toggleTheme: () => {},
});

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark");
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser); // Update user state
      setLoading(false); // Set loading to false once the auth state is checked
      const currentPath = window.location.pathname;

      // Only navigate to sign-in if user is explicitly null (not undefined)
      if (firebaseUser === null && !loggingOut) {
        if (currentPath !== "/" && currentPath !== "/sign-in") {
          navigate("/sign-in");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, loggingOut]);

  const logout = async () => {
    setLoggingOut(true); // Prevent "Not authorized!" toast
    await signOut(auth);
    setLoggingOut(false);
  };

  if (loading) {
    return <Loader />;
  }
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <AuthContext.Provider
      value={{ user, loggingOut, logout, loading, theme, toggleTheme }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
