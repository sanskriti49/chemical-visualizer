import { useState, useRef } from "react";
import apiClient from "../api";

const UploadIcon = () => (
	<svg
		className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 20 16"
	>
		<path
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
		/>
	</svg>
);

const FileIcon = () => (
	<svg
		className="w-8 h-8 text-gray-500"
		fill="none"
		stroke="currentColor"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
		></path>
	</svg>
);

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

const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const ProgressBar = ({ progress }) => (
	<div className="w-full bg-gray-600 rounded-full h-2.5">
		<div
			className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
			style={{ width: `${progress}%` }}
		></div>
	</div>
);

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const fileInputRef = useRef(null);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setSelectedFile(file);
			setUploadProgress(0);
		}
	};

	const onButtonClick = () => {
		fileInputRef.current.click();
	};

	const handleDrag = (event) => {
		event.preventDefault();
		event.stopPropagation();
		if (event.type === "dragenter" || event.type === "dragover") {
			setIsDragging(true);
		} else if (event.type === "dragleave") {
			setIsDragging(false);
		}
	};

	const handleDrop = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
		const file = event.dataTransfer.files[0];
		if (file) {
			setSelectedFile(file);
			setUploadProgress(0);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!selectedFile) {
			onUploadError("Please select a file first!");
			return;
		}

		setIsLoading(true);
		setUploadProgress(0);
		const formData = new FormData();
		formData.append("file", selectedFile);

		try {
			const response = await apiClient.post(
				// "http://localhost:8000/api/upload/",
				"/upload/",
				formData,
				{
					headers: { "Content-Type": "multipart/form-data" },

					onUploadProgress: (progressEvent) => {
						const percentCompleted = Math.round(
							(progressEvent.loaded * 100) / progressEvent.total
						);
						setUploadProgress(percentCompleted);
					},
				}
			);
			onUploadSuccess(response.data);
			setTimeout(() => {
				setSelectedFile(null);
				setUploadProgress(0);
			}, 1000);
		} catch (err) {
			if (err.response && err.response.status === 401) {
				onUploadError(
					"Your session has expired. Please log out and log in again."
				);
			} else {
				const errorMessage =
					err.response?.data?.error || "File upload failed. Please try again.";
				onUploadError(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};
	return (
		<div className="max-w-md w-full mx-auto p-4">
			<h2 className="text-2xl font-bold mb-4 text-center text-gray-200">
				Upload Equipment Data
			</h2>
			<form
				onSubmit={handleSubmit}
				className="bg-gray-800 rounded-lg shadow-xl p-6"
			>
				{!selectedFile ? (
					<div
						onDragEnter={handleDrag}
						onDragOver={handleDrag}
						onDragLeave={handleDrag}
						onDrop={handleDrop}
						className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300
                            ${
															isDragging
																? "border-blue-500 bg-gray-700"
																: "border-gray-600 hover:border-gray-500 hover:bg-gray-700"
														}`}
						onClick={onButtonClick}
					>
						<UploadIcon />
						<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
							<span className="font-semibold">Click to upload</span> or drag and
							drop
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							CSV, XLS, or XLSX files
						</p>
						<input
							ref={fileInputRef}
							type="file"
							onChange={handleFileChange}
							className="hidden"
						/>
					</div>
				) : (
					<div className="bg-gray-700 p-4 rounded-lg space-y-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<FileIcon />
								<div className="text-left">
									<p className="text-sm font-medium text-gray-200 truncate">
										{selectedFile.name}
									</p>
									<p className="text-xs text-gray-400">
										{formatFileSize(selectedFile.size)}
									</p>
								</div>
							</div>
							{!isLoading && (
								<button
									type="button"
									onClick={() => setSelectedFile(null)}
									className="text-gray-400 hover:text-white transition-colors"
								>
									<svg
										className="w-6 h-6"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M6 18L18 6M6 6l12 12"
										></path>
									</svg>
								</button>
							)}
						</div>
						{isLoading && <ProgressBar progress={uploadProgress} />}
					</div>
				)}

				{selectedFile && (
					<div className="mt-6">
						<button
							type="submit"
							disabled={isLoading}
							className="cursor-pointer w-full flex justify-center items-center py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300"
						>
							{isLoading ? (
								<>
									<Spinner /> Uploading...
								</>
							) : (
								"Upload File"
							)}
						</button>
					</div>
				)}
			</form>
		</div>
	);
};

export default FileUpload;
