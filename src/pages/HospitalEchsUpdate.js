import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";
import { AES, enc, SHA256, mode, pad } from "crypto-js";
import { Base_Url } from "./Network";

export default function HospitalEchsUpdate() {
  const navigate = useNavigate();
  const location = useLocation();
  const propsData = location.state;

  //Token Fetching From Local
  const storedUsername = localStorage.getItem("username");
  const storedToken = localStorage.getItem("token");

  // const [hospitalRc, setHospitalRc] = useState([]);
  const [hospitaName, setHospitaName] = useState([]);
  const [hospital, setHospital] = useState("");
  const [rcName, setRcName] = useState(""); // State to store the selected name
  const [hospitalId, setHospitalID] = useState("");
  const [hospitalName, setHospitalName] = useState(""); // State to store the selected name
  const [selectRc, setSelectRc] = useState([]);
  const [selectName, setSelectName] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [validationMessageHospital, setValidationMessageHospital] =
    useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  //  const localStorage.getItem()
  useEffect(() => {
    const fetchData = async () => {
      const token = storedToken;
      try {
        const response = await fetch(
          `${Base_Url}echs/services
        `,
          {
            method: "POST",
            headers: {
              "Access-Control-Allow-Headers": "Content-Type,*",
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "POST",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              guid: "8f430dd92a3ff151",
            },
            body: JSON.stringify({
              eventID: "1003",
              addInfo: {},
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        if (response.ok) {
          setSelectRc(data.rData);
          // console.log(data.rData);
        }
      } catch (error) {
        // console.error("Error:", error.message);
      }
    };

    fetchData();
  }, []);
  const handleChangeHospitalRc = (e) => {
    const rcId = e.target.value;
    const selectedOptionName = e.target.options[e.target.selectedIndex].text;
    setHospital(rcId);
    setRcName(selectedOptionName);
    if (rcId === "0" && selectedOptionName === "") {
      setValidationMessage("Please select a valid Regional Center Name.");
    } else {
      setValidationMessage("");
    }
  };

  useEffect(() => {
    const fetchHospital = async () => {
      const token = storedToken;
      // const paramss = {
      //   eventID: "1002",
      //   addInfo: {
      //     rcId: hospital,
      //   },
      // };
      const guid = "8f430dd92a3ff151";
      try {
        const loginId = localStorage.getItem("loginId");
        // console.log(loginId, "loginId");
        const params = {
          eventID: "1002",
          addInfo: {
            rcId: hospital,
          },
        };
        // console.log(params, "params1010");
        const encryptionKey = guid;
        const addInfoString = JSON.stringify(params.addInfo);
        const encryptAESData = (addInfoString, encryptionKey) => {
          const options = {
            mode: mode.CBC,
            padding: pad.Pkcs7,
            iv: enc.Utf8.parse(encryptionKey.substring(0, 16)),
          };
          const encryptedData = AES.encrypt(
            encryptionKey.substring(0, 16) + addInfoString,
            enc.Utf8.parse(encryptionKey),
            options
          ).toString();
          return encryptedData;
        };

        //Send the data to the backend

        const encryptedData = encryptAESData(addInfoString, encryptionKey);

        //convert in to SHA256
        const hashedAddInfoString = SHA256(addInfoString).toString();
        // console.log(hashedAddInfoString, "hashedAddInfoString");
        const encParams = {
          eventID: "1002",
          addInfo: {
            encHashData: hashedAddInfoString,
            encData: encryptedData,
            guid: "8f430dd92a3ff151",
          },
        };
        // console.log("encParamsUnLinkData", encParams);
        // console.log(params,"params1010")
        const response = await fetch(`${Base_Url}echs/services`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Headers": "Content-Type,*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            guid: "8f430dd92a3ff151",
          },
          body: JSON.stringify(encParams),
        });
        const responseData = await response.json();
        // console.log('responseData',responseData);
        if (response.ok) {
          setHospitaName(responseData.rData.rData);
          // console.log(responseData,"responseData.rData.rData");
        } else {
          setError(responseData.rData.rMessage || "Failed to fetch data");
        }
      } catch (error) {
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchHospital();
  }, [hospital]);

  const handleChangeHospital = (e) => {
    setSelectName(e.target.value);
    const hospitalId = e.target.value;
    const hospitalName = e.target.options[e.target.selectedIndex].text;
    setHospitalID(hospitalId);
    setHospitalName(hospitalName);
    if (setSelectName === "") {
      setValidationMessageHospital("Please select a valid Hospital Name.");
    } else {
      setValidationMessageHospital("");
    }
  };

  //Api call for hoapitalName
  const fetchDataFromApi = async () => {
    if (hospital === "") {
      // If no option is selected, show an error message
      setValidationMessage("Please select an option");
    } else if (hospitalName === "") {
      setValidationMessageHospital("Please Select Name Option");
    } else {
      setValidationMessage("");
      setValidationMessageHospital("");
      // Replace with your API base URL
      const token = storedToken;
      const publicKeyInRSAString = localStorage.getItem("publicKey");
      const privateKeyString = localStorage.getItem("privateKey");
      // console.log(publicKeyInRSAString, "publicKeyInRSAStringupdateeeeee");
      // console.log(privateKeyString, "privateKeyStringupdateeeeeeee");

      const guid = "8f430dd92a3ff151";
      try {
        const loginId = localStorage.getItem("loginId");
        // console.log(loginId, "loginId");
        const encryptAESData = (addInfoString, encryptionKey) => {
          const options = {
            mode: mode.CBC,
            padding: pad.Pkcs7,
            iv: enc.Utf8.parse(encryptionKey.substring(0, 16)),
          };
          const encryptedData = AES.encrypt(
            encryptionKey.substring(0, 16) + addInfoString,
            enc.Utf8.parse(encryptionKey),
            options
          ).toString();
          return encryptedData;
        };
        const encryptionKey = guid;
        // Send the data to the backend
        const params = {
          eventID: "1003",
          addInfo: {
            _type: "facility",
            _type_id: propsData.Id,
            _emp_id: "64803319d489c9c1b3fb0f18",
            _reg_id: hospitalId,
            rcId: hospital,
            _echsHosp: hospitalName,
            _rcName: rcName,
            id: loginId,
          },
        };
        // console.log(params, "params");
        const addInfoString = JSON.stringify(params.addInfo);
        const encryptedData = encryptAESData(addInfoString, encryptionKey);

        //convert in to SHA256
        const hashedAddInfoString = SHA256(addInfoString).toString();
        // console.log(hashedAddInfoString, "hashedAddInfoString");
        const encParams = {
          eventID: "1001",
          addInfo: {
            encHashData: hashedAddInfoString,
            encData: encryptedData,
            guid: "8f430dd92a3ff151",
          },
        };
        // console.log("encParamsLinkData56347@#", encParams);
        const response = await fetch(`${Base_Url}echs/services`, {
          method: "POST",
          headers: {
            "Access-Control-Allow-Headers": "Content-Type,*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            guid: "8f430dd92a3ff151",
          },
          body: JSON.stringify(encParams),
        });
        const responseData = await response.json();
        // console.log("responseDataupdate", responseData);
        if (response.ok) {
          alert("Linked Successfully");
          navigate("/facility-list");
          setData(responseData.rData.rData);
        } else {
          setError(responseData.rData.rMessage || "Failed to fetch data");
        }
      } catch (error) {
        setError("An error occurred while fetching data");
      }
    }
  };
  //Filter Hospital Name
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
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
                    Hospital ECHS Update
                  </h2>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">Link Hospital</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label">
                          Medskey Hospital Name
                        </label>
                        <input
                          type="text"
                          value={propsData.Name}
                          className="form-control"
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Mobile Number</label>
                        <input
                          type="text"
                          value={propsData.Mobile}
                          className="form-control"
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Email Id</label>
                        <input
                          type="text"
                          value={propsData.Email}
                          className="form-control"
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">
                          ECHS Regional Center Name
                        </label>
                        <select
                          className="form-control"
                          value={hospital}
                          onChange={handleChangeHospitalRc}
                        >
                          {" "}
                          <option value="0">Select Regional Center Name</option>
                          {selectRc.rData
                            ?.sort((a, b) => a.RcName.localeCompare(b.RcName)) // Sort alphabetically
                            .map((val, key) => (
                              <option key={val.RcId} value={val.RcId}>
                                {val.RcName}
                              </option>
                            ))}
                        </select>
                        <div style={{ color: "red" }}>{validationMessage}</div>{" "}
                      </div>
                      <div className="col-6">
                        <label className="form-label">ECHS Hospital Name</label>
                        <select
                          className="form-control"
                          value={selectName}
                          onChange={handleChangeHospital}
                          required
                        >
                          <option value="">Select Hospital Name</option>

                          {/* Search input for filtering */}
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search Hospital Name"
                            value={searchQuery}
                            onChange={handleSearchInputChange}
                          />
                          {/* Generate filtered options */}
                          {hospitaName
                            ?.filter((val) =>
                              val.HospName.toLowerCase().includes(
                                searchQuery.toLowerCase()
                              )
                            )
                            .sort((a, b) =>
                              a.HospName.localeCompare(b.HospName)
                            )
                            .map((val, index) => (
                              <option key={index} value={val.HospId}>
                                {val.HospName}
                              </option>
                            ))}
                        </select>
                        <div style={{ color: "red" }}>
                          {validationMessageHospital}
                        </div>{" "}
                      </div>
                      <div className="col-6">
                        <label className="form-label">Hospital Id</label>
                        <input
                          type="text"
                          value={hospitalId}
                          className="form-control"
                          readOnly
                        />
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          onClick={fetchDataFromApi}
                          className="btn btn-primary"
                        >
                          Update
                        </button>
                      </div>
                    </div>
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
