import React from "react";
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
	const token = localStorage.getItem("authToken");

	return token ? (
		<Navigate to="/dashboard" replace />
	) : (
		<Navigate to="/login" replace />
	);
};

export default RootRedirect;
