import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UseTaskContext from "../contexts/TaskManageContext";

export const LoginAndSignUp = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { refetchProjects, refetchTask } = UseTaskContext();
  const handleTabChange = (tab) => setActiveTab(tab);
  const navigate = useNavigate();

  const handleChange = (e, type) => {
    const { name, value } = e.target;
    if (type === "login") {
      setLoginData({ ...loginData, [name]: value });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/login`,
        loginData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(res);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      refetchProjects?.();
      refetchTask?.();
      navigate("/dashboard");
    } catch (err) {
      toast.error("Login failed");
      console.log(err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_API_URL}/auth/signup`,
        signupData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("Signup successful!");
      setActiveTab("login");
    } catch (err) {
      toast.error("Signup failed");
      console.log(err);
    }
  };

  return (
    <div>
      <section className="vh-100 bg-light">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
              <div className="card shadow" style={{ borderRadius: "1rem" }}>
                <div className="card-body p-4">
                  <ul
                    className="nav nav-pills nav-justified mb-4"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "login" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("login")}
                      >
                        Login
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${
                          activeTab === "signup" ? "active" : ""
                        }`}
                        onClick={() => handleTabChange("signup")}
                      >
                        Signup
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content">
                    {activeTab === "login" && (
                      <div className="tab-pane fade show active">
                        <h4 className="mb-4 text-center">Login</h4>
                        <form>
                          <div className="mb-3">
                            <label htmlFor="loginEmail" className="form-label">
                              Email
                            </label>
                            <input
                              type="email"
                              id="loginEmail"
                              name="email"
                              value={loginData.email}
                              onChange={(e) => handleChange(e, "login")}
                              className="form-control"
                              placeholder="Enter your email"
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              htmlFor="loginPassword"
                              className="form-label"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              id="loginPassword"
                              name="password"
                              value={loginData.password}
                              onChange={(e) => handleChange(e, "login")}
                              className="form-control"
                              placeholder="Enter your password"
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                            onClick={handleLogin}
                          >
                            Login
                          </button>
                        </form>
                      </div>
                    )}

                    {activeTab === "signup" && (
                      <div className="tab-pane fade show active">
                        <h4 className="mb-4 text-center">Signup</h4>
                        <form>
                          <div className="mb-3">
                            <label htmlFor="signupName" className="form-label">
                              Name
                            </label>
                            <input
                              type="text"
                              id="signupName"
                              name="name"
                              value={signupData.name}
                              onChange={(e) => handleChange(e, "signup")}
                              className="form-control"
                              placeholder="Enter your name"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="signupEmail" className="form-label">
                              Email
                            </label>
                            <input
                              type="email"
                              id="signupEmail"
                              name="email"
                              value={signupData.email}
                              onChange={(e) => handleChange(e, "signup")}
                              className="form-control"
                              placeholder="Enter your email"
                            />
                          </div>

                          <div className="mb-3">
                            <label
                              htmlFor="signupPassword"
                              className="form-label"
                            >
                              Password
                            </label>
                            <input
                              type="password"
                              id="signupPassword"
                              name="password"
                              value={signupData.password}
                              onChange={(e) => handleChange(e, "signup")}
                              className="form-control"
                              placeholder="Enter your password"
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn btn-primary w-100"
                            onClick={handleSignup}
                          >
                            Signup
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
