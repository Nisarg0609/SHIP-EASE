import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { adminNavLinks, warehouseManagerNavLinks } from "./assets/constants/navLinks";
import AdminManagerLayout from "./ui/AdminManagerLayout";
import Dashboard from "./pages/admin/Dashboard";
import City from "./pages/admin/City";
import DeliveryStation from "./pages/admin/DeliveryStation";
import Product from "./pages/admin/Product";
import ProductCategory from "./pages/admin/ProductCategory";
import User from "./pages/admin/User";
import Vehicle from "./pages/admin/Vehicle";
import Warehouse from "./pages/admin/Warehouse";
import NotFound from "./ui/NotFound";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import DriverLayout from "./ui/DriverLayout";
import CustomerLayout from "./ui/CustomerLayout";
import Toast from "./ui/Toaster";
import ProtectedRoute from "./ui/ProtectedRoute";
import AuthRedirect from "./ui/AuthRedirect";



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route
              index
              path="/login"
              element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRedirect>
                  <Signup />
                </AuthRedirect>
              }
            />

            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminManagerLayout navLinks={adminNavLinks} />
                </ProtectedRoute>
              }
            >
              <Route path="" element={<Navigate to="dashboard" />} />
              <Route index path="dashboard" element={<Dashboard />} />
              <Route path="warehouse" element={<Warehouse />} />
              <Route path="deliveryStation" element={<DeliveryStation />} />
              <Route path="product" element={<Product />} />
              <Route path="productCategory" element={<ProductCategory />} />
              <Route path="user" element={<User />} />
              <Route path="vehicle" element={<Vehicle />} />
              <Route path="city" element={<City />} />
            </Route>
            <Route
              path="warehouseManager"
              element={
                <ProtectedRoute allowedRole="warehouseManager">
                  <AdminManagerLayout navLinks={warehouseManagerNavLinks} />
                </ProtectedRoute>
              }
            />
            <Route
              path="deliveryStationManager"
              element={
                <ProtectedRoute allowedRole="deliveryStationManager">
                  <AdminManagerLayout navLinks={adminNavLinks} />
                </ProtectedRoute>
              }
            />
            <Route
              path="warehouseDriver"
              element={
                <ProtectedRoute allowedRole="warehouseDriver">
                  <DriverLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="deliveryStationDriver"
              element={
                <ProtectedRoute allowedRole="deliveryStationDriver">
                  <DriverLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="customer"
              element={
                <ProtectedRoute allowedRole="customer">
                  <CustomerLayout />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toast />
      </QueryClientProvider>
    </div>
  );
}
