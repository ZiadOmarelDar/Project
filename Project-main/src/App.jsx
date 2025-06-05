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
import AdoptionPetsSection from "./Components/AdoptionPage/AdoptionPetsSection";
import PetDetails from "./Components/AdoptionPage/PetDetails";
import FavoritesPage from "./Components/AdoptionPage/FavoritesPage";
import TrainHome from "./Components/Train/TrainHome";
import DogTrain from "./Components/Train/DogTrain";
import CatTrain from "./Components/Train/CatTrain";
import Tips from "./Components/Train/Tips";
import VetClinicFinder from "./Components/clinic/VetClinicFinder";
import CheckoutPage from "./Components/Shop/CheckoutPage";
import TrainersList from "./Components/Train/TrainersList"; 
import TrainerDetails from "./Components/Train/TrainerDetails";
import ChecklistComponent from "./Components/Checklist/ChecklistComponent";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AdoptionPage" element={<AdoptionPage />} />
          <Route path="/productsPage" element={<ProductsPage />} />
          <Route path="/products/product/:id" element={<ProductPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/CheckoutPage" element={<CheckoutPage />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/PetTravelRequirements" element={<PetTravelRequirements />} />
          <Route path="/AdoptionPetsSection" element={<AdoptionPetsSection />} />
          <Route path="/pet/:id" element={<PetDetails />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/trainHome" element={<TrainHome />} />
          <Route path="/dogTrain" element={<DogTrain />} />
          <Route path="/catTrain" element={<CatTrain />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/VetClinicFinder" element={<VetClinicFinder />} />
          <Route path="/ChecklistComponent" element={<ChecklistComponent />} />
          <Route path="/trainers" element={<TrainersList />} /> {/* تأكدي إن السطر ده موجود */}
          <Route path="/trainer/:trainerId" element={<TrainerDetails />} /> {/* تأكدي إن السطر ده موجود */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;