import { Link } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import useFetch from "../useFetch";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const ProjectAndItsTask = () => {
  const [showModal, setShowModal] = useState(false);
  const [projectData, setProjectData] = useState({ name: "", description: "" });


  const {
    data,
    loading: loadingProjects,
    error: errorProjects,
    refetch: refetchProjects,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/projects`);

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
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      toast.success("Project Added successfully!");
      setShowModal(false);
      setProjectData({ name: "", description: "" });
      refetchProjects();
    } catch (err) {
      toast.error("Add to failed");
      console.log(err);
    }
  };

  const handleDeleteProject = async (proId) => {
    const token1 = localStorage.getItem("token")?.trim();

    if (!token1) {
      toast.error("No authentication token found.");
      return;
    }
    console.log(token1);
    console.log(proId);

    // fetch(`${import.meta.env.VITE_BASE_API_URL}/projects/${proId}`, {
    //   method: "DELETE",
    //   headers: {
    //     Authorization: `Bearer ${token1}`,
    //     withCredentials: true,
    //     "Content-Type": "application/json",
    //   },
    // })
    //   .then((res) => {
    //     if (!res.ok) throw new Error("Delete failed ");
    //     return res.json();
    //   })
    //   .then(() => {
    //     toast.success("Project deleted successfully  ✅");
    //     window.location.reload();
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     toast.error("Delete failed ❌");
    //   });

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/projects/${proId}`,
        {
          headers: {
            Authorization: `Bearer ${token1}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log(res.status);
      console.log(res.data);
      console.log(res);
      if (res.status === 200) {
        toast.success("Project deleted successfully!");
        refetchProjects();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete project";
      toast.error(errorMessage);
      console.log(err);
    }
  };

  return (
    <div className="h-100  d-flex flex-column container-fluid">
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

      <div className="flex-grow-1 row d-flex">
        <Sidebar />

        <main className="flex-grow-1 col-md-8 p-4 bg-light">
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

          {loadingProjects ? (
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              Loading...
            </p>
          ) : errorProjects ? (
            <p
              className="d-flex justify-content-center align-items-center text-danger"
              style={{ height: "50vh" }}
            >
              Error: {errorProjects}
            </p>
          ) : data?.length === 0 ? (
            <p>No Projects found</p>
          ) : (
            <div className="row">
              {data?.map((project) => (
                <div className="col-md-4" key={project._id || project.id}>
                  <div className="card mb-4">
                    <Link
                      to={`/taskByProject/${project._id}`}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <div className="card-body">
                        <h5 className="card-title">{project.name}</h5>
                        <p className="card-text">{project.description}</p>
                      </div>
                    </Link>
                    <div>
                      <button
                        className="btn btn-danger btn-sm float-end me-3 mb-3"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project._id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
