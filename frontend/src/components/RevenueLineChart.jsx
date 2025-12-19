import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function RevenueLineChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return <p>No data available</p>;
  }

  const data = {
    labels: chartData.map(d => d.transaction_date),
    datasets: [
      {
        label: "Revenue – Venues",
        data: chartData.map(d => Number(d.revenue)),
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.1)",
        tension: 0.4
      }
    ]
  };

  return <Line data={data} />;
}
