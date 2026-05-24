import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const DashboardLayout = lazy(() => import("./pages/user/DashboardLayout"));
// early loading:
// import LoginPage from "./pages/LoginPage";

const AppLayout = lazy(() => import("./pages/AppLayout"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const DashboardHome = lazy(() => import("./pages/user/DashboardHome"));
// import DashboardLayout from "./pages/user/DashboardLayout";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Provider } from "react-redux";
import { store } from "./store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </Provider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
