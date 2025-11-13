import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Settings, FlaskConical } from "lucide-react";
import apiClient from "../api";
import ChemicalIcon from "../assets/icons/Chemical.svg?react";

import FileUpload from "../components/FileUpload";
import Alerts from "../components/Alerts";
import DataTable from "../components/DataTable";
import EquipmentBarChart from "../components/EquipmentBarChart";
import EquipmentPieChart from "../components/EquipmentPieChart";
import PressureTempScatterPlot from "../components/PressureTempScatterPlot";
import HistoryPanel from "../components/HistoryPanel";

const Dashboard = ({ onLogout }) => {
	const navigate = useNavigate();
	const historyPanelRef = useRef(null);

	const [currentDataSet, setCurrentDataSet] = useState(null);
	const [alert, setAlert] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = () => {
		onLogout();
		navigate("/login");
	};

	const handleUploadSuccess = (data) => {
		setCurrentDataSet(data);
		setAlert({
			message: "File uploaded and analyzed successfully",
			type: "success",
		});
		if (historyPanelRef.current) {
			historyPanelRef.current.refresh();
		}
	};

	const handleUploadError = (errorMessage) => {
		setAlert({ message: errorMessage, type: "error" });
	};

	const handleHistorySelect = async (datasetId) => {
		setIsLoading(true);
		setAlert(null);
		try {
			const response = await apiClient.get(`/datasets/${datasetId}/`);
			setCurrentDataSet(response.data);
			setAlert({
				message: `Successfully loaded '${response.data.filename}' from history.`,
				type: "success",
			});
		} catch (err) {
			setAlert({ message: "Failed to load dataset.", type: "error" });
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDownloadReport = async () => {
		if (!currentDataSet) return;
		try {
			const response = await apiClient.get(
				`/datasets/${currentDataSet.id}/report/`,
				{ responseType: "blob" }
			);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `report_${currentDataSet.id}.pdf`);
			document.body.appendChild(link);
			link.click();
			link.parentNode.removeChild(link);
		} catch (err) {
			setAlert({ message: "Failed to download report.", type: "error" });
			console.error(err);
		}
	};

	return (
		<div className="container font-inter mx-auto p-4 md:p-8">
			{alert && (
				<Alerts
					message={alert.message}
					type={alert.type}
					onClose={() => setAlert(null)}
				/>
			)}
			<header className="flex justify-center items-center space-x-3 mb-6">
				<div className="cursor-pointer flex items-center space-x-3">
					<FlaskConical size={34} color="#7880bf" />
					<h1 className="text-3xl md:text-4xl font-bold">
						Chemical Equipment Visualizer
					</h1>
				</div>
				<div className="absolute right-10 flex items-center space-x-4">
					<Link
						to="/change-password"
						className="cursor-pointer flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 duration-200"
					>
						<Settings size={16} />
						<span>Change Password</span>
					</Link>
					<button
						onClick={handleLogout}
						className="cursor-pointer flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 duration-200"
					>
						<LogOut size={16} />
						<span>Logout</span>
					</button>
				</div>
			</header>

			<main className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
				<aside className="md:col-span-1 space-y-6">
					<FileUpload
						onUploadSuccess={handleUploadSuccess}
						onUploadError={handleUploadError}
					/>
					<HistoryPanel ref={historyPanelRef} onSelect={handleHistorySelect} />
				</aside>

				<section className="md:col-span-3">
					{isLoading ? (
						<p>Loading...</p>
					) : currentDataSet ? (
						<div className="space-y-12">
							<div className="flex justify-end">
								<button
									onClick={handleDownloadReport}
									className="cursor-pointer px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
								>
									Download PDF Report
								</button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<div className="flex flex-col items-center">
									<h2 className="text-2xl font-semibold mb-4 text-center">
										Equipment Distribution
									</h2>
									<EquipmentBarChart summary={currentDataSet.summary} />
								</div>
								<div className="flex flex-col items-center relative h-80 w-full lg:h-96">
									<h2 className="text-2xl font-semibold mb-4 text-center">
										Equipment Distribution %
									</h2>
									<EquipmentPieChart summary={currentDataSet.summary} />
								</div>
							</div>

							<div className="flex flex-col items-center relative h-80 w-full md:h-96">
								<h2 className="text-2xl font-semibold mb-4 text-center">
									Pressure vs. Temperature
								</h2>
								<PressureTempScatterPlot data={currentDataSet.original_data} />
							</div>

							<div>
								<h2 className="text-2xl font-semibold mb-4 text-center">
									Raw Data ({currentDataSet.filename})
								</h2>
								<DataTable data={currentDataSet.original_data} />
							</div>
						</div>
					) : (
						<div className="flex flex-col items-center justify-center h-1/5 bg-gray-50 rounded-lg min-h-[50vh] text-gray-500 space-y-4">
							<ChemicalIcon className="w-30 h-30 opacity-50" />{" "}
							<p className="text-gray-500">
								Upload a file or select from history to begin analysis.
							</p>
						</div>
					)}
				</section>
			</main>
		</div>
	);
};

export default Dashboard;
