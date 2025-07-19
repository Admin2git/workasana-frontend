import React, { useState } from "react";
import "../App.css";
import { Sidebar } from "../components/Sidebar";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import Select from "react-select";
import UseTaskContext from "../contexts/TaskManageContext";

export const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectData, setProjectData] = useState({ name: "", description: "" });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [taskData, setTaskData] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: [],
    dueDate: "",
    timeToComplete: 0,
  });

  const {
    projects,
    loadingProjects,
    errorProjects,
    refetchProjects,
    handleDeleteTask,
    tasks,
    loadingTasks,
    errorTasks,
    refetchTask,
  } = UseTaskContext();

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

  const filteredProjects = projects?.filter((project) =>
    project.name
      .split(" ")
      .join("")
      .toLowerCase()
      .includes(searchTerm.split(" ").join("").toLowerCase())
  );

  const filteredTasks = tasks?.filter(
    (task) =>
      task.name
        .split(" ")
        .join("")
        .toLowerCase()
        .includes(searchTerm.split(" ").join("").toLowerCase()) ||
      task.status
        ?.split(" ")
        .join("")
        .toLowerCase()
        .includes(searchTerm.split(" ").join("").toLowerCase()) ||
      task.owners.some((owner) =>
        owner.name
          .split(" ")
          .join("")
          .toLowerCase()
          .includes(searchTerm.split(" ").join("").toLowerCase())
      )
  );

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!projectData.name || !projectData.description) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/projects`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            withCredentials: true,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      toast.success("Added successfully!");
      setShowModal(false);
      setProjectData({ name: "", description: "" });
      refetchProjects();
    } catch (err) {
      toast.error("Add to failed");
      console.log(err);
    }
  };

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
      !taskData.project ||
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
            withCredentials: true,
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
      refetchTask();
    } catch (err) {
      toast.error("Add to failed");
      console.log(err);
    }

    console.log(data);
  };

  if (loadingProjects || loadingTasks || loadingTeam || loadingUsers) {
    return (
      <p
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        Loading...
      </p>
    );
  }

  if (errorProjects || errorTasks || errorTeam || errorUsers) {
    return (
      <p
        className="d-flex justify-content-center align-items-center text-danger"
        style={{ height: "50vh" }}
      >
        Error: {errorProjects || errorTasks}
      </p>
    );
  }

  console.log(tasks);
  console.log(projects);
  return (
    <div className="h-100 d-flex flex-column container-fluid">
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-md row navbar-dark bg-secondary bg-opacity-75 sticky-top">
        <div className="container d-flex justify-content-around my-2">
          <a className="navbar-brand h1 m-0" href="/dashboard">
            workasana
          </a>

          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Find a task or project by name, owner, or status"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: "390px" }}
          />

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

      <div className="flex-grow-1 row d-flex">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-grow-1 col-md-8 p-4 bg-light">
          <div>
            <div className="d-flex justify-content-between align-items-center my-3">
              <h3>Projects</h3>
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowModal(true)}
                >
                  + New Project
                </button>
              </div>
            </div>

            {filteredProjects?.length === 0 ? (
              <p>No Projects found</p>
            ) : (
              <div className="row">
                {filteredProjects?.map((project) => (
                  <div className="col-md-4" key={project._id || project.id}>
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title">{project.name}</h5>
                        <p className="card-text">{project.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="d-flex justify-content-between align-items-center my-3">
              <h3>My Tasks</h3>
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

            {filteredTasks?.length === 0 ? (
              <p>No tasks found</p>
            ) : (
              <div className="row">
                {filteredTasks?.map((task) => {
                  console.log(task.project?._id);
                  return (
                    <div className="col-md-4" key={task._id || task.id}>
                      <div className="card mb-4">
                        <Link
                          to={`/taskDetails/${task._id}`}
                          style={{ textDecoration: "none", color: "black" }}
                        >
                          <div className="card-body">
                            <p> Status: {task.status}</p>
                            <h5 className="card-title">{task.name}</h5>
                            <p>Due Date: {task.dueDate?.split("T")[0]}</p>
                            <p className="card-text">
                              {task.owners
                                .map((owner) => owner.name)
                                .join(" , ")}
                            </p>
                          </div>
                        </Link>
                        <div>
                          <button
                            className="btn btn-danger btn-sm float-end me-3 mb-3"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task._id);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

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
                    Create New Task |
                    {projects?.map((project) =>
                      project._id == taskData.project ? project.name : ""
                    )}
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
                    <div class=" mb-3">
                      <label class="form-label text-capitalize">
                        Select Project:
                      </label>
                      <select
                        class="form-select w-100"
                        value={taskData.project}
                        onChange={(e) =>
                          setTaskData({ ...taskData, project: e.target.value })
                        }
                      >
                        <option value="" disabled>
                          select name
                        </option>
                        {projects?.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>

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

          {showModal && <div className="modal-backdrop fade show"></div>}

          <div
            className={`modal fade ${showModal ? "show d-block" : ""}`}
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden={!showModal}
            style={{ backgroundColor: "rgba(24, 21, 21, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Create New Project
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowModal(false);
                      setProjectData({ name: "", description: "" });
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div class="mb-3">
                      <label for="recipient-name" class="col-form-label">
                        Project Name:
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="recipient-name"
                        value={projectData.name}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter Name"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="message-text" class="col-form-label">
                        Project Description:
                      </label>
                      <textarea
                        class="form-control"
                        value={projectData.description}
                        onChange={(e) =>
                          setProjectData({
                            ...projectData,
                            description: e.target.value,
                          })
                        }
                        id="message-text"
                      ></textarea>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setProjectData({ name: "", description: "" });
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveProject}
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
