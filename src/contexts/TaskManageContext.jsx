import { createContext, useContext } from "react";
import useFetch from "../useFetch";
import toast from "react-hot-toast";
import axios from "axios";

const taskContext = createContext();
const UseTaskContext = () => useContext(taskContext);

export default UseTaskContext;

export function TaskManageProvider({ children }) {
  const token = localStorage.getItem("token")?.trim();

  const {
    data: projects,
    loading: loadingProjects,
    error: errorProjects,
    refetch: refetchProjects,
  } = useFetch(token ? `${import.meta.env.VITE_BASE_API_URL}/projects` : null);

  const {
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
    refetch: refetchTask,
  } = useFetch(token ? `${import.meta.env.VITE_BASE_API_URL}/tasks` : null);

  const handleDeleteTask = async (taskId) => {
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
        }}
      >
        {children}
      </taskContext.Provider>
    </>
  );
}
