import React from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import useFetch from "../useFetch";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Reports = () => {
  const {
    data: lastWeek,
    loading: loadinglastWeek,
    error: errorlastWeek,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/report/last-week`);

  const {
    data: taskClosed,
    loading: loadingpenWorks,
    error: errorpenWorks,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/report/closed-tasks`);

  const {
    data: penWorks,
    loading: loadingtaskClosed,
    error: errortaskClosed,
  } = useFetch(`${import.meta.env.VITE_BASE_API_URL}/report/pending-work`);

  console.log(taskClosed?.data);
  console.log(lastWeek);
  console.log(penWorks?.data);
  const lastWeekComplete = {
    labels: lastWeek?.map((task) => task._id),
    datasets: [
      {
        label: "work completed",
        data: lastWeek?.map((task) => task.totalCompleted),
        backgroundColor: "rgb(146, 208, 250)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const generateColors = (count) => {
    const bgColors = [];
    const borderColors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 255);
      const g = Math.floor(Math.random() * 255);
      const b = Math.floor(Math.random() * 255);
      bgColors.push(`rgba(${r}, ${g}, ${b}, 0.2)`);
      borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }
    return { bgColors, borderColors };
  };

  const colors = generateColors(taskClosed?.data?.length || 0);

  const data1 = {
    labels: taskClosed?.data?.map((task) => task.teamName),
    datasets: [
      {
        label: "no. of status",
        data: taskClosed?.data?.map((task) => task.closedCount),
        backgroundColor: colors.bgColors,
        borderColor: colors.borderColors,
        borderWidth: 1,
      },
    ],
  };

  const pendingWorks = {
    labels: penWorks?.data?.map((task) => task.projectName),
    datasets: [
      {
        label: "Pending work",
        data: penWorks?.data?.map((task) => task.pendingWork),
        backgroundColor: "rgba(146, 241, 250, 1)",
        borderColor: "rgba(151, 231, 240, 1)",
        borderWidth: 1,
      },
    ],
  };

  const navigate = useNavigate();

  return (
    <div className="h-100  d-flex flex-column container-fluid">
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

      <div className="flex-grow-1 row d-flex">
        <Sidebar />

        <main className="flex-grow-1 col-md-8 p-4 bg-light">
          {loadinglastWeek || loadingpenWorks || loadingtaskClosed ? (
            <p
              className="d-flex justify-content-center align-items-center"
              style={{ height: "50vh" }}
            >
              Loading...
            </p>
          ) : errorlastWeek || errorpenWorks || errortaskClosed ? (
            <p
              className="d-flex justify-content-center align-items-center text-danger"
              style={{ height: "50vh" }}
            >
              Error: {errorlastWeek || errorpenWorks || errortaskClosed}
            </p>
          ) : (
            <div className="d-flex justify-content-between align-items-center my-3">
              <div className="d-flex flex-column  align-items-center col-12  text-center ">
                <h3>Reports</h3>

                <div className="col-12 col-md-7 pb-5">
                  <Bar
                    data={lastWeekComplete}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Total work completed last week",
                        },
                        tooltip: {
                          enabled: true,
                          callbacks: {
                            label: (context) => {
                              return `work completed: ${context.raw}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div className="col-12 col-md-5 pb-5">
                  <Pie
                    data={data1}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Tasks closed by each team",
                        },
                        tooltip: {
                          enabled: true,
                          callbacks: {
                            label: (context) => {
                              return `task closed: ${context.raw}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                <div className="col-12 col-md-7 pb-5">
                  <Bar
                    data={pendingWorks}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Pending work across projects",
                        },
                        tooltip: {
                          enabled: true,
                          callbacks: {
                            label: (context) => {
                              return `Pending work: ${context.raw}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
