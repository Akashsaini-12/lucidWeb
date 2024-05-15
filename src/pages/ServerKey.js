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

export default function ServerKey() {
  const [isHovered, setIsHovered] = useState(false);
  const [dashData, setDashData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiddenFacValue, setHiddenFacValue] = useState("Facility");
  const [hiddenDocValue, setHiddenDocValue] = useState("Doctor");
  const [hiddenPatValue, setHiddenPatValue] = useState("Patient");
  const [doctorServerKey, setDoctorServerKey] = useState([]);
  const [facilityServerKey, setFacilityServerKey] = useState([]);
  const [patientServerKey, setPatientServerKey] = useState([]);
  const [doctorServerKeyId, setDoctorServerKeyId] = useState([]);
  const [facilityServerKeyId, setFacilityServerKeyId] = useState([]);
  const [patientServerKeyId, setPatientServerKeyId] = useState([]);
  const [updateFackeyErr, setUpdateFackeyErr] = useState("");
  const [updateDockeyErr, setUpdateDockeyErr] = useState("");
  const [updatePatkeyErr, setUpdatePatkeyErr] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const [dataDoc, setDataDoc] = useState([]);
  const [token, setToken] = useState("");
  const storedToken = localStorage.getItem("token");
  //const location = useLocation();
  //console.log(location,"location");
  const navigate = useNavigate();
  const location = useLocation();
  const [adminCountData, setAdminCountData] = useState(location.state);
  //const adminCountData = location.state;
  // console.log(adminCountData, "adminCountDatakkkk");
  // const  facCount=adminCountData.facCount
  // const  appotCount=adminCountData.apptCount
  // const  docCount=adminCountData.docCount
  // console.log(facCount,appotCount,docCount,"sgafdjhgjklshglkhdf");

  // const docCount = localStorage.getItem("doctorCount");
  // const faclityCount = localStorage.getItem("hospCount");
  // const aptCount = localStorage.getItem("appontCount");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    // Check if the username is available
    if (storedToken) {
      setToken(storedToken);
    } else {
      navigate("/");
    }
  }, [location.state]);
  useEffect(() => {
    if (!storedToken) {
      navigate("/");
    }
    const fetchData = async () => {
      setIsLoading(true);
      const params = { eventID: "1013", addInfo: {} };
      const guid = "8f430dd92a3ff151";
      // console.log("params", params);
      try {
        const response = await fetch(
          `http://dev-api.sourceinfosys.in/fac/commDetails`,
          {
            method: "POST",
            headers: {
              "Access-Control-Allow-Headers": "Content-Type,*",
              "Access-Control-Allow-Credentials": "*",
              "Access-Control-Allow-Origin": `${Base_Url}facility/services`,
              "Access-Control-Allow-Methods": "POST",
              "Content-Type": "application/json",
              Authorization: `Bearer ${storedToken}`,
              Accept: "application/json",
              guid: guid,
            },

            body: JSON.stringify(params),
          }
        );
        const responseData = await response.json();
        if (response.ok) {
          console.log(responseData, "docfcmserverKey");
          setDoctorServerKeyId(responseData.rData.list[0]._id);
          setDoctorServerKey(responseData.rData.list[0].DocfcmServerKey);
          setFacilityServerKeyId(responseData.rData.list[1]._id);
          setFacilityServerKey(responseData.rData.list[1].FacfcmServerKey);
          setPatientServerKeyId(responseData.rData.list[2]._id);
          setPatientServerKey(responseData.rData.list[2].PatfcmServerKey);
          setIsLoading(false);
        } else {
          setError(responseData.rData.rMessage || "Failed to fetch data");
        }
      } catch (error) {
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    if (storedToken) {
      fetchData();
    }
  }, []);
  const handleFormValidation = () => {
    let formIsValid = true;
    if (!facilityServerKey) {
      setUpdateFackeyErr("Facility Server Key is required.");
      formIsValid = false;
    } else {
      setUpdateFackeyErr("");
    }
    if (!doctorServerKey) {
      setUpdateDockeyErr("Doctor Server Key is required.");
      formIsValid = false;
    } else {
      setUpdateDockeyErr("");
    }
    if (!patientServerKey) {
      setUpdatePatkeyErr("Patient Server Key is required.");
      formIsValid = false;
    } else {
      setUpdatePatkeyErr("");
    }

    return formIsValid;
  };

  const handleLogin = async (e, hiddenValue) => {
    e.preventDefault();
    setShowLoader(true);
    const guid = "8f430dd92a3ff151";
    // Make an API request to authenticate the user
    const loginId = localStorage.getItem("loginId");
    console.log("Facility Server Key:", facilityServerKey);
    console.log("Hidden Facility Value:", hiddenValue);
    let serverKey;
    let keyId;
    if (hiddenValue === "Facility") {
      serverKey = facilityServerKey;
      keyId = facilityServerKeyId;
    } else if (hiddenValue === "Doctor") {
      serverKey = doctorServerKey;
      keyId = doctorServerKeyId;
    } else if (hiddenValue === "Patient") {
      serverKey = patientServerKey;
      keyId = patientServerKeyId;
    }
    // Send the data to the backend
    const params = {
      eventID: "1001",
      addInfo: {
        id: keyId,
        userType: hiddenValue,
        fcmServerKey: serverKey,
      },
    };

    console.log("params", params);
    if (handleFormValidation() == true) {
      try {
        const responseFac = await networkRequest(
          "fcmServerKey",
          "POST",
          params
        );
        // console.log("responseFac", responseFac);
        const { rData } = responseFac;
        console.log(rData, "rData");
        if (rData?.rCode === 0) {
          // setResponseSuccessMessage("Password Change successful");
          toast.success("Server Key Update Successfully!", {
            // position: toast.POSITION.TOP_CENTER, // Make sure you are using the correct constant
            position: "top-center", // Make sure you are using the correct constant
          });
          setTimeout(() => {
            setShowLoader(false); // Hide loader after 1 second

            // window.location.reload();
          }, 1000);
        } else {
          toast.error("Server Key Not Update Please update Again", {
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
      <div id="wrapper">
        <Header />
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
                    Server Key
                  </h2>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">Update Server Key</h6>
                  </div>
                  <div className="card-body">
                    <form
                      className="row g-3 my-2"
                      onSubmit={(e) => handleLogin(e, hiddenFacValue)}
                    >
                      <div className="col-12">
                        <label className="form-label">
                          Facility Server Key
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={facilityServerKey}
                          onChange={(e) => setFacilityServerKey(e.target.value)}
                        />
                        <input
                          type="hidden"
                          className="form-control"
                          value={hiddenFacValue}
                          onChange={(e) => setHiddenFacValue(e.target.value)}
                        />
                        <input
                          type="hidden"
                          className="form-control"
                          value={facilityServerKeyId}
                          onChange={(e) =>
                            setFacilityServerKeyId(e.target.value)
                          }
                        />
                        <p className="error" style={{ color: "red" }}>
                          {updateFackeyErr}
                        </p>

                        <button type="submit" className="btn btn-primary">
                          Update
                        </button>
                      </div>
                    </form>
                    <form
                      className="row g-3  my-2"
                      onSubmit={(e) => handleLogin(e, hiddenDocValue)}
                    >
                      <div className="col-12">
                        <label className="form-label">Doctor Server Key</label>
                        <input
                          type="text"
                          className="form-control"
                          value={doctorServerKey}
                          onChange={(e) => setDoctorServerKey(e.target.value)}
                        />
                        <input
                          type="hidden"
                          className="form-control"
                          value={hiddenDocValue}
                          onChange={(e) => setHiddenDocValue(e.target.value)}
                        />
                        <input
                          type="hidden"
                          className="form-control"
                          value={doctorServerKeyId}
                          onChange={(e) => setDoctorServerKeyId(e.target.value)}
                        />
                        <p className="error" style={{ color: "red" }}>
                          {updateDockeyErr}
                        </p>
                        <button type="submit" className="btn btn-primary">
                          Update
                        </button>
                      </div>
                    </form>
                    <form
                      className="row g-3 my-2"
                      onSubmit={(e) => handleLogin(e, hiddenPatValue)}
                    >
                      <div className="col-12">
                        <label className="form-label">Patient Server Key</label>
                        <input
                          type="text"
                          className="form-control"
                          value={patientServerKey}
                          onChange={(e) => setPatientServerKey(e.target.value)}
                        />
                        <input
                          type="hidden"
                          className="form-control"
                          value={hiddenPatValue}
                          onChange={(e) => setHiddenPatValue(e.target.value)}
                        />
                        <input
                          type="hidden"
                          className="form-control"
                          value={patientServerKeyId}
                          onChange={(e) =>
                            setPatientServerKeyId(e.target.value)
                          }
                        />
                        <p className="error" style={{ color: "red" }}>
                          {updatePatkeyErr}
                        </p>
                        <button type="submit" className="btn btn-primary">
                          Update
                        </button>
                      </div>
                    </form>
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
    </div>
  );
}
