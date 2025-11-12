import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

const EquipmentBarChart = ({ summary }) => {
	if (!summary || !summary.equipment_type_distribution) {
		return <p>No chart data available.</p>;
	}
	const distribution = summary.equipment_type_distribution;

	const chartData = {
		labels: Object.keys(distribution),
		datasets: [
			{
				label: "Count of Equipment by Type",
				data: Object.values(distribution),
				backgroundColor: "rgba(75, 192, 192, 0.6)",
				borderColor: "rgba(75, 192, 192, 1)",
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: {
				display: true,
				text: "Equipment Type Distribution",
			},
		},
		onHover: (event, chartElement) => {
			const canvas = event.native.target;
			if (chartElement.length > 0) {
				canvas.style.cursor = "pointer";
			} else {
				canvas.style.cursor = "default";
			}
		},
	};

	return <Bar options={options} data={chartData} />;
};

export default EquipmentBarChart;
