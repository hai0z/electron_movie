import { Bell } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Movie } from "../types/vietsub";
import { Link } from "react-router-dom";

interface Notification {
  id: string;
  content: Movie;
  timestamp: string;
  isRead: boolean;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const electron = (window as any).electron;
  const getNoti = () => {
    electron.ipcRenderer.send("get-noti");
  };

  useEffect(() => {
    electron.ipcRenderer.on("noti-data", (data: Notification[]) => {
      setNotifications(data);
    });
    getNoti();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    electron.ipcRenderer.send("read-noti");
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown dropdown-end ${dropdownOpen ? "dropdown-open" : ""}`}
    >
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <div className="indicator">
          <Bell className="w-6 h-6" />
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="badge badge-sm indicator-item bg-red-500 text-white">
              {notifications.filter((n) => !n.isRead).length}
            </span>
          )}
        </div>
      </div>

      <div
        tabIndex={0}
        className="dropdown-content z-[100] mt-3 w-96 card card-compact bg-base-100 shadow-xl"
      >
        <div className="card-body">
          <span className="font-bold text-lg">
            {notifications.length} Thông báo mới nhất
          </span>
          <span>Video mới phát hành</span>
          <div className="w-full h-[1px] bg-base-300"></div>
          <div className="divide-y divide-base-300 max-h-80 overflow-y-auto">
            {notifications?.length > 0 ? (
              notifications?.map((n, index) => (
                <div
                  key={index}
                  className={`py-2 flex gap-2 items-center ${
                    !n.isRead ? "bg-base-200" : ""
                  }`}
                >
                  <img
                    loading="lazy"
                    src={n.content.thumb_url}
                    alt={n.content.name}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link
                      to={`/vietsub-detail/${n.content.slug}`}
                      className="text-sm font-semibold hover:underline"
                    >
                      {n.content.name}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {new Date(n.timestamp).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  {/* Hiển thị chấm đỏ nếu chưa đọc */}
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block mr-2"></span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 py-2">Không có thông báo</p>
            )}
          </div>
          <div className="card-actions">
            <button
              disabled={
                notifications.length === 0 ||
                notifications.every((n) => n.isRead)
              }
              className="btn btn-sm btn-primary w-full"
              onClick={markAllRead}
            >
              Đánh dấu đã đọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
