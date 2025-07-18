# 🚀 Workasana Frontend

This is the **frontend application** for the Workasana project — a task & project management app built with **React**.

---

## 🌟 Features
✅ Login & Logout  
✅ Manage Projects  
✅ Manage Tasks  
✅ Search Projects & Tasks  
✅ Responsive Design (Bootstrap)  
✅ React Context for State Management

---

## 📦 Tech Stack
- ⚛️ React
- 📦 React Router
- 🍞 react-hot-toast
- 🎨 Bootstrap
- 📝 Axios
- 🔍 React Select

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
