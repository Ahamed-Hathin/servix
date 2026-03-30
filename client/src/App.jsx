import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CityProvider } from "./context/CityContext";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";
import CitySelectorModal from "./components/CitySelectorModal";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookService from "./pages/BookService";
import UserDashboard from "./pages/UserDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentGateway from "./pages/PaymentGateway";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CityProvider>
          <BrowserRouter>
            <LoadingScreen />
            <CitySelectorModal />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  borderRadius: "12px",
                  background: "#1f2937",
                  color: "#fff",
                  fontSize: "14px",
                  padding: "12px 16px",
                },
                success: {
                  iconTheme: { primary: "#10b981", secondary: "#fff" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#fff" },
                },
              }}
            />
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/index.html" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/book/:serviceId"
                  element={
                    <ProtectedRoute allowedRoles={["user"]}>
                      <BookService />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Payment Gateway — full page, standalone layout */}
              <Route
                path="/payment/:bookingId"
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <PaymentGateway />
                  </ProtectedRoute>
                }
              />

              <Route
                element={
                  <ProtectedRoute allowedRoles={["user"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<UserDashboard />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute allowedRoles={["worker"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/worker" element={<WorkerDashboard />} />
              </Route>

              <Route
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CityProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
