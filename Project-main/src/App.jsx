import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Home from "./Components/HomePage/Home";
import Layout from "./Components/Layout/Layout"; 
import AdoptionPage from "./Components/AdoptionPage/AdoptionPage";

import ProductsPage from "./Components/ccc/ProductsPage";
import ProductPage from "./Components/ccc/ProductPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="AdoptionPage" element={<AdoptionPage />} />
          <Route path="productsPage" element={<ProductsPage />} />  {/* تعديل المسار */}
          <Route path="/products/product/:id" element={<ProductPage />} /> {/* تعديل مسار التفاصيل */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
