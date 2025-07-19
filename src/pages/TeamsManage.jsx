import { Sidebar } from "../components/Sidebar";
import useFetch from "../useFetch";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

export const TeamsManage = () => {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamData, setTeamData] = useState({ name: "", description: "" });

  const {
    data: teams,
    loading: loadingTeams,
    error: errorTeams,
    refetch: refetchTeam,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/teams`);

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!teamData.name || !teamData.description) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/teams`,
        teamData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res);
      toast.success("Team Added successfully!");
      setShowTeamModal(false);
      setTeamData({ name: "", description: "" });
      refetchTeam();
    } catch (err) {
      toast.error("Add to failed");
      console.log(err);
    }
  };

  const handleDeleteTeam = async (proId) => {
    const token = localStorage.getItem("token")?.trim();

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_API_URL}/teams/${proId}`,
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
        toast.success("Team deleted successfully!");
        refetchTeam();
      } else {
        toast.error("Failed to delete Team");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete Team";
      toast.error(errorMessage);
      console.log(err);
    }
  };

  console.log(teams);

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

        <main className="flex-grow-1 col-md-8 p-4 bg-light">
          <div>
            <div className="d-flex justify-content-between align-items-center my-3">
              <h4>Teams List</h4>
              <div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowTeamModal(true)}
                >
                  + New Team
                </button>
              </div>
            </div>
            {loadingTeams ? (
              <p
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
              >
                Loading...
              </p>
            ) : errorTeams ? (
              <p className="text-danger">
                Error loading teams: {errorTeams.message}
              </p>
            ) : teams?.length === 0 || null ? (
              <p>No teams found</p>
            ) : (
              <div className="row">
                {teams?.map((team) => (
                  <div className="col-md-4" key={team._id || team.id}>
                    <div className="card mb-4">
                      <div className="card-body">
                        <h5 className="card-title">{team.name}</h5>
                        <p className="card-text py-3">
                          <strong>Description: </strong> {team.description}
                        </p>
                        <button
                          className="btn btn-danger btn-sm float-end "
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team._id);
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
          </div>

          {showTeamModal && <div className="modal-backdrop fade show"></div>}

          <div
            className={`modal fade ${showTeamModal ? "show d-block" : ""}`}
            id="teamModal"
            tabIndex="-1"
            aria-labelledby="teamModalLabel"
            aria-hidden={!showTeamModal}
            style={{ backgroundColor: "rgba(24, 21, 21, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="teamModalLabel">
                    Create New Team
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowTeamModal(false);
                      setTeamData({ name: "", description: "" });
                    }}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div class="mb-3">
                      <label for="recipient-name" class="col-form-label">
                        Team Name:
                      </label>
                      <input
                        type="text"
                        class="form-control"
                        id="recipient-name"
                        value={teamData.name}
                        onChange={(e) =>
                          setTeamData({
                            ...teamData,
                            name: e.target.value,
                          })
                        }
                        placeholder="Enter Name"
                      />
                    </div>
                    <div class="mb-3">
                      <label for="message-text" class="col-form-label">
                        Team Description:
                      </label>
                      <textarea
                        class="form-control"
                        value={teamData.description}
                        onChange={(e) =>
                          setTeamData({
                            ...teamData,
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
                      setShowTeamModal(false);
                      setTeamData({ name: "", description: "" });
                    }}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveTeam}
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
