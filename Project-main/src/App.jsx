import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/HomePage/Home';
import Layout from './Components/Layout/Layout';
import AdoptionPage from './Components/AdoptionPage/AdoptionPage';
import ProductsPage from './Components/Shop/ProductsPage';
import ProductPage from './Components/Shop/ProductPage';
import Shop from './Components/Shop/Shop';
import Cart from './Components/Shop/Cart';
import Community from './Components/Community/Community';

function App() {
	return (
		<Router>
			<Routes>
				<Route
					path='/'
					element={<Layout />}>
					<Route
						index
						element={<Home />}
					/>
					<Route
						path='register'
						element={<Register />}
					/>
					<Route
						path='login'
						element={<Login />}
					/>
					<Route
						path='AdoptionPage'
						element={<AdoptionPage />}
					/>
					<Route
						path='productsPage'
						element={<ProductsPage />}
					/>
					<Route
						path='/products/product/:id'
						element={<ProductPage />}
					/>
					<Route
						path='shop'
						element={<Shop />}
					/>
					<Route
						path='cart'
						element={<Cart />}
					/>
					<Route
						path='community'
						element={<Community />}
					/>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
