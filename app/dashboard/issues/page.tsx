"use client";

import { useState, useEffect, useCallback } from "react";
import Layout from "@/components/Dashboard/Layout";
import { FiSearch } from "react-icons/fi";
import APIRoutes from "@/constants/apiRoutes";

interface IssueItem {
  _id: string;
  title: string;
  description: string;
  status: string;
  tenantId?: { name?: string; email?: string };
  handymanId?: { _id?: string; name?: string; email?: string } | null;
  createdAt: string;
}

interface HandymanOption {
  _id: string;
  name: string;
  email: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  assigned: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
};
// issues listing page Tenant and Landlord views
const IssuesPage = () => {
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [handymen, setHandymen] = useState<HandymanOption[]>([]);
  const [role, setRole] = useState<"Landlord" | "Tenant" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
// to fetch all issues
  const fetchIssues = useCallback(async () => {
    try {
      const res = await fetch(APIRoutes.ISSUES, { credentials: "include" });
      if (!res.ok) {
        setIssues([]);
        return;
      }
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []);
    } catch {
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, []);
// load user role and issues
  useEffect(() => {
    const load = async () => {
      const meRes = await fetch(APIRoutes.AUTH_ME, { credentials: "include" });
      if (meRes.ok) {
        const me = await meRes.json();
        setRole(me.role === "Tenant" ? "Tenant" : "Landlord");
      }
      await fetchIssues();
    };
    load();
  }, [fetchIssues]);
// to fetch handymen only for landlord
  useEffect(() => {
    if (role !== "Landlord") return;
    const fetchHandymen = async () => {
      try {
        const res = await fetch(APIRoutes.HANDYMEN, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setHandymen(Array.isArray(data) ? data : []);
        }
      } catch {
        setHandymen([]);
      }
    };
    fetchHandymen();
  }, [role]);
// assign handyman to issue
  const handleAssign = async (issueId: string, handymanId: string) => {
    if (!handymanId || !issueId) return;
    setAssigningId(issueId);
    try {
      const res = await fetch(`${APIRoutes.ISSUES}/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ handymanId: String(handymanId) }),
      });
      if (res.ok) {
        await fetchIssues();
      }
    } finally {
      setAssigningId(null);
    }
  };
// reject issue 
  const handleReject = async (issueId: string) => {
    if (!issueId || !confirm("Are you sure you want to reject this issue? The tenant will be notified."))
      return;
    setRejectingId(issueId);
    try {
      const res = await fetch(`${APIRoutes.ISSUES}/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reject: true }),
      });
      if (res.ok) {
        await fetchIssues();
      }
    } finally {
      setRejectingId(null);
    }
  };

  const isLandlord = role === "Landlord";
// to filter issues based on search + role
  const searchLower = searchQuery.trim().toLowerCase();
  const filteredIssues = issues.filter((issue) => {
    const matchesTitle = !searchLower || (issue.title && issue.title.toLowerCase().includes(searchLower));
    if (isLandlord) {
      const tenantName = issue.tenantId && typeof issue.tenantId === "object" ? issue.tenantId.name?.toLowerCase() : "";
      const tenantEmail = issue.tenantId && typeof issue.tenantId === "object" ? issue.tenantId.email?.toLowerCase() : "";
      const matchesTenant =
        !searchLower ||
        (tenantName && tenantName.includes(searchLower)) ||
        (tenantEmail && tenantEmail.includes(searchLower));
      return matchesTitle || matchesTenant;
    }
    return matchesTitle;
  });

  return (
    <Layout>
      <div className="container mx-auto p-3 sm:p-4">
        <h1 className="text-xl font-bold text-primary mb-6">
          {isLandlord ? "All Issues (Tenants)" : "My Issues"}
        </h1>

        <div className="relative w-full max-w-md mb-6">
          <input
            type="text"
            placeholder={isLandlord ? "Search by title, tenant name or email" : "Search by issue title"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-[0.5px] focus:ring-primary text-primary"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none" />
        </div>

        {loading ? (
          <p className="text-primary">Loading...</p>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full table-auto bg-white border border-gray-300 rounded-lg text-primary min-w-[600px]">
              <thead className="bg-primary text-white">
                <tr>
                  {isLandlord && (
                    <th className="px-4 py-2 text-left">Tenant</th>
                  )}
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  {isLandlord && (
                    <th className="px-4 py-2 text-left">Handyman</th>
                  )}
                  {isLandlord && (
                    <th className="px-4 py-2 text-left">Assign</th>
                  )}
                  {isLandlord && (
                    <th className="px-4 py-2 text-left">Actions</th>
                  )}
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue._id} className="border-t border-gray-300 hover:bg-gray-50">
                    {isLandlord && (
                      <td className="px-4 py-3">
                        {issue.tenantId && typeof issue.tenantId === "object"
                          ? [issue.tenantId.name, issue.tenantId.email].filter(Boolean).join(" / ") || "—"
                          : "—"}
                      </td>
                    )}
                    <td className="px-4 py-3">{issue.title}</td>
                    <td className="px-4 py-3 max-w-xs truncate">{issue.description || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm capitalize ${
                          statusColors[issue.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {issue.status.replace("_", " ")}
                      </span>
                    </td>
                    {isLandlord && (
                      <td className="px-4 py-3">
                        {issue.handymanId && typeof issue.handymanId === "object"
                          ? issue.handymanId.name || issue.handymanId.email || "—"
                          : "—"}
                      </td>
                    )}
                    {isLandlord && (
                      <td className="px-4 py-3">
                        <select
                          className="border border-gray-300 rounded px-2 py-1 text-sm w-full max-w-[180px]"
                          value={
                            issue.handymanId && typeof issue.handymanId === "object" && issue.handymanId._id
                              ? String(issue.handymanId._id)
                              : ""
                          }
                          onChange={(e) => {
                            const id = e.target.value?.trim();
                            if (id) handleAssign(issue._id, id);
                          }}
                          disabled={assigningId === issue._id || issue.status === "rejected"}
                        >
                          <option value="">Select handyman</option>
                          {handymen.map((h) => (
                            <option key={h._id} value={String(h._id)}>
                              {h.name} ({h.email})
                            </option>
                          ))}
                        </select>
                      </td>
                    )}
                    {isLandlord && (
                      <td className="px-4 py-3">
                        {issue.status === "pending" && (
                          <button
                            type="button"
                            onClick={() => handleReject(issue._id)}
                            disabled={rejectingId === issue._id}
                            className="px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {rejectingId === issue._id ? "Rejecting…" : "Reject"}
                          </button>
                        )}
                        {issue.status !== "pending" && <span className="text-gray-400">—</span>}
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredIssues.length === 0 && (
              <p className="text-center text-primary py-8">No issues yet.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default IssuesPage;
