"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);
// fixed order for status display in chart
const STATUS_ORDER = ["pending", "assigned", "rejected"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  rejected: "Rejected",
};

interface IssueForChart {
  status?: string;
}

interface OverviewChartProps {
  issues?: IssueForChart[];
}
// bar chart showing teh issue distribution by status
const OverviewChart = ({ issues = [] }: OverviewChartProps) => {

  // to count issues per status
  const byStatus = STATUS_ORDER.reduce<Record<string, number>>((acc, status) => {
    acc[status] = issues.filter((f) => (f.status || "").toLowerCase() === status).length;
    return acc;
  }, {});

  const data = {
    labels: STATUS_ORDER.map((s) => STATUS_LABELS[s] || s),
    datasets: [
      {
        label: "Issues by status",
        data: STATUS_ORDER.map((s) => byStatus[s] ?? 0),
        backgroundColor: ["#f59e0b", "#3b82f6", "#ef4444"],
      },
    ],
  };

  return <Bar data={data} options={{ responsive: true, maintainAspectRatio: true }} />;
};

export default OverviewChart;
