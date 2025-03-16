import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/HomePage/Home';
import Layout from './Components/Layout/Layout';
import Shop from './Components/Shop/Shop';
import Cart from './Components/Cart/Cart';

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
						path='shop'
						element={<Shop />}
					/>
					<Route
						path='cart'
						element={<Cart />}
					/>
				</Route>
			</Routes>
		</Router>
	);
}

export default App;
