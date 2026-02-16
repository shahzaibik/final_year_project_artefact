"use client";

import { useState } from "react";
import Layout from "../../../components/Dashboard/Layout";
import { FaMapMarkerAlt, FaRegTrashAlt } from "react-icons/fa";
import { MdModeEditOutline } from "react-icons/md";
import AddManagementModal, { ManagementFormData } from "@/components/Dashboard/AddManagementModal";
import { FiSearch } from "react-icons/fi";
// nanagement/admin page
const Management: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [managements, setManagements] = useState<ManagementFormData[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "555-123-4567",
      permissions: ["Dashboard", "Tenants"],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-987-6543",
      permissions: ["Management"],
    },
    {
      id: 3,
      name: "Mark Johnson",
      email: "mark@example.com",
      phone: "555-567-8901",
      permissions: ["Dashboard", "Handyman"],
    },
  ]);

  const [selectedManagement, setSelectedManagement] = useState<ManagementFormData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  //  add or edit logic
  const handleAddOrEditManagement = (data: ManagementFormData) => {
    if (selectedManagement) {
       // update existing record
      setManagements((prev) =>
        prev.map((management) =>
          management.id === selectedManagement.id ? { ...management, ...data } : management
        )
      );
    } else {
      // Add new management
      const newId = managements.length ? Math.max(...managements.map((m) => m.id)) + 1 : 1;
      setManagements((prev) => [...prev, { ...data, id: newId }]);
    }
    setSelectedManagement(null);
    setIsModalOpen(false);
  };

  // remove management/admin
  const handleDeleteManagement = (id: number) => {
    setManagements((prev) => prev.filter((management) => management.id !== id));
  };

  // filter list by search input
  const filteredManagement = managements.filter(
    (management) =>
      management.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      management.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (management.phone && management.phone.includes(searchQuery))
  );

  return (
    <Layout>
      <div className="container mx-auto p-3 sm:p-4">
        {/* Search and Add Section */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center text-primary mb-4 w-full">
          <div className="col-span-1 md:col-span-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-[0.5px] focus:ring-primary"
              />
              <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary" />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Location"
                className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-[0.5px] focus:ring-primary"
              />
              <FaMapMarkerAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary" />
            </div>
          </div>

          <div className="col-span-1">
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark w-full"
              onClick={() => {
                setSelectedManagement(null);
                setIsModalOpen(true);
              }}
            >
              + Add Admin
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-6 sm:mt-8 -mx-2 sm:mx-0">
          <table className="w-full table-auto bg-white border border-gray-300 rounded-lg min-w-[600px]">
            <thead className="bg-primary text-white">
              <tr>
                <th className="px-4 py-2">
                  <input type="checkbox" />
                </th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Permissions</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-primary">
              {filteredManagement.map((management) => (
                <tr
                  key={management.id}
                  className="border-t border-gray-300 hover:bg-gray-100"
                >
                  <td className="px-4 py-5 text-center">
                    <input type="checkbox" className="bg-primary text-primary" />
                  </td>
                  <td className="px-4 py-5">{management.name}</td>
                  <td className="px-4 py-5">{management.email}</td>
                  <td className="px-4 py-5">{management.phone}</td>
                  <td className="px-4 py-5">
                    {management.permissions?.join(", ") || "None"}
                  </td>
                  <td className="px-4 py-5 flex items-center gap-2">
                    {/* Edit Button */}
                    <button
                      className="bg-white text-[#003366] p-2 rounded mr-2 shadow-md border border-[#003366] hover:shadow-[0_0_10px_#003366] hover:bg-[#003366] hover:text-white group transition-all duration-300"
                      onClick={() => {
                        setSelectedManagement(management);
                        setIsModalOpen(true);
                      }}
                    >
                      <MdModeEditOutline className="text-[#003366] w-4 h-4 group-hover:text-white" />
                    </button>

                    {/* Delete Button */}
                    <button
                      className="bg-white text-[#CC0000] p-2 rounded shadow-md border border-[#CC0000] hover:shadow-[0_0_10px_#CC0000] hover:bg-[#CC0000] hover:text-white group transition-all duration-300"
                      onClick={() => handleDeleteManagement(management.id)}
                    >
                      <FaRegTrashAlt className="text-[#CC0000] w-4 h-4 group-hover:text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        <AddManagementModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddOrEditManagement}
          defaultValues={selectedManagement}
        />
      </div>
    </Layout>
  );
};

export default Management;
