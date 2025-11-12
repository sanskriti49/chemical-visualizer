import React from "react";
import { Scatter } from "react-chartjs-2";
import {
	Chart as ChartJS,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	Title,
} from "chart.js";

ChartJS.register(
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Legend,
	Title
);

const PressureTempScatterPlot = ({ data }) => {
	if (!data || data.length === 0) {
		return <p>No data for scatter plot.</p>;
	}
	const scatterData = data.map((item) => ({
		x: item.Pressure,
		y: item.Temperature,
	}));

	const chartData = {
		datasets: [
			{
				label: "Pressure vs. Temperature",
				data: scatterData,
				backgroundColor: "rgba(255, 99, 132, 0.8)",
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: { position: "top" },
			title: {
				display: true,
				text: "Relationship between Pressure and Temperature",
			},
		},
		scales: {
			x: {
				title: {
					display: true,
					text: "Pressure",
				},
			},
			y: {
				title: {
					display: true,
					text: "Temperature",
				},
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

	return <Scatter options={options} data={chartData} />;
};

export default PressureTempScatterPlot;
