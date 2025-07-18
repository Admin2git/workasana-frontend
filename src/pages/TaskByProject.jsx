import { Link, useNavigate, useParams } from "react-router-dom";
import useFetch from "../useFetch";
import { Sidebar } from "../components/Sidebar";
import UseTaskContext from "../contexts/TaskManageContext";
import { useState } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import axios from "axios";

export const TaskByProject = () => {
  const id = useParams();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskData, setTaskData] = useState({
    name: "",
    project: id.id,
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    timeToComplete: 0,
  });

  const navigate = useNavigate();
  const { projects, loadingProjects, errorProjects, handleDeleteTask } =
    UseTaskContext();

  const proName =
    projects?.find((proj) => proj._id == id.id)?.name || "No project found";

  const {
    data: tasksByProject,
    loading: loadingTasksByProject,
    error: errorTasksByProject,
    refetch: refetchTaskByProject,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/tasks?project=${id.id}`);

  const {
    data: teams,
    loading: loadingTeam,
    error: errorTeam,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/teams`);

  const {
    data: users,
    loading: loadingUsers,
    error: errorUsers,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/users`);

  const userOptions =
    users?.map((user) => ({
      value: user._id,
      label: user.name,
    })) || [];

  const handleSaveTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const data = {
      ...taskData,
      timeToComplete: Number(taskData.timeToComplete),
      tags: taskData.tags.split(",").map((tag) => tag.trim()),
    };
    if (
      !taskData.name ||
      !taskData.dueDate ||
      !taskData.team ||
      !taskData.owners ||
      !taskData.timeToComplete
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/tasks`,
        taskData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      toast.success("Task Added successfully!");
      setShowTaskModal(false);
      setTaskData({
        name: "",
        project: "",
        team: "",
        owners: [],
        tags: [],
        dueDate: "",
        timeToComplete: 0,
      });
      refetchTaskByProject();
    } catch (err) {
      toast.error("Add to failed");
      console.log(err);
    }

    console.log(data);
  };

  const handleDeleteTask123 = async (taskId) => {
    await handleDeleteTask(taskId);
    refetchTaskByProject();
  };

  console.log(id);
  console.log(tasksByProject);

  return (
    <div className="h-100 d-flex flex-column container-fluid">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-md row navbar-dark bg-secondary bg-opacity-75 sticky-top">
        <div className="container d-flex justify-content-around my-2">
          <a className="navbar-brand h1 m-0" href="/dashboard">
            workasana
          </a>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
          >
            Logout
          </button>

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
          {loadingTasksByProject ||
          loadingTeam ||
          loadingProjects ||
          loadingUsers ? (
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              Loading ...
            </p>
          ) : errorProjects ||
            errorTasksByProject ||
            errorTeam ||
            errorUsers ? (
            <p
              className="d-flex justify-content-center align-items-center text-danger"
              style={{ height: "50vh" }}
            >
              Error: {errorProjects || errorTasksByProject}
            </p>
          ) : tasksByProject?.length === 0 ? (
            <div className="d-flex justify-content-between align-items-center my-3">
              <p>No tasks found</p>
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowTaskModal(true)}
                >
                  + New Task
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center my-3">
                <h4>
                  {proName}
                  Tasks
                </h4>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowTaskModal(true)}
                  >
                    + New Task
                  </button>
                </div>
              </div>

              <div className="row">
                {tasksByProject?.map((task) => (
                  <div className="col-md-4" key={task._id || task.id}>
                    <div className="card mb-4">
                      <Link
                        to={`/taskDetails/${task._id}`}
                        style={{ textDecoration: "none", color: "black" }}
                      >
                        <div className="card-body">
                          <p>Status: {task.status}</p>
                          <h5 className="card-title">{task.name}</h5>
                          <p>Due Date: {task.dueDate?.split("T")[0]}</p>
                          <p className="card-text">
                            {task.owners.map((owner) => owner.name).join(", ")}
                          </p>
                        </div>
                      </Link>
                      <div>
                        <button
                          className="btn btn-danger btn-sm float-end me-3 mb-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask123(task._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {showTaskModal && <div className="modal-backdrop fade show"></div>}

          <div
            className={`modal fade ${showTaskModal ? "show d-block" : ""}`}
            id="taskModal"
            tabIndex="-1"
            aria-labelledby="taskModalLabel"
            aria-hidden={!showTaskModal}
            style={{ backgroundColor: "rgba(24, 21, 21, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="taskModalLabel">
                    Create New Task | {proName}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowTaskModal(false);
                      setTaskData({
                        name: "",
                        project: "",
                        team: "",
                        owners: [],
                        tags: [],
                        dueDate: "",
                        timeToComplete: 0,
                      });
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div class="mb-3">
                      <label for="recipient-name" class="col-form-label">
                        Task Name:
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="recipient-name"
                        value={taskData.name}
                        onChange={(e) =>
                          setTaskData({ ...taskData, name: e.target.value })
                        }
                        placeholder="Enter Name"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="message-text" class="col-form-label">
                        Select Team:
                      </label>
                      <select
                        class="form-select w-100"
                        value={taskData.team}
                        onChange={(e) =>
                          setTaskData({ ...taskData, team: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          select team
                        </option>
                        {teams?.map((team) => (
                          <option key={team._id} value={team._id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="row">
                      <div class="col-md-6 mb-3">
                        <label for="recipient-name" class="col-form-label">
                          Tags:
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="recipient-name"
                          value={taskData.tags}
                          onChange={(e) =>
                            setTaskData({ ...taskData, tags: e.target.value })
                          }
                          placeholder="Enter tags"
                        />
                      </div>

                      <div class="col-md-6 mb-3">
                        <label class="form-label text-capitalize">
                          Owners:
                        </label>
                        <Select
                          isMulti
                          options={userOptions}
                          value={userOptions.filter((option) =>
                            taskData.owners.includes(option.value)
                          )}
                          onChange={(selected) =>
                            setTaskData({
                              ...taskData,
                              owners: selected.map((s) => s.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div class="col-md-6 mb-3">
                        <label for="recipient-name" class="col-form-label">
                          Select Due Date:
                        </label>
                        <input
                          type="date"
                          class="form-control"
                          id="recipient-name"
                          value={taskData.dueDate}
                          onChange={(e) =>
                            setTaskData({
                              ...taskData,
                              dueDate: e.target.value,
                            })
                          }
                          placeholder="Enter Name"
                        />
                      </div>

                      <div class="col-md-6 mb-3">
                        <label for="recipient-name" class="col-form-label">
                          Estimated Time:
                        </label>
                        <input
                          type="number"
                          class="form-control"
                          id="recipient-name"
                          value={taskData.timeToComplete}
                          onChange={(e) =>
                            setTaskData({
                              ...taskData,
                              timeToComplete: e.target.value,
                            })
                          }
                          placeholder="Enter Time in days"
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowTaskModal(false);
                      setTaskData({
                        name: "",
                        project: "",
                        team: "",
                        owners: [],
                        tags: [],
                        dueDate: "",
                        timeToComplete: 0,
                      });
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveTask}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
