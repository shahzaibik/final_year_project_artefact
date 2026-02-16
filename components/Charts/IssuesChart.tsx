"use client";

import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
// register required chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// generate last 6 months including current month
function getLast6Months() {
  const now = new Date();
  const months: { year: number; month: number; label: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_NAMES[d.getMonth()] });
  }
  return months;
}

interface IssueForChart {
  createdAt?: string;
  status?: string;
}

interface IssuesChartProps {
  issues?: IssueForChart[];
}
//to display line chart showing number of issues in the last 6 months
const IssuesChart = ({ issues = [] }: IssuesChartProps) => {
  const last6 = getLast6Months();
   //to  count issues per month
  const counts = last6.map(({ year, month }) =>
    issues.filter((f) => {
      const d = f.createdAt ? new Date(f.createdAt) : null;
      return d && d.getFullYear() === year && d.getMonth() === month;
    }).length
  );

  const data = {
    labels: last6.map((m) => m.label),
    datasets: [
      {
        label: "Issues",
        data: counts,
        borderColor: "#003366",
        backgroundColor: "rgba(0, 51, 102, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} options={{ responsive: true, maintainAspectRatio: true }} />;
};

export default IssuesChart;
