import { useEffect, useState } from "react";
import apiClient from "../api";

const HistoryPanel = ({ onSelect }) => {
	const [history, setHistory] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchHistory = async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.get("/history/");
			setHistory(response.data);
			setError(null);
		} catch (err) {
			setError("Could not fetch history.");

			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	const handleItemClick = async (datasetId) => {
		onSelect(datasetId);
	};

	if (isLoading) return <p>Loading history...</p>;
	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div>
			<div>
				<h3 className="font-bold text-lg mb-2">Upload History (Last 5)</h3>
				{history.length === 0 ? (
					<p className="text-sm text-gray-500">No uploads yet.</p>
				) : (
					<ul className="space-y-2">
						{history.map((item) => (
							<li
								key={item.id}
								onClick={() => handleItemClick(item.id)}
								className="group text-sm  text-blue-600 hover:underline cursor-pointer w-fit p-2 rounded hover:bg-blue-300 duration-200"
							>
								{item.filename}
								<span className="text-xs text-gray-400 block group-hover:text-black">
									Uploaded on: {new Date(item.uploaded_at).toLocaleString()}
								</span>
							</li>
						))}
					</ul>
				)}

				<button
					onClick={fetchHistory}
					className="cursor-pointer text-white mt-4 text-base bg-blue-900 px-4 py-2 rounded hover:bg-blue-700 duration-150"
				>
					Refresh History
				</button>
			</div>
		</div>
	);
};

export default HistoryPanel;
