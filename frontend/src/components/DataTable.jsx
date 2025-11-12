import React from "react";

const DataTable = ({ data }) => {
	if (!data || data.length === 0) {
		return <p>No data available to display.</p>;
	}

	const headers = Object.keys(data[0]);

	return (
		<div className="overflow-x-auto relative shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left text-gray-500">
				<thead className="text-xs text-gray-900 uppercase bg-gray-400">
					<tr>
						{headers.map((header) => (
							<th key={header} scope="col" className="py-3 px-6">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, index) => (
						<tr
							key={index}
							className="bg-gray-300 border-b border-gray-400 hover:bg-gray-100"
						>
							{headers.map((header) => (
								<td
									key={`${index}-${header}`}
									className="text-gray-900  py-4 px-6"
								>
									{row[header]}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default DataTable;
