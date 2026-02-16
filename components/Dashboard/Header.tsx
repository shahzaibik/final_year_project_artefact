"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { FaRegBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
import NotificationModal from "./NotificationModal";
import APIRoutes from "@/constants/apiRoutes";
import { DEFAULT_AVATAR_URL } from "@/constants/assets";
import Routes from "@/constants/routes";

interface User {
  _id: string;
  name: string;
  lastName?: string;
  email: string;
  role: string;
  profileImage?: string | null;
}
// dashboard header component
const Header = () => {
  // Dropdown for profile menu

  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  // Notification modal visibility
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  //lLogged-in user data
  const [user, setUser] = useState<User | null>(null);
  // count of unread notifications
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(APIRoutes.AUTH_ME, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch(`${APIRoutes.NOTIFICATIONS}?unreadOnly=true`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.unreadCount ?? 0);
        }
      } catch {
        setUnreadCount(0);
      }
    };
    fetchUnread();
    // re-fetch when modal opens
    if (isNotificationModalOpen) fetchUnread();
  }, [isNotificationModalOpen]);
// to toggle profile dropdown
  const toggleDropdown = () => {
    if (!isDropdownOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setIsDropdownOpen(!isDropdownOpen);
  };
// Toggle notification modal
  const toggleNotificationModal = () => {
    setIsNotificationModalOpen(!isNotificationModalOpen);
  };
// handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(APIRoutes.AUTH_LOGOUT, {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = Routes.LOGIN;
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred during logout:", error);
    }
  };
// display user name and role
  const displayName = user
    ? [user.name, user.lastName].filter(Boolean).join(" ") || "User"
    : "User";
  const displayRole = user?.role || "Landlord";
  const avatarSrc = user?.profileImage
    ? user.profileImage
    : DEFAULT_AVATAR_URL;

  return (
    <header className="bg-tertiary text-primary h-14 md:h-16 flex items-center gap-2 px-3 sm:px-4 md:px-6 lg:px-6 pr-3 sm:pr-4 shadow-md sticky top-0 z-10 overflow-visible pl-12 lg:pl-6">
      <div className="text-base md:text-xl font-bold truncate shrink-0 min-w-0 hidden lg:block">Overview</div>

      <div className="flex items-center justify-end flex-1 min-w-0 gap-2 sm:gap-4 relative z-10">
        <button
          type="button"
          onClick={toggleNotificationModal}
          className="relative shrink-0 p-2 -m-2 cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-full"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        >
          <FaRegBell className="text-primary w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 pointer-events-none">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Profile Section */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <div className="flex items-center gap-1 sm:gap-2">
            <img
              src={avatarSrc}
              alt="Profile Avatar"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer object-cover shrink-0"
              onClick={toggleDropdown}
            />
            <div className="hidden md:block min-w-0 max-w-[120px] lg:max-w-[160px]">
              <p className="font-bold text-sm truncate">{displayName}</p>
              <p className="text-xs capitalize truncate text-gray-600">{displayRole}</p>
            </div>
            <div
              className="cursor-pointer shrink-0 p-1 -mr-1"
              onClick={toggleDropdown}
            >
              {isDropdownOpen ? (
                <FaChevronUp className="w-3 h-4 " />
              ) : (
                <FaChevronDown className="w-3 h-4" />
              )}
            </div>
          </div>

          {isDropdownOpen &&
            typeof document !== "undefined" &&
            createPortal(
              <div
                className="fixed w-48 min-w-[180px] bg-white shadow-xl rounded-lg z-[9999] border border-gray-200 py-2"
                style={{ top: dropdownPos.top, right: dropdownPos.right }}
              >
                <div className="px-4 pb-2 mb-2 border-b border-gray-100 md:hidden">
                  <p className="font-semibold text-sm truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
                </div>
                <ul>
                  <li>
                    <Link
                      href={Routes.PROFILE}
                      className="block px-4 py-2 hover:bg-gray-100 text-primary"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-primary"
                    onClick={handleLogout}
                  >
                    Log out
                  </li>
                </ul>
              </div>,
              document.body
            )}
        </div>
      </div>

      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={toggleNotificationModal}
        onMarkAllRead={() => setUnreadCount(0)}
      />
    </header>
  );
};

export default Header;
