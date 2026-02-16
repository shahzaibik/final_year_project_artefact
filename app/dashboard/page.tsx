"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Dashboard/Layout";
import IssuesChart from "@/components/Charts/IssuesChart";
import OverviewChart from "@/components/Charts/OverviewChart";
import TenantStatusChart from "@/components/Charts/TenantStatusChart";
import APIRoutes from "@/constants/apiRoutes";
import Routes from "@/constants/routes";
import Link from "next/link";

interface IssueItem {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  tenantId?: { name?: string };
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  rejected: "Rejected",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  assigned: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
};
// main dashboard different views for Landlord and Tenant
const Dashboard = () => {
  const [role, setRole] = useState<"Landlord" | "Tenant" | null>(null);
  const [issues, setIssues] = useState<IssueItem[]>([]);

  useEffect(() => {
    const fetchIssues = async (retryCount = 0): Promise<void> => {
      const res = await fetch(APIRoutes.ISSUES, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : [];
        setIssues(list);
        return;
      }
      const isServerError = res.status >= 500;
      if (isServerError && retryCount < 2) {
        await new Promise((r) => setTimeout(r, 600 * (retryCount + 1)));
        return fetchIssues(retryCount + 1);
      }
      setIssues([]);
    };
    // to load user role first, then fetch issues
    const load = async () => {
      try {
        const meRes = await fetch(APIRoutes.AUTH_ME, { credentials: "include" });
        if (!meRes.ok) return;
        const me = await meRes.json();
        setRole(me.role === "Tenant" ? "Tenant" : "Landlord");

        await fetchIssues();
      } catch {
        setIssues([]);
      }
    };
    load();
  }, []);
  // to show latest 5 issues for landlord view
  const recentIssues = issues.slice(0, 5);

  const isLandlord = role === "Landlord";

  return (
    <Layout>
      <div className="container mx-auto p-3 sm:p-4 space-y-6 sm:space-y-8">
        {isLandlord && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-primary">
            <div className="bg-tertiary shadow rounded-lg p-4 min-h-[260px] sm:min-h-[280px]">
              <h2 className="text-lg font-bold mb-2">Issues</h2>
              <div className="relative h-[220px] sm:h-[240px]">
                <IssuesChart issues={issues} />
              </div>
            </div>
            <div className="bg-tertiary shadow rounded-lg p-4 min-h-[260px] sm:min-h-[280px]">
              <h2 className="text-lg font-bold mb-2">Overview</h2>
              <div className="relative h-[220px] sm:h-[240px]">
                <OverviewChart issues={issues} />
              </div>
            </div>
          </div>
        )}

        {!isLandlord && (
          <div className="text-primary">
            <h2 className="text-xl font-bold mb-4">My Issues Overview</h2>
            <div className="bg-tertiary shadow rounded-lg p-6 md:p-8">
              <div className="max-w-sm mx-auto">
                <TenantStatusChart issues={issues} />
              </div>
              {issues.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                  You haven&apos;t submitted any issues yet.{" "}
                  <Link href={Routes.ADD_NEW_ISSUE} className="text-primary font-semibold hover:underline">
                    Add an issue
                  </Link>
                </p>
              )}
            </div>
          </div>
        )}

        {isLandlord && (
          <div className="text-primary">
            <h2 className="text-xl font-bold mb-4">Recent Requests</h2>
            <div className="bg-tertiary shadow rounded-lg p-6 md:p-8">
              {recentIssues.length === 0 ? (
                <p className="text-gray-500 py-4">No issues from tenants yet.</p>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-left min-w-[500px]">
                  <tbody>
                    {recentIssues.map((issue) => (
                      <tr key={issue._id} className="border-b border-gray-200 last:border-0">
                        <td className="py-4 pr-2">🔧</td>
                        <td className="py-4">
                          {isLandlord && issue.tenantId && typeof issue.tenantId === "object" && issue.tenantId.name
                            ? `${issue.tenantId.name}: ${issue.title}`
                            : issue.title}
                        </td>
                        <td className="py-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-sm font-medium ${statusColors[issue.status] || "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {statusLabels[issue.status] || issue.status}
                          </span>
                        </td>
                        <td className="py-4 text-gray-400 text-sm">
                          {new Date(issue.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
