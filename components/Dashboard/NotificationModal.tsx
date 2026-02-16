"use client";

import React, { useEffect, useState } from "react";
import { FaUser, FaTools, FaCreditCard, FaClipboardList } from "react-icons/fa";
import APIRoutes from "@/constants/apiRoutes";

interface NotificationItem {
  _id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const NotificationModal = ({
  isOpen,
  onClose,
  onMarkAllRead,
}: {
  isOpen: boolean;
  onClose: () => void;
  onMarkAllRead?: () => void;
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
// fetch notification only when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await fetch(APIRoutes.NOTIFICATIONS, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data.notifications || []);
        }
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [isOpen]);
// to pick icon based on notification type
  const getIcon = (type: string) => {
    switch (type) {
      case "issue_request":
      case "fix_request":
      case "handyman_assigned":
      case "issue_rejected":
      case "fix_rejected":
        return <FaClipboardList className="text-primary shrink-0" />;
      case "tenant_added":
        return <FaUser className="text-primary shrink-0" />;
      case "handyman_added":
        return <FaTools className="text-primary shrink-0" />;
      default:
        return <FaCreditCard className="text-primary shrink-0" />;
    }
  };
// to mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      const res = await fetch(APIRoutes.NOTIFICATIONS, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        onMarkAllRead?.();
      }
    } catch {
      // ignore
    }
  };
// mmark single notification as read
  const handleMarkOneRead = async (notificationId: string) => {
    try {
      const res = await fetch(APIRoutes.NOTIFICATIONS, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ notificationId }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
        );
      }
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
     // Modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center text-primary bg-black bg-opacity-50 p-4">
      {/* Modal container */}
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Notifications</h2>
          <button type="button" className="text-white" onClick={onClose}>
            <span className="bg-primary px-2 py-1 rounded-md">×</span>
          </button>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <ul className="overflow-y-auto flex-1 p-4 space-y-2">
            {notifications.length === 0 ? (
              <li className="text-gray-500 text-center py-6">No notifications</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-md border border-primary/20 ${
                    notification.read ? "bg-gray-50" : "bg-[#F7FBFC]"
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    {getIcon(notification.type)}
                    <span className="text-sm break-words">{notification.message}</span>
                  </span>
                  {!notification.read && (
                    <button
                      type="button"
                      className="text-primary text-xs shrink-0 hover:underline"
                      onClick={() => handleMarkOneRead(notification._id)}
                    >
                      Mark read
                    </button>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
{/* Footer actions */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
          {notifications.length > 0 && (
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
              onClick={handleMarkAllRead}
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
