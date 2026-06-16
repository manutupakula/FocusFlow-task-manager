# FocusFlow - Smart Task Management Platform

## Overview

FocusFlow is a full-stack task management and productivity application built using the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application helps users organize their work, study goals, and personal tasks through an intuitive Kanban-style interface. Users can create, manage, prioritize, track progress, and monitor deadlines for their tasks in a modern and responsive dashboard.

---
🌐 Live Demo

Frontend: https://focus-flow-task-manager-jet.vercel.app

Backend API: https://focusflow-task-manager.onrender.com

## Features

### User Authentication

* Secure user registration and login
* JWT-based authentication
* Protected routes
* Persistent user sessions

### Task Management

* Create, update, and delete tasks
* Assign task priorities (High, Medium, Low)
* Categorize tasks (Work, Study, Personal)
* Add descriptions and due dates

### Kanban Board

* Drag-and-drop inspired workflow
* Separate columns for:

  * Todo
  * In Progress
  * Done
* Quick status updates

### Progress Tracking

* Progress percentage tracking (0–100%)
* Automatic status synchronization
* Visual progress bars

### Deadline Management

* Due date tracking
* Overdue task indicators
* Due today reminders
* Color-coded deadline alerts

### Search and Filtering

* Search tasks instantly
* Filter by category
* Filter by status
* Task count indicators

### User Experience

* Modern responsive UI
* Mobile-friendly design
* Toast notifications
* Dark mode support
* Clean and intuitive dashboard

### Profile Management

* User profile page
* Avatar support
* Personal productivity statistics

---

## Technology Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router DOM
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JSON Web Token (JWT)
* bcrypt.js

---

## Project Structure

```text
Task Manager
│
├── Backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
├── Frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── context
│   │   ├── utils
│   │   └── api
│   └── public
│
└── README.md
```

---

## Installation and Setup

### Clone Repository

```bash
git clone <https://github.com/manutupakula/focusflow-task-manager.git>
```

### Backend Setup

```bash
cd Backend
npm install
npm start
```

Backend runs on:

```text
http://localhost:5000
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## Future Enhancements

* Email reminders
* Drag and drop Kanban functionality
* Task collaboration
* Team workspaces
* Analytics dashboard
* Calendar integration
* Real-time notifications
* AI-powered task suggestions

---

## Learning Outcomes

Through this project, I gained practical experience in:

* Building full-stack web applications
* REST API development
* Authentication and authorization
* MongoDB database design
* React state management
* Responsive UI development
* CRUD operations
* Frontend-backend integration
* Git and GitHub version control

---

## Author

**Manu Tupakula**

Third-Year Computer Science Student

Aspiring Software Engineer

---

## License

This project is created for educational and portfolio purposes.
