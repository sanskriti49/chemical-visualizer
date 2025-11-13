import React, { useState } from "react";
import axios from "axios";
import ExperimentIcon from "../assets/icons/experiment.svg?react";

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

const Login = ({ onLoginSuccess }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const response = await axios.post("http://localhost:8000/api/login/", {
				username: username,
				password: password,
			});
			onLoginSuccess(response.data.token);
		} catch (err) {
			if (err.response?.data?.non_field_errors) {
				setError(err.response.data.non_field_errors[0]);
			} else {
				setError("Login failed. Check connection and credentials.");
			}
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
					<div className="md:hidden flex flex-col items-center mb-8">
						<ExperimentIcon className="w-24 h-24 text-blue-400 text-opacity-70" />
					</div>

					<h2 className="text-2xl font-bold text-white">Welcome Back</h2>
					<p className="mt-2 text-gray-400">Please sign in to continue.</p>

					<form onSubmit={handleSubmit} className="mt-8 space-y-6">
						{error && (
							<div className="p-3 bg-red-900/50 border border-red-500/50 rounded-md">
								<p className="text-sm text-red-300">{error}</p>
							</div>
						)}

						<div className="space-y-4">
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
									placeholder="Enter your username"
								/>
							</div>
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
									placeholder="Enter your password"
								/>
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className="cursor-pointer w-full flex justify-center py-3 px-4 text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-[#0c1142] focus:ring-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
							>
								{isLoading ? (
									<>
										<Spinner />
										<span>Signing In...</span>
									</>
								) : (
									"Sign In"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
