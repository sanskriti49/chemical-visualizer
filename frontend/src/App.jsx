import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RootRedirect from "./components/RootRedirect";
import ChangePassword from "./pages/ChangePassword";
import SignUp from "./pages/SignUp";

function App() {
	const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

	const handleLogin = (token) => {
		localStorage.setItem("authToken", token);
		setAuthToken(token);
	};

	const handleLogout = () => {
		localStorage.removeItem("authToken");
		setAuthToken(null);
	};

	return (
		<Routes>
			<Route path="/register" element={<SignUp />} />

			<Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

			<Route path="/" element={<RootRedirect />} />

			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard onLogout={handleLogout} />
					</ProtectedRoute>
				}
			/>

			<Route
				path="/change-password"
				element={
					<ProtectedRoute>
						<ChangePassword onLogout={handleLogout} />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default App;
