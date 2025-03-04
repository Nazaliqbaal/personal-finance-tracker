import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import CredentialPageLayout from "./layouts/credential-page-layout/credential-page-layout";
import SignInPage from "./pages/sign-in/sign-in";
// import SignUpPage from "./pages/sign-up/sign-up";
import { Toaster } from "sonner";
import ProtectedRoute from "./components/protected-route/protected-route";
// import Dashboard from "./pages/dashboard/dashboard";
import { AuthProvider, useAuth } from "./utils/auth-context";
// import AddTransactionPage from "./pages/add-transaction/add-transaction";
// import HomePageLayout from "./layouts/home-page-layout/home-page-layout";
import { lazy, Suspense } from "react";
import NotFoundPage from "./pages/not-found/not-found";

const CredentialPageLayout = lazy(
  () => import("./layouts/credential-page-layout/credential-page-layout")
);
// const SignInPage = lazy(() => import("./pages/sign-in/sign-in"));
const SignUpPage = lazy(() => import("./pages/sign-up/sign-up"));
const Dashboard = lazy(() => import("./pages/dashboard/dashboard"));
const AddTransactionPage = lazy(
  () => import("./pages/add-transaction/add-transaction")
);
const HomePageLayout = lazy(
  () => import("./layouts/home-page-layout/home-page-layout")
);
function App() {
  const { theme } = useAuth();
  return (
    <div
      className={`${
        theme === "dark" ? "dark" : ""
      } bg-white dark:bg-[#121212] h-svh`}
    >
      <Toaster richColors />

      <Router>
        <AuthProvider>
          <Suspense
            fallback={<h2 className="text-center text-white">Loading...</h2>}
          >
            <Routes>
              <Route path="/" element={<CredentialPageLayout />}>
                <Route index element={<SignUpPage />} />
                <Route path="sign-in" element={<SignInPage />} />
              </Route>
              <Route element={<HomePageLayout />}>
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-transaction"
                  element={
                    <ProtectedRoute>
                      <AddTransactionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-transaction/:id"
                  element={
                    <ProtectedRoute>
                      <AddTransactionPage />
                    </ProtectedRoute>
                  }
                />
                {/* Add more routes here */}
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
