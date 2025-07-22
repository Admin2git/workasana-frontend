# 🚀 Workasana Frontend

This is the **frontend application** for the Workasana project — a task & project management app built with **React**.

---

## 🌟 Features
✅ Login & Signup with JWT  
✅ Protected routes (redirects if not logged in)  
✅ Create, update, delete, and filter tasks  
✅ Manage projects & teams  
✅ View reports with charts:
- Tasks completed last week (Bar Chart)
- Tasks closed by team (Pie Chart)
- Pending work across projects (Bar Chart)

✅ Filters work via URL (e.g., `/tasks?team=teamId&status=InProgress`)  
✅ Visualizations powered by Chart.js  

---

## 📦 Tech Stack
- ⚛️ React
- 📦 React Router
- 🍞 react-hot-toast
- 🎨 Bootstrap
- 📝 Axios
- 🔍 Chart.js
- usestate
- context Hook

---

## 🔧 Setup & Run Locally

### 1️⃣ Clone the repo
```bash
git clone https://github.com/your-username/workasana-frontend.git
cd workasana-frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure Environment
Create a .env file in the root folder:
```bash
VITE_BASE_API_URL=https://your-backend-url.com
```
Replace ``` https://your-backend-url.com``` with your actual backend API URL.

### 4️⃣ Start the development server
```bash
npm run dev
```

## 🖥️ Pages & Components

### 🔑 Authentication
- **Login**
  - Enter email & password
  - Get JWT stored in `localStorage`
  - Access to protected routes
- **Signup**
  - Register a new user with name, email, and password
- 🚪 Redirects:
  - If a user tries to access a protected page without logging in, they are redirected to the login page.

---

### 📋 Tasks
- **Task Creation Form**
  - Fields:
    - Name
    - Project (dropdown)
    - Team (dropdown)
    - Owners (multi-select)
    - Tags (multi-select)
    - Time to complete (days)
    - Status: `To Do`, `In Progress`, `Completed`, `Blocked`
- **Task List**
  - Displays all tasks
  - Filter options:
    - Owner
    - Team
    - Tags
    - Project
    - Status
  - 📎 URL reflects filters, so you can share a filtered view:
    ```
    /tasks?team=teamId&status=InProgress
    ```

---

### 📂 Projects & Teams
- View all **Projects** and **Teams**
- Add new projects or teams
- Delete existing projects or teams

---

### 📊 Reports
Visual insights powered by **Chart.js**:
- 📊 **Bar Chart:** Total work completed last week
- 🥧 **Pie Chart:** Tasks closed by team
- 📊 **Bar Chart:** Pending work across projects


## 📝 Folder Structure
```bash
src/
├── components/       # Reusable UI components
├── contexts/         # React Context (Task Management)
├── pages/            # Main pages (Dashboard, Login, etc.)
├── App.jsx           # Root component
├── main.jsx          # Entry point
└── useFetch.js       # Custom hook for API calls
```

## 🔑 Notes

- Requires backend API to be running and accessible.

- Make sure the backend has CORS configured to allow frontend requests.

- Supports token-based authentication.

## Preview Link

[live app](https://workasana-frontend-sable.vercel.app/login)

## 👨‍💻 Author
Made by Akabar Ansari 
