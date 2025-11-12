import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const LoginPage = ({ onLogin }) => {
	const navigate = useNavigate();

	const handleLoginSuccess = (token) => {
		onLogin(token);
		navigate("/dashboard");
	};

	return <Login onLoginSuccess={handleLoginSuccess} />;
};

export default LoginPage;
