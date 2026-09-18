import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [project, setProject] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const currentUser = JSON.parse(
    localStorage.getItem("user")
  );

  /* =========================
     FETCH PROJECT + MESSAGES
  ========================= */

  useEffect(() => {
    fetchProject();
    fetchMessages();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`
      );

      const data = await response.json();

      if (response.ok) {
        setProject(data);
      } else {
        alert(data.message);
        navigate("/projects");
      }
    } catch (error) {
      alert("Server connection failed");
    }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessages(data);
      } else {
        alert(data.message);
        navigate(`/projects/${id}`);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SOCKET.IO
  ========================= */

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      auth: {
        token: localStorage.getItem("token"),
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-project", id);
    });

    socket.on("receive-message", (newMessage) => {
      setMessages((prevMessages) => {
        const alreadyExists = prevMessages.some(
          (msg) =>
            msg._id &&
            newMessage._id &&
            msg._id === newMessage._id
        );

        if (alreadyExists) {
          return prevMessages;
        }

        return [...prevMessages, newMessage];
      });
    });

    socket.on("chat-error", (data) => {
      console.error("Chat error:", data.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      return;
    }

    const token = localStorage.getItem("token");
    const messageText = message.trim();

    setSending(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: messageText,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const savedMessage = data.data;

        // Do NOT add the message locally here.
        // Socket.IO will broadcast the saved message.
        socketRef.current?.emit("send-message", {
          projectId: id,
          message: savedMessage.message,
          messageId: savedMessage._id,
        });

        setMessage("");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Server connection failed");
    } finally {
      setSending(false);
    }
  };

  /* =========================
     ENTER KEY
  ========================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  /* =========================
     LOADING
  ========================= */

  if (loading || !project) {
    return (
      <div className="chat-page loading-page">
        <div className="loading-box">
          <div className="loading-spinner"></div>
          <h2>Loading team chat...</h2>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">

        {/* HEADER */}

        <div className="chat-header">

          <button
            className="chat-back-btn"
            onClick={() =>
              navigate(`/projects/${id}`)
            }
          >
            ← Back to Project
          </button>

          <div className="chat-header-card">

            <div className="chat-project-icon">
              💬
            </div>

            <div className="chat-project-info">
              <span className="chat-eyebrow">
                TEAM WORKSPACE
              </span>

              <h1>{project.title}</h1>

              <p>
                Real-time team collaboration
              </p>
            </div>

            <div className="chat-member-badge">
              <span>👥</span>
              {project.members?.length || 0}
              /{project.teamSize}
            </div>

          </div>
        </div>

        {/* CHAT CARD */}

        <div className="chat-card">

          {/* CHAT TOP BAR */}

          <div className="chat-topbar">
            <div className="chat-status">
              <span className="chat-online-dot"></span>
              Team Chat
            </div>

            <span className="chat-message-count">
              {messages.length} message
              {messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* MESSAGES */}

          <div className="chat-messages">

            {messages.length === 0 ? (
              <div className="chat-empty">

                <div className="chat-empty-icon">
                  💬
                </div>

                <h3>
                  Start the conversation
                </h3>

                <p>
                  Say hello to your teammates and
                  start collaborating! 🚀
                </p>

              </div>
            ) : (
              messages.map((msg, index) => {

                const senderId =
                  typeof msg.sender === "object"
                    ? msg.sender?._id
                    : msg.sender;

                const isMine =
                  senderId === currentUser?._id;

                const senderName =
                  typeof msg.sender === "object"
                    ? msg.sender?.name
                    : isMine
                    ? currentUser?.name
                    : "Team Member";

                return (
                  <div
                    key={
                      msg._id ||
                      `${msg.createdAt}-${index}`
                    }
                    className={`chat-message-row ${
                      isMine
                        ? "chat-message-mine"
                        : "chat-message-other"
                    }`}
                  >

                    {!isMine && (
                      <div className="chat-message-avatar">
                        {senderName
                          ?.charAt(0)
                          ?.toUpperCase() || "T"}
                      </div>
                    )}

                    <div
                      className={`chat-message-bubble ${
                        isMine
                          ? "chat-bubble-mine"
                          : "chat-bubble-other"
                      }`}
                    >

                      {!isMine && (
                        <div className="chat-sender-name">
                          {senderName}
                        </div>
                      )}

                      <div className="chat-message-text">
                        {msg.message}
                      </div>

                      <div className="chat-message-time">
                        {msg.createdAt
                          ? new Date(
                              msg.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </div>

                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* INPUT */}

          <form
            className="chat-input-area"
            onSubmit={handleSendMessage}
          >

            <div className="chat-input-wrapper">

              <textarea
                className="chat-message-input"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Message your team..."
                rows="1"
              />

              <button
                type="submit"
                className="chat-send-btn"
                disabled={
                  sending || !message.trim()
                }
              >
                {sending ? (
                  <span className="chat-send-spinner"></span>
                ) : (
                  "➤"
                )}
              </button>

            </div>

            <div className="chat-input-footer">
              <span>
                ↵ Enter to send
              </span>

              <span>
                Shift + Enter for new line
              </span>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Chat;