import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";
import { Base_Url } from "./Network";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";

export default function ChangePassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [responseMessageSuccess, setResponseSuccessMessage] = useState("");
  const [keys, setKeys] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const handleFormValidation = () => {
    let formIsValid = true;
    if (!username) {
      setEmailErr("Email is required.");
      formIsValid = false;
    } else if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(username)) {
      setEmailErr("Invalid email address.");
      formIsValid = false;
    } else {
      setEmailErr("");
    }

    if (!password) {
      setPasswordErr("Password is required.");
      formIsValid = false;
    } else {
      setPasswordErr("");
    }

    return formIsValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    const guid = "8f430dd92a3ff151";
    // Make an API request to authenticate the user

    // Send the data to the backend
    const params = {
      eventID: "1001",
      addInfo: {
        userId: username,
        pass: password,
        guid: guid,
      },
    };

    // console.log("encParamsLogin", encParams);
    if (handleFormValidation() == true) {
      try {
        const response = await fetch(`${Base_Url}login`, {
          method: "POST",

          body: JSON.stringify(params),
        });
        console.log("response", response);
        if (response.ok) {
          const data = await response.json();
          // console.log("response", data);

          //  const docCount = data.rData.docCount;
          //  const facCount = data.rData.facCount;
          //  const apptCount= data.rData.apptCount;
          //  console.log(apptCount,"dhsfkjhdsgkjh");
          const loginSuccessful = true;
          console.log("data", data);
          if (data?.rData?.rCode == 0 && loginSuccessful) {
            // console.log("nitish");
            // localStorage.setItem("doctorCount", data.rData.docCount);
            // localStorage.setItem("hospCount", data.rData.facCount);
            // localStorage.setItem("appontCount", data.rData.apptCount);
            localStorage.setItem("username", username);
            localStorage.setItem("token", data?.rData?.jwt);
            localStorage.setItem("loginId", data.rData.id);
            // console.log(docCount, facCount, apptCount, "totalcount");
            setLoggedIn(true);
            // navigate("/dashboard", {
            //   state: { docCount, facCount, apptCount },
            // });
            // // console.log("vikash");
            setResponseSuccessMessage("Login successful");
            setTimeout(() => {
              setShowLoader(false); // Hide loader after 1 second
              navigate("/dashboard");
            }, 1000);
          } else {
            // const errorMessage = data.errorMessage || "Unknown error";
            // setResponseMessage(`Login failed: ${errorMessage}`);
            // setResponseMessage(
            //   `Login failed`,
            //   toast.error("*Invalid Credentials!", {
            //     position: toast.POSITION.TOP_CENTER,
            //   })
            // );
            setResponseMessage("Login failed");

            toast.error("*Invalid Credentials!", {
              // position: toast.POSITION.TOP_CENTER, // Make sure you are using the correct constant
              position: "top-center", // Make sure you are using the correct constant
            });
          }
        } else {
          //Handle login error
          const data = await response.json();
          setResponseMessage(`Login failed: ${data.errorMessage}`);
        }
      } catch (error) {
        setResponseMessage(
          toast.error("*Invalid Credentials!", {
            position: toast.POSITION.TOP_CENTER,
          })
        );
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
                    <h6 className="card-title">Basic Validation</h6>
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
                        <input type="text" className="form-control" required />
                      </div>
                      <div className="col-6">
                        <label className="form-label">New Password</label>
                        <input type="email" className="form-control" required />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Confirm Password</label>
                        <input type="email" className="form-control" required />
                      </div>

                      <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
