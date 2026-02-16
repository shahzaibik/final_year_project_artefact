"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
// fixed order to keep chart segments consistent
const STATUS_ORDER = ["pending", "assigned", "rejected"] as const;
const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  rejected: "Rejected",
};
const STATUS_COLORS = ["#f59e0b", "#3b82f6", "#ef4444"];
const BORDER_COLORS = ["#d97706", "#2563eb", "#dc2626"];

interface IssueForChart {
  status?: string;
}

interface TenantStatusChartProps {
  issues?: IssueForChart[];
}
// Doughnut chart for tenant issue 
const TenantStatusChart = ({ issues = [] }: TenantStatusChartProps) => {
  // Count issues per status
  const byStatus = STATUS_ORDER.reduce<Record<string, number>>((acc, status) => {
    acc[status] = issues.filter((f) => (f.status || "").toLowerCase() === status).length;
    return acc;
  }, {});

  const total = issues.length;
  const hasData = total > 0;

  const data = {
    labels: STATUS_ORDER.map((s) => STATUS_LABELS[s] || s),
    datasets: [
      {
        data: STATUS_ORDER.map((s) => (hasData ? byStatus[s] ?? 0 : 1)),
        backgroundColor: hasData ? STATUS_COLORS : ["#e5e7eb"],
        borderColor: hasData ? BORDER_COLORS : ["#d1d5db"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          // show percentage in tooltip
          label: (ctx: { label?: string; raw?: unknown }) => {
            const value = (ctx.raw ?? 0) as number;
            const pct = hasData && total > 0 ? ((value / total) * 100).toFixed(1) : "0";
            return `${ctx.label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="relative w-full" style={{ minHeight: 280 }}>
      <Doughnut data={data} options={options} />
      {hasData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <span className="text-3xl font-bold text-primary">{total}</span>
            <p className="text-sm text-gray-500 font-medium">Total Issues</p>
          </div>
        </div>
      )}
      {!hasData && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-sm text-gray-500 font-medium">No issues yet</p>
        </div>
      )}
    </div>
  );
};

export default TenantStatusChart;
