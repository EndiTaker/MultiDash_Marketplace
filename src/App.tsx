import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext"; // добавлен слеш
import { Toaster } from "sonner";
import { Auth } from "@/pages/Auth"; // добавлен слеш
import { Dashboard } from "@/pages/Dashboard";
import { Products } from "@/pages/Products";
import { Stocks } from "@/pages/Stocks";
import { Analytics } from "@/pages/Analytics";
import { Marketplaces } from "@/pages/Marketplaces";
import { Settings } from "@/pages/Settings";
import { PrivateRoute } from "@/components/PrivateRoute"; // добавлен слеш
import { Layout } from "@/components/Layout"; // добавлен слеш

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="stocks" element={<Stocks />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="marketplaces" element={<Marketplaces />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
