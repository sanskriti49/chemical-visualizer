import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const EquipmentPieChart = ({ summary }) => {
	if (!summary || !summary.equipment_type_distribution) {
		return <p>No chart data available</p>;
	}
	const distribution = summary.equipment_type_distribution;

	const chartData = {
		labels: Object.keys(distribution),
		datasets: [
			{
				label: "# of Equipment",
				data: Object.values(distribution),
				backgroundColor: [
					"rgba(255, 99, 132, 0.6)",
					"rgba(54, 162, 235, 0.6)",
					"rgba(255, 206, 86, 0.6)",
					"rgba(75, 192, 192, 0.6)",
					"rgba(153, 102, 255, 0.6)",
					"rgba(255, 159, 64, 0.6)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: { display: true, text: "Equipment Type Distribution" },
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
	return <Pie data={chartData} options={options} />;
};

export default EquipmentPieChart;
