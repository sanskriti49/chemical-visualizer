// src/pages/SignUp.jsx

import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ExperimentIcon from "../assets/icons/experiment.svg?react";

// You can reuse the Spinner component from your other files
const Spinner = () => (
	<svg
		className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle
			className="opacity-25"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			strokeWidth="4"
		></circle>
		<path
			className="opacity-75"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		></path>
	</svg>
);

const SignUp = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccessMessage("");

		if (password !== password2) {
			setError("Passwords do not match.");
			setIsLoading(false);
			return;
		}

		try {
			// NOTE: Use environment variables for your API URL in a real app!
			await axios.post("http://localhost:8000/api/register/", {
				username,
				email,
				password,
				password2,
			});

			setSuccessMessage(
				"Account created successfully! Redirecting to login..."
			);
			setTimeout(() => {
				navigate("/login");
			}, 2000); // Wait 2 seconds before redirecting
		} catch (err) {
			const errorData = err.response?.data;
			if (errorData) {
				// This handles DRF's error format (e.g., {"username": ["user with this username already exists."]})
				const messages = Object.values(errorData).flat().join(" ");
				setError(messages || "Registration failed. Please try again.");
			} else {
				setError(
					"An unexpected error occurred. Could not connect to the server."
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#050822] flex items-center justify-center font-inter p-4">
			<div className="w-full max-w-4xl mx-auto bg-[#0c1142] shadow-2xl rounded-2xl md:grid md:grid-cols-2 overflow-hidden border border-blue-900/50">
				<div className="hidden md:flex flex-col justify-center items-center p-12 text-center bg-black/20">
					<ExperimentIcon className="w-48 h-48 text-blue-400 text-opacity-70" />
					<h1 className="text-3xl font-bold mt-6 tracking-tight text-white">
						Chemical Equipment
					</h1>
					<p className="mt-2 text-blue-300">Parameter Visualiser</p>
				</div>

				<div className="p-8 md:p-12">
					<h2 className="text-2xl font-bold text-white">Create an Account</h2>
					<p className="mt-2 text-gray-400">
						Join to start visualizing your data.
					</p>

					<form onSubmit={handleSubmit} className="mt-8 space-y-5">
						{error && (
							<div className="p-3 bg-red-900/50 border border-red-500/50 rounded-md">
								<p className="text-sm text-red-300">{error}</p>
							</div>
						)}
						{successMessage && (
							<div className="p-3 bg-green-900/50 border border-green-500/50 rounded-md">
								<p className="text-sm text-green-300">{successMessage}</p>
							</div>
						)}

						<div className="space-y-4">
							{/* Username Input */}
							<div>
								<label
									htmlFor="username"
									className="text-sm font-medium text-gray-400"
								>
									Username
								</label>
								<input
									id="username"
									type="text"
									required
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									className="mt-1 block w-full px-4 py-3 bg-[#050822] border border-blue-900/80 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							{/* Email Input */}
							<div>
								<label
									htmlFor="email"
									className="text-sm font-medium text-gray-400"
								>
									Email Address
								</label>
								<input
									id="email"
									type="email"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="mt-1 block w-full px-4 py-3 bg-[#050822] border border-blue-900/80 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							{/* Password Input */}
							<div>
								<label
									htmlFor="password"
									className="text-sm font-medium text-gray-400"
								>
									Password
								</label>
								<input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="mt-1 block w-full px-4 py-3 bg-[#050822] border border-blue-900/80 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
							{/* Confirm Password Input */}
							<div>
								<label
									htmlFor="password2"
									className="text-sm font-medium text-gray-400"
								>
									Confirm Password
								</label>
								<input
									id="password2"
									type="password"
									required
									value={password2}
									onChange={(e) => setPassword2(e.target.value)}
									className="mt-1 block w-full px-4 py-3 bg-[#050822] border border-blue-900/80 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading || successMessage}
								className="cursor-pointer w-full flex justify-center py-3 px-4 text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed"
							>
								{isLoading ? <Spinner /> : "Create Account"}
							</button>
						</div>
					</form>
					<div className="mt-6 text-center">
						<p className="text-sm text-gray-400">
							Already have an account?{" "}
							<Link
								to="/login"
								className="font-medium text-blue-400 hover:text-blue-300"
							>
								Sign In
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
