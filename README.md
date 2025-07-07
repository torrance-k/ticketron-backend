# 🎯 Ticketron Backend

This is the backend API for Ticketron, a playful and practical issue tracking app. Built with Node.js. Express, MongoDB, and TypeScript.

## 🚀  Tech Stack
* Node.js
* Express
* TypeScript
* MongoDB + Mongoose
* JWT Authentication
* bcrypt password hashing
* dotenv for environment management

## ⚙️ Project Structure
```
 src/
├── controllers/   → Route handlers
├── models/        → Mongoose schemas
├── routes/        → Express routers
├── middleware/    → Auth middleware
└── server.ts      → Entry point
```

## 🔑 Environment Variables
Create a ```.env``` file in the project root:
```
PORT=500
MONGO_URI=mongodb://localhost:27017/ticketron
JWT_SECRET=your_jwt_secret_key
```

* ```PORT```: Server port (defaults to 5000)
* ```MONGO_URI```: MongoDB connection string (local or Atlas)
* ```JWT_SECRET```: Secret key for signing JWTs

## 🛠 Installation
1. Clone the repo:
```
git clone https://github.com/torrance-k/ticketron-backend.git
cd ticketron-backend
```
2. Install dependencies:
```
npm install
```
3. Build the project:
```
npx tsc
```
4. Start the server (development):
```
npm run dev
```

## 📬 API Routes
### Auth
| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register a new user |
| POST   | `/api/auth/login`    | Login user, get JWT |

### Projects
| Method | Endpoint            | Description                 |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/projects/`    | Get all projects (auth)     |
| POST   | `/api/projects/`    | Create a project (auth)     |
| GET    | `/api/projects/:id` | Get a single project (auth) |
| PUT    | `/api/projects/:id` | Update a project (auth)     |
| DELETE | `/api/projects/:id` | Delete a project (auth)     |

### Issues
| Method | Endpoint                         | Description               |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/api/issues/project/:projectId` | Get project issues (auth) |
| POST   | `/api/issues/project/:projectId` | Create issue (auth)       |
| GET    | `/api/issues/:id`                | Get issue by ID (auth)    |
| PUT    | `/api/issues/:id`                | Update issue (auth)       |
| DELETE | `/api/issues/:id`                | Delete issue (auth)       |

## 🔐 Authentication

* Uses JWT Bearer Tokens
* Send the token in the ```Authorization``` header for protected routes:
```
Authorization: Bearer <token>
```

## 🧪 Running Dev Server
With automatic restarts:
```
npm run dev
```

## 🛡️ Planned Improvements
* Role-based access control (Admnin, Contributor, Viewer)
* Activity logging
* GitHub integration (auto-create issues from commits)
* Dockerized deployment