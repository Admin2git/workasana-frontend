import {  useParams } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import useFetch from "../useFetch";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UseTaskContext from "../contexts/TaskManageContext";

export const TaskDetails = () => {
  const id = useParams();
  const { projects, loadingProjects, errorProjects } = UseTaskContext();

  const {
    data: teams,
    loading: loadingTeam,
    error: errorTeam,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/teams`);

  const {
    data: tasks,
    loading: loadingTasks,
    error: errorTasks,
    refetch: refetchTask,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/tasks`);

  const task = tasks?.find((task) => task._id == id.id);
  const [status1, setStatus1] = useState("");

  useEffect(() => {
    if (task) {
      setStatus1(task.status);
    }
  }, [task]);


  const handleStatus = async (newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/tasks/${task._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        toast.success("Status updated successfully");
        refetchTask();
      } else {
        toast.error("Error updating status");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  console.log(status1);
  console.log(id);
  console.log(task);

  return (
    <div className="h-100 d-flex flex-column container-fluid">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-md row navbar-dark bg-secondary bg-opacity-75 sticky-top">
        <div className="container d-flex justify-content-around my-2">
          <a className="navbar-brand h1 m-0" href="/dashboard">
            workasana
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sidebar"
            aria-controls="sidebar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
      </nav>

      <div className="row flex-grow-1 d-flex">
        <Sidebar />

        <main className="col-md-8 flex-grow-1 p-4 bg-light">
          <h4 className="my-3">Task Details</h4>

          {loadingProjects || loadingTasks || loadingTeam ? (
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              Loading...
            </p>
          ) : errorProjects || errorTasks || errorTeam ? (
            <p
              className="d-flex justify-content-center align-items-center text-danger"
              style={{ height: "50vh" }}
            >
              Error: {errorProjects || errorTasks || errorTeam}
            </p>
          ) : !projects?.find((pro) => pro._id == task?.project?._id) ? (
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              Project not found or deleted
            </p>
          ) : !teams?.find((team) => team._id == task?.team?._id) ? (
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              Team not found or deleted
            </p>
          ) : (
            task && (
              <div className="card col-md-6 mb-4">
                <div className="card-body">
                  <h5 className="card-title">{task.name}</h5>
                  <br />
                  <p className="card-text">Project Name: {task.project.name}</p>
                  <p className="card-text">Team Name: {task.team.name}</p>
                  <p className="card-text">
                    Owners: {task.owners.map((owner) => owner.name).join(", ")}
                  </p>
                  <p className="card-text">
                    Tags: {task.tags.map((tag) => tag).join(" , ")}
                  </p>
                  <p className="card-text">
                    Due Date: {task.dueDate.split("T")[0]}
                  </p>
                  <p>
                    Status:
                    <select
                      className="ms-2"
                      name="status"
                      value={status1}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        setStatus1(newStatus);
                        handleStatus(newStatus);
                      }}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                  </p>
                  <p>Time Remaining: {task.timeToComplete} Days</p>
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};
