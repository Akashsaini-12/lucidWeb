import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";
import { Base_Url } from "./Network";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import { networkRequest } from "./apiUtils";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cnfNewPassword, setCnfNewPassword] = useState("");

  const [oldPasswordErr, setOldPasswordErr] = useState("");
  const [newPasswordErr, setNewPasswordErr] = useState("");
  const [cnfNewPasswordErr, setCnfNewPasswordErr] = useState("");
  const [passwordMatchErr, setPasswordMatchErr] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [responseMessageSuccess, setResponseSuccessMessage] = useState("");
  const [keys, setKeys] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleFormValidation = () => {
    let formIsValid = true;

    if (!oldPassword) {
      setOldPasswordErr("Old Password is required.");
      formIsValid = false;
    } else {
      setOldPasswordErr("");
    }
    if (!newPassword) {
      setNewPasswordErr("New Password is required.");
      formIsValid = false;
    } else {
      setNewPasswordErr("");
    }
    if (!cnfNewPassword) {
      setCnfNewPasswordErr("Conriem New Password is required.");
      formIsValid = false;
    } else {
      setCnfNewPasswordErr("");
    }
    console.log(newPassword);
    console.log(cnfNewPassword);
    if (newPassword !== cnfNewPassword) {
      setPasswordMatchErr("New Passwords Do Not Match");
      formIsValid = false;
    } else {
      setPasswordMatchErr("");
    }

    return formIsValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    const guid = "8f430dd92a3ff151";
    // Make an API request to authenticate the user
    const loginId = localStorage.getItem("loginId");

    // Send the data to the backend
    const params = {
      eventID: "1001",
      addInfo: {
        id: loginId,
        oldPassword: oldPassword,
        newPassword: newPassword,
      },
    };

    // console.log("encParamsLogin", encParams);
    if (handleFormValidation() == true) {
      try {
        const responseFac = await networkRequest("password", "POST", params);

        const { rData } = responseFac;
        if (rData?.rCode === 0) {
          // setResponseSuccessMessage("Password Change successful");
          toast.success("Password Change Successfully!", {
            // position: toast.POSITION.TOP_CENTER, // Make sure you are using the correct constant
            position: "top-center", // Make sure you are using the correct constant
          });
          setTimeout(() => {
            setShowLoader(false); // Hide loader after 1 second
            window.localStorage.clear();

            navigate("/");
            // window.location.reload();
          }, 1000);
        } else {
          toast.error("*Old Password Wrong", {
            // position: toast.POSITION.TOP_CENTER, // Make sure you are using the correct constant
            position: "top-center", // Make sure you are using the correct constant
          });
        }
        console.log("rData", rData);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };
  return (
    <div id="layout" className="theme-cyan">
      {/* <Loaders /> */}
      {/* Overlay For Sidebars */}
      <div id="wrapper">
        {/* top navbar */}
        <Header />
        {/* Sidbar menu */}
        <Navbar />
        <div id="main-content">
          <div class="container-fluid">
            <div class="block-header py-lg-4 py-3">
              <div class="row g-3">
                <div class="col-md-6 col-sm-12">
                  <h2 class="m-0 fs-5">
                    <a
                      href="javascript:void(0);"
                      class="btn btn-sm btn-link ps-0 btn-toggle-fullwidth"
                    >
                      <i class="fa fa-arrow-left"></i>
                    </a>{" "}
                    Change Password
                  </h2>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">Please Update Password</h6>
                  </div>
                  <div className="card-body">
                    {/* <form
                      className="row g-3"
                      id="basic-form"
                      method="post"
                      noValidate
                    > */}
                    <form className="row g-3" onSubmit={handleLogin}>
                      <div className="col-6">
                        <label className="form-label">Old Password</label>
                        <input
                          type="password"
                          id="email"
                          className="form-control"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <p className="error" style={{ color: "red" }}>
                          {oldPasswordErr}
                        </p>
                        {/* <input type="text" className="form-control" required /> */}
                      </div>
                      <div className="col-6">
                        <label className="form-label">New Password</label>
                        <input
                          type="password"
                          id="email"
                          className="form-control"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <p className="error" style={{ color: "red" }}>
                          {newPasswordErr}
                        </p>
                      </div>
                      <div className="col-6">
                        <label className="form-label">Confirm Password</label>
                        <input
                          type="password"
                          id="email"
                          className="form-control"
                          value={cnfNewPassword}
                          onChange={(e) => setCnfNewPassword(e.target.value)}
                        />
                        <p className="error" style={{ color: "red" }}>
                          {cnfNewPasswordErr}
                          {passwordMatchErr}
                        </p>
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div>
                  <ToastContainer />
                  {/* ... rest of your component ... */}
                  {/* {responseMessage && <p>{responseMessage}</p>} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
