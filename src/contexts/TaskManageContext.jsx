import { createContext, useContext, useState } from "react";
import useFetch from "../useFetch";
import toast from "react-hot-toast";
import axios from "axios";

const taskContext = createContext();
const UseTaskContext = () => useContext(taskContext);

export default UseTaskContext;

export function TaskManageProvider({ children }) {
  const [reloadFlag, setReloadFlag] = useState(0);

  const triggerReload = () => setReloadFlag((prev) => prev + 1);

  const {
    data: projects,
    loading: loadingProjects,
    error: errorProjects,
    refetch: refetchProjects,
  } = useFetch(
    localStorage.getItem("token")
      ? `${import.meta.env.VITE_BASE_API_URL}/projects`
      : null,
    reloadFlag
  );

  const {
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
    refetch: refetchTask,
  } = useFetch(
    localStorage.getItem("token")
      ? `${import.meta.env.VITE_BASE_API_URL}/tasks`
      : null,
    reloadFlag
  );

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(res);
      if (res.status === 200) {
        toast.success("Task deleted successfully!");
        refetchTask();
        refetchProjects();
      } else {
        toast.error("Failed to delete Task");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete Task";
      toast.error(errorMessage);
      console.log(err);
    }
  };
  return (
    <>
      <taskContext.Provider
        value={{
          projects,
          loadingProjects,
          errorProjects,
          refetchProjects,
          handleDeleteTask,
          tasks,
          loadingTasks,
          errorTasks,
          refetchTask,
          triggerReload,
        }}
      >
        {children}
      </taskContext.Provider>
    </>
  );
}
