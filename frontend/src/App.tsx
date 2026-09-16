import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Products from './pages/Product';
import Material from './pages/Material';
import ProductDetail from './pages/ProductDetail';
import MaterialDetail from './pages/MaterialDetail';
import Cart from './pages/Cart';
import Home from './Home';
import AdminVentes from './pages/admin/AdminVentes';
import AdminLayout from './pages/admin/Adminlayout';
import Admindashboard from './pages/admin/Admindashboard';
import AdminStocks from './pages/admin/AdminStocks';

export default function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Routes Client */}
        <Route path="/" element={<Home />} />
        <Route path="/produits" element={<Products />} />
        <Route path="/materiel" element={<Material />} />
        <Route path="/produit/:id" element={<ProductDetail />} />
        <Route path="/materiel/:id" element={<MaterialDetail />} />
        <Route path="/panier" element={<Cart />} />
        {/* Routes Administrateur */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Admindashboard />} />
          <Route path="stocks" element={<AdminStocks />} />
          <Route path="ventes" element={<AdminVentes />} />
          <Route path="parametres" element={<div><h2>Paramètres (À venir)</h2></div>} />
        </Route>
      </Routes>
    </CartProvider>
  );
}