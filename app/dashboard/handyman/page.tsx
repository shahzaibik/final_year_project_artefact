"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Layout from "@/components/Dashboard/Layout";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { FaMapMarkerAlt, FaRegTrashAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import AddHandyManModal, {
  HandyManFormData,
} from "@/components/Dashboard/AddHandyManModal";
import APIRoutes from "@/constants/apiRoutes";
import { DEFAULT_AVATAR_URL } from "@/constants/assets";

interface HandymanRow extends HandyManFormData {
  _id: string;
  profileImage?: string | null;
}
// Handyman management page

const HandyMan: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [handymen, setHandymen] = useState<HandymanRow[]>([]);
  const [selectedHandyman, setSelectedHandyman] = useState<HandyManFormData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
// to fetch handymen from API
  const fetchHandymen = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(APIRoutes.HANDYMEN, { credentials: "include" });
      if (!res.ok) {
        if (res.status === 403) setError("You do not have access to this page.");
        else setError("Failed to load handymen.");
        setHandymen([]);
        return;
      }
      const data = await res.json();
      setHandymen(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load handymen.");
      setHandymen([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHandymen();
  }, [fetchHandymen]);

  const handleAddOrEditHandyman = () => {
    fetchHandymen();
    setSelectedHandyman(null);
  };
// delete handyman
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this handyman?")) return;
    try {
      const res = await fetch(`${APIRoutes.HANDYMEN}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) fetchHandymen();
      else alert("Failed to delete handyman.");
    } catch {
      alert("Failed to delete handyman.");
    }
  };
// toggle expanded row
  const toggleRow = (index: number) => {
    setExpandedRows((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const searchLower = searchQuery.trim().toLowerCase();
  const locationLower = locationQuery.trim().toLowerCase();
  const filteredHandymen = handymen.filter((h) => {
    const matchesSearch =
      !searchLower ||
      h.name?.toLowerCase().includes(searchLower) ||
      h.profession?.toLowerCase().includes(searchLower) ||
      (h.phoneNumber && h.phoneNumber.includes(searchQuery.trim()));
    const matchesLocation =
      !locationLower ||
      (h.address && h.address.toLowerCase().includes(locationLower));
    return matchesSearch && matchesLocation;
  });

  const searchSuggestions = searchLower
    ? handymen
        .filter(
          (h) =>
            h.name?.toLowerCase().includes(searchLower) ||
            h.profession?.toLowerCase().includes(searchLower) ||
            (h.phoneNumber && h.phoneNumber.includes(searchQuery.trim()))
        )
        .slice(0, 8)
    : [];
  const locationSuggestions = locationLower
    ? Array.from(
        new Set(
          handymen
            .map((h) => h.address)
            .filter((a) => typeof a === "string" && a.toLowerCase().includes(locationLower))
        )
      ).slice(0, 8)
    : [];
// close suggestion dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node))
        setShowSearchSuggestions(false);
      if (locationRef.current && !locationRef.current.contains(e.target as Node))
        setShowLocationSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center text-primary mb-4 w-full">
          <div className="col-span-1 md:col-span-2 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by name, profession or phone"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => searchQuery.trim() && setShowSearchSuggestions(true)}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-[0.5px] focus:ring-primary"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none" />
            </div>
            {showSearchSuggestions && searchSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {searchSuggestions.map((h) => (
                  <li
                    key={h._id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                    onClick={() => {
                      setSearchQuery(h.name || h.profession || "");
                      setShowSearchSuggestions(false);
                    }}
                  >
                    {h.name} {h.profession && `(${h.profession})`}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-span-1 md:col-span-2 relative" ref={locationRef}>
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search by address / location"
                value={locationQuery}
                onChange={(e) => {
                  setLocationQuery(e.target.value);
                  setShowLocationSuggestions(true);
                }}
                onFocus={() => locationQuery.trim() && setShowLocationSuggestions(true)}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-[0.5px] focus:ring-primary"
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none" />
            </div>
            {showLocationSuggestions && locationSuggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {locationSuggestions.map((addr) => (
                  <li
                    key={addr}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm border-b border-gray-100 last:border-0 truncate"
                    onClick={() => {
                      setLocationQuery(addr);
                      setShowLocationSuggestions(false);
                    }}
                  >
                    {addr}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col-span-1 md:col-span-2">
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark w-full"
              onClick={() => {
                setSelectedHandyman(null);
                setIsModalOpen(true);
              }}
            >
              + Add Handyman
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-primary">Loading handymen...</p>
        ) : (
          <div className="overflow-x-auto mt-6 sm:mt-8 -mx-2 sm:mx-0">
            <table className="w-full table-auto bg-white border border-gray-300 rounded-lg text-primary min-w-[600px]">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Pic</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Profession</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="text-primary">
                {filteredHandymen.map((handyman, index) => (
                  <React.Fragment key={handyman._id}>
                    <tr className="border-t border-gray-300 hover:bg-gray-100">
                      <td className="px-4 py-5">
                        <img
                          src={handyman.profileImage || DEFAULT_AVATAR_URL}
                          alt="Handyman"
                          className="w-8 h-8 object-cover rounded-full"
                        />
                      </td>
                      <td className="px-4 py-5">{handyman.name}</td>
                      <td className="px-4 py-5">{handyman.email}</td>
                      <td className="px-4 py-5">{handyman.phoneNumber || "—"}</td>
                      <td className="px-4 py-5">{handyman.profession || "—"}</td>
                      <td className="px-4 py-5 flex items-center gap-2 flex-wrap">
                        <button
                          className="bg-white text-[#003366] p-2 rounded mr-2 shadow-md border border-[#003366] hover:shadow-[0_0_10px_#003366] hover:bg-[#003366] hover:text-white group transition-all duration-300"
                          onClick={() => {
                            setSelectedHandyman({ ...handyman, _id: handyman._id, id: handyman._id });
                            setIsModalOpen(true);
                          }}
                        >
                          <MdModeEditOutline className="text-[#003366] w-4 h-4 group-hover:text-white" />
                        </button>
                        <button
                          className="bg-white text-[#CC0000] p-2 rounded shadow-md border border-[#CC0000] hover:shadow-[0_0_10px_#CC0000] hover:bg-[#CC0000] hover:text-white group transition-all duration-300"
                          onClick={() => handleDelete(handyman._id)}
                        >
                          <FaRegTrashAlt className="text-[#CC0000] w-4 h-4 group-hover:text-white" />
                        </button>
                        <button
                          className="bg-white text-gray-700 p-2 rounded shadow-md border border-gray-700 hover:shadow-[0_0_10px_#666] hover:bg-gray-700 hover:text-white group transition-all duration-300"
                          onClick={() => toggleRow(index)}
                        >
                          <FiChevronDown
                            className={`w-4 h-4 group-hover:text-white ${
                              expandedRows.includes(index) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      </td>
                    </tr>
                    {expandedRows.includes(index) && (
                      <tr className="bg-gray-50">
                        <td colSpan={6} className="px-4 py-5">
                          <p><strong>Address:</strong> {handyman.address || "—"}</p>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {filteredHandymen.length === 0 && !loading && (
              <p className="text-center text-primary py-8">No handymen found.</p>
            )}
          </div>
        )}

        <AddHandyManModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedHandyman(null);
          }}
          onSubmit={handleAddOrEditHandyman}
          defaultValues={selectedHandyman}
        />
      </div>
    </Layout>
  );
};

export default HandyMan;
