const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Project = require("./models/Project");

function initializeSocket(server) {
  const io = new Server(server, {
    cors: {
      origin:
        process.env.CLIENT_URL ||
        "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  // ==========================================
  // SOCKET AUTHENTICATION
  // ==========================================
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token;

      if (!token) {
        return next(
          new Error("Authentication required")
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.userId = decoded.userId;

      next();
    } catch (error) {
      next(
        new Error("Invalid or expired token")
      );
    }
  });


  // ==========================================
  // SOCKET CONNECTION
  // ==========================================
  io.on("connection", (socket) => {
    console.log(
      "Authenticated user connected:",
      socket.id
    );

    // ==========================================
    // JOIN PROJECT CHAT ROOM
    // ==========================================
    socket.on(
      "join-project",
      async (projectId) => {
        try {
          const project =
            await Project.findById(projectId);

          if (!project) {
            return socket.emit(
              "chat-error",
              {
                message:
                  "Project not found",
              }
            );
          }

          const isMember =
            project.members.some(
              (member) =>
                member.toString() ===
                socket.userId
            );

          const isCreator =
            project.creator.toString() ===
            socket.userId;

          if (!isMember && !isCreator) {
            return socket.emit(
              "chat-error",
              {
                message:
                  "You are not a member of this project",
              }
            );
          }

          socket.join(
            `project-${projectId}`
          );

          console.log(
            `User ${socket.userId} joined project-${projectId}`
          );

        } catch (error) {
          console.error(
            "Join project socket error:",
            error
          );

          socket.emit(
            "chat-error",
            {
              message:
                "Unable to join project chat",
            }
          );
        }
      }
    );


    // ==========================================
    // SEND MESSAGE
    // ==========================================
    socket.on(
      "send-message",
      async (data) => {
        try {
          const {
            projectId,
            message,
          } = data;

          if (
            !projectId ||
            !message ||
            !message.trim()
          ) {
            return socket.emit(
              "chat-error",
              {
                message:
                  "Invalid message",
              }
            );
          }

          const project =
            await Project.findById(projectId);

          if (!project) {
            return socket.emit(
              "chat-error",
              {
                message:
                  "Project not found",
              }
            );
          }

          const isMember =
            project.members.some(
              (member) =>
                member.toString() ===
                socket.userId
            );

          const isCreator =
            project.creator.toString() ===
            socket.userId;

          if (!isMember && !isCreator) {
            return socket.emit(
              "chat-error",
              {
                message:
                  "You are not a member of this project",
              }
            );
          }

          io.to(
            `project-${projectId}`
          ).emit(
            "receive-message",
            {
              _id: data.messageId,
              sender: socket.userId,
              message: message.trim(),
              projectId,
              createdAt: new Date(),
            }
          );

        } catch (error) {
          console.error(
            "Socket message error:",
            error
          );

          socket.emit(
            "chat-error",
            {
              message:
                "Unable to send message",
            }
          );
        }
      }
    );


    // ==========================================
    // DISCONNECT
    // ==========================================
    socket.on("disconnect", () => {
      console.log(
        "User disconnected:",
        socket.id
      );
    });
  });

  return io;
}

module.exports = initializeSocket;