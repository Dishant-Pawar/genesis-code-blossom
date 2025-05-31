
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import CreateProduct from "@/pages/CreateProduct";
import EditProduct from "@/pages/EditProduct";
import Ingredients from "@/pages/Ingredients";
import CreateIngredient from "@/pages/CreateIngredient";
import EditIngredient from "@/pages/EditIngredient";
import ProductPreview from "@/pages/ProductPreview";
import ChangeImage from "@/pages/ChangeImage";
import ProductDetails from "@/pages/ProductDetails";
import IngredientDetails from "@/pages/IngredientDetails";
import ImportProducts from "@/pages/ImportProducts";
import ImportIngredients from "@/pages/ImportIngredients";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/products/create" element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            } />
            <Route path="/products/:id/edit" element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            } />
            <Route path="/products/:id/preview" element={
              <ProtectedRoute>
                <ProductPreview />
              </ProtectedRoute>
            } />
            <Route path="/products/:id/change-image" element={
              <ProtectedRoute>
                <ChangeImage />
              </ProtectedRoute>
            } />
            <Route path="/products/:id/details" element={
              <ProtectedRoute>
                <ProductDetails />
              </ProtectedRoute>
            } />
            <Route path="/products/import" element={
              <ProtectedRoute>
                <ImportProducts />
              </ProtectedRoute>
            } />
            <Route path="/ingredients" element={
              <ProtectedRoute>
                <Ingredients />
              </ProtectedRoute>
            } />
            <Route path="/ingredients/create" element={
              <ProtectedRoute>
                <CreateIngredient />
              </ProtectedRoute>
            } />
            <Route path="/ingredients/:id/edit" element={
              <ProtectedRoute>
                <EditIngredient />
              </ProtectedRoute>
            } />
            <Route path="/ingredients/:id/details" element={
              <ProtectedRoute>
                <IngredientDetails />
              </ProtectedRoute>
            } />
            <Route path="/ingredients/import" element={
              <ProtectedRoute>
                <ImportIngredients />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
