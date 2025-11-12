import React, { useState } from "react";
import apiClient from "../api";
import { ArrowLeft, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

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

const ChangePassword = () => {
	const navigate = useNavigate();
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword1, setNewPassword1] = useState("");
	const [newPassword2, setNewPassword2] = useState("");
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccessMessage("");

		if (newPassword1 !== newPassword2) {
			setError("New passwords do not match.");
			setIsLoading(false);
			return;
		}

		try {
			await apiClient.put("/change-password/", {
				old_password: oldPassword,
				new_password1: newPassword1,
				new_password2: newPassword2,
			});
			setSuccessMessage("Password updated successfully!");

			setOldPassword("");
			setNewPassword1("");
			setNewPassword2("");

			setTimeout(() => {
				navigate("/dashboard");
			}, 1500);
		} catch (err) {
			const errorData = err.response?.data;
			if (errorData) {
				const messages = Object.values(errorData).flat().join(" ");
				setError(messages || "Failed to change password. Please try again.");
			} else {
				setError("An unexpected error occurred.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#050822] flex items-center justify-center font-inter p-4">
			<div className="w-full max-w-md mx-auto bg-[#0c1142] shadow-2xl rounded-2xl p-8 border border-blue-900/50">
				<h2 className="text-2xl font-bold text-white mb-6 text-center">
					Change Your Password
				</h2>

				<form onSubmit={handleSubmit} className="space-y-6">
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

					<div>
						<label className="text-sm font-medium text-gray-400">
							Current Password
						</label>
						<input
							type="password"
							required
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							className="mt-1 block w-full px-4 py-3 bg-[#050822] border border-blue-900/80 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-400">
							New Password
						</label>
						<input
							type="password"
							required
							value={newPassword1}
							onChange={(e) => setNewPassword1(e.target.value)}
							className="mt-1 block w-full px-4 py-3 bg-[#050822] border border-blue-900/80 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-500"
						/>
					</div>
					<div>
						<label className="text-sm font-medium text-gray-400">
							Confirm New Password
						</label>
						<input
							type="password"
							required
							value={newPassword2}
							onChange={(e) => setNewPassword2(e.target.value)}
							className="mt-1 block w-full px-4 py-3 bg-[#050822] border border-blue-900/80 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-900 focus:border-blue-500"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="cursor-pointer w-full flex justify-center py-3 px-4 text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800"
					>
						{isLoading ? <Spinner /> : "Update Password"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<Link
						to="/dashboard"
						className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center space-x-2"
					>
						<ArrowLeft size={16} />
						<span>Back to Dashboard</span>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ChangePassword;
