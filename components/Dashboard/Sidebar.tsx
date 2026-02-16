"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUsers, FaTools, FaClipboardList, FaPlusCircle } from "react-icons/fa";
import Routes from "@/constants/routes";
import { useState, useEffect } from "react";
import APIRoutes from "@/constants/apiRoutes";
// sidebar options for landlord
const landlordPaths = [
  { name: "Dashboard", path: Routes.DASHBOARD, icon: <FaHome /> },
  { name: "Tenants", path: Routes.TENANTS, icon: <FaUsers /> },
  { name: "Handyman", path: Routes.HANDYMAN, icon: <FaTools /> },
  { name: "Issues", path: Routes.ISSUES, icon: <FaClipboardList /> },
];
// sidebar options for tenant
const tenantPaths = [
  { name: "Dashboard", path: Routes.DASHBOARD, icon: <FaHome /> },
  { name: "Issues", path: Routes.ISSUES, icon: <FaClipboardList /> },
  { name: "Add New Issue", path: Routes.ADD_NEW_ISSUE, icon: <FaPlusCircle /> },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<"Landlord" | "Tenant" | null>(null);
// get current user role to decide which sidebar to show
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(APIRoutes.AUTH_ME, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setRole(data.role === "Tenant" ? "Tenant" : "Landlord");
        } else {
          setRole("Landlord");
        }
      } catch {
        setRole("Landlord");
      }
    };
    fetchUser();
  }, []);
// Pick sidebar options list based on role
  const paths = role === "Tenant" ? tenantPaths : landlordPaths;

  return (
    <>
      {/* Hamburger Menu for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2.5 text-white bg-primary fixed top-2 left-2 z-50 rounded-lg text-lg leading-none"
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-[98%] mt-2 w-[280px] bg-primary text-white transform rounded-lg md:ml-1 md:mr-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0 lg:relative z-50`}
      >
        <div className="p-4 mt-4">
          <img
            src="/dashLogo.png"
            alt="Admin Panel Logo"
            className="w-24 h-24 mx-auto"
          />
        </div>

        <ul className="flex-1 ">
          {paths.map((item) => (
            <li
              key={item.path}
              className={`flex items-center gap-4 m-2 p-2 hover:bg-[#005b99] rounded-lg cursor-pointer ${
                pathname === item.path || (item.path !== Routes.DASHBOARD && pathname.startsWith(item.path))
                  ? "bg-[#005b99] text-white"
                  : "text-gray-300"
              }`}
            >
              <Link
                href={item.path}
                className="flex items-center gap-4 w-full"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-base ml-8">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for Mobile when Sidebar is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close Sidebar Overlay"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
