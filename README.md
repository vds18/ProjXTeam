# 🚀 ProjXTeam

**ProjXTeam** is a full-stack MERN collaboration platform designed to help developers and students discover projects, find compatible teammates, and collaborate effectively.

The platform matches users with projects based on their **skills, interests, and experience level**, while providing team management, notifications, join requests, and real-time project chat.

## ✨ Features

- 🔐 User Registration & Login with JWT Authentication
- 👤 User Profile Management
- 🛠️ Create, Edit & Delete Projects
- 🔎 Explore Available Projects
- 🤝 Send & Manage Join Requests
- 👥 Project Team Management
- 🎯 Skill-Based Project Matching
- 📊 Experience & Interest-Based Matching
- 🔔 Real-Time Notification System
- 💬 Real-Time Team Chat using Socket.IO
- 📁 Created & Joined Projects Dashboard
- 🔒 Protected Routes & APIs
- 📱 Responsive Modern UI

## 🧠 Project Matching

ProjXTeam uses a matching system that evaluates projects using:

- **60% — Skill Match**
- **20% — Experience Match**
- **20% — Interest Match**

Projects are ranked according to the user's overall match percentage.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- CSS3
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication
- bcryptjs

### Database
- MongoDB Atlas
- Mongoose

## 📂 Project Structure

```text
ProjXTeam/
├── client/                 # React frontend
├── server/
│   ├── middleware/         # Authentication & validation
│   ├── models/             # Mongoose models
│   ├── routes/             # REST API routes
│   ├── server.js           # Express server
│   └── socket.js           # Socket.IO configuration
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/vds18/ProjXTeam.git
cd ProjXTeam
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

### 5. Start the backend

```bash
cd server
npm run dev
```

### 6. Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

## 🔐 Security

- Passwords are hashed using bcryptjs.
- Authentication is handled using JSON Web Tokens (JWT).
- Protected APIs require valid authentication.
- Socket.IO connections use JWT authentication.
- Project chat access is restricted to authorized team members.
- Sensitive environment variables are excluded from Git.

## 🔮 Future Enhancements

- AI-powered teammate recommendations
- Direct messaging between users
- Project search and advanced filters
- User profile images
- Email verification and password recovery
- Project completion tracking
- Deployment and production optimization

## 👩‍💻 Author

**Vanshika Dutt Srivastava**

Full Stack Developer

GitHub: [@vds18](https://github.com/vds18)

LinkedIn: [Vanshika Dutt Srivastava](https://www.linkedin.com/in/vanshika-dutt-srivastava-762168311)

---

⭐ If you find ProjXTeam useful, consider starring the repository.