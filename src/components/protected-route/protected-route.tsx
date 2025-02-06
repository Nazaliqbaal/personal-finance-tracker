import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/auth-context";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/sign-in"); // Redirect to sign-in page if not logged in
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Optionally, show a loading spinner
  }

  return <>{children}</>; // Render the protected route if the user is authenticated
};

export default ProtectedRoute;
