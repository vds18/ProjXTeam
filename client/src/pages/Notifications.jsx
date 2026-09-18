import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) =>
            notification._id === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "http://localhost:5000/api/notifications/read-all",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notification) => ({
            ...notification,
            isRead: true,
          }))
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    }
  };

  const handleProjectClick = (notification) => {
    if (notification.project?._id) {
      navigate(`/projects/${notification.project._id}`);
    }
  };

  const getNotificationIcon = (type) => {
    if (type === "join_request") return "📩";
    if (type === "request_accepted") return "🎉";
    if (type === "request_rejected") return "❌";

    return "🔔";
  };

  const getNotificationType = (type) => {
    if (type === "join_request") {
      return "New Join Request";
    }

    if (type === "request_accepted") {
      return "Request Accepted";
    }

    if (type === "request_rejected") {
      return "Request Rejected";
    }

    return "Notification";
  };

  if (loading) {
    return (
      <div className="notifications-page loading-page">
        <div className="loading-box">
          <div className="loading-spinner"></div>
          <h2>Loading notifications...</h2>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        {/* HEADER */}
        <div className="notifications-header">

          <button
            className="notifications-back-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <div className="notifications-header-row">
            <div>
              <span className="notifications-eyebrow">
                ACTIVITY CENTER
              </span>

              <h1>
                Notifications <span>🔔</span>
              </h1>

              <p>
                Stay updated with everything happening
                across your ProjXTeam workspace.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                className="notifications-mark-all"
                onClick={markAllAsRead}
              >
                ✓ Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* UNREAD SUMMARY */}
        {unreadCount > 0 && (
          <div className="notifications-unread-card">
            <div className="notifications-unread-icon">
              🔔
            </div>

            <div>
              <strong>{unreadCount}</strong>
              <span>
                unread notification
                {unreadCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <div className="notifications-empty-icon">
              🔕
            </div>

            <h2>No notifications yet</h2>

            <p>
              You're all caught up! New activity will
              appear here.
            </p>

            <button
              className="notifications-primary-btn"
              onClick={() => navigate("/projects")}
            >
              🔎 Explore Projects
            </button>
          </div>
        ) : (
          <div className="notifications-list">

            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`notification-item ${
                  notification.isRead
                    ? "notification-read"
                    : "notification-unread"
                }`}
              >

                {/* ICON */}
                <div
                  className={`notification-icon ${
                    notification.isRead
                      ? "notification-icon-read"
                      : "notification-icon-unread"
                  }`}
                >
                  {getNotificationIcon(
                    notification.type
                  )}
                </div>

                {/* CONTENT */}
                <div className="notification-content">

                  <div className="notification-title-row">
                    <h3>
                      {getNotificationType(
                        notification.type
                      )}
                    </h3>

                    {!notification.isRead && (
                      <span className="notification-new-badge">
                        NEW
                      </span>
                    )}
                  </div>

                  <p className="notification-message">
                    {notification.message}
                  </p>

                  {notification.project && (
                    <button
                      className="notification-project-btn"
                      onClick={() =>
                        handleProjectClick(notification)
                      }
                    >
                      📁 View Project →
                    </button>
                  )}

                  <div className="notification-bottom">

                    <span className="notification-date">
                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}
                    </span>

                    {!notification.isRead && (
                      <button
                        className="notification-read-btn"
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                      >
                        Mark as read
                      </button>
                    )}

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default Notifications;