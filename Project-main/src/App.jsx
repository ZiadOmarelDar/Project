import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import Home from "./Components/HomePage/Home";
import Layout from "./Components/Layout/Layout";
import AdoptionPage from "./Components/AdoptionPage/AdoptionPage";
import ProductsPage from "./Components/Shop/ProductsPage";
import ProductPage from "./Components/Shop/ProductPage";
import Shop from "./Components/Shop/Shop";
import Cart from "./Components/Shop/Cart";
import Community from "./Components/Community/Community";
import Profile from "./Components/Profile/Profile";
import ProfileEdit from "./Components/ProfileEdit/ProfileEdit";
import PetTravelRequirements from "./Components/PetTravelRequirements/PetTravelRequirements";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="AdoptionPage" element={<AdoptionPage />} />
          <Route path="productsPage" element={<ProductsPage />} />
          <Route path="/products/product/:id" element={<ProductPage />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cart" element={<Cart />} />
          <Route path="community" element={<Community />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/PetTravelRequirements" element={<PetTravelRequirements />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
