"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Dashboard/Layout";
import APIRoutes from "@/constants/apiRoutes";
import Routes from "@/constants/routes";
// page for tenants to submit a new issue
const AddNewIssuePage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  // to verify user role only Tenant allowed
  useEffect(() => {
    const check = async () => {
      const res = await fetch(APIRoutes.AUTH_ME, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setRole(data.role);
        if (data.role !== "Tenant") {
          router.replace(Routes.ISSUES);
        }
      }
    };
    check();
  }, [router]);
  // handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(APIRoutes.ISSUES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to submit issue.");
        return;
      }
      router.push(Routes.ISSUES);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // to prevent rendering form until role is confirmed
  if (role !== "Tenant") {
    return (
      <Layout>
        <div className="container mx-auto p-4">
          <p className="text-primary">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-3 sm:p-4 max-w-2xl">
        <h1 className="text-xl font-bold text-primary mb-6">Add New Issue</h1>

        {error && (
          <p className="text-red-500 bg-red-50 p-2 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Leaking faucet in kitchen"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-primary"
              onClick={() => router.push(Routes.ISSUES)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddNewIssuePage;
