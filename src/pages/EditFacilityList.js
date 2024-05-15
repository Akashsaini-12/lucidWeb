import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";
import { Base_Url } from "./Network";
import { AES, enc, SHA256, mode, pad } from "crypto-js";

export default function EditFacilityList() {
  // Data fetching from FacilityList By using useLocation
  const navigate = useNavigate();
  const location = useLocation();
  const propsData = location.state;
  // console.log(propsData.Empanelled, "datass");
  // console.log(propsData._date_time,"propsData");
  //Token Fetching Frm Local
  const storedUsername = localStorage.getItem("username");
  const storedToken = localStorage.getItem("token");

  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // console.log(setSearchQuery, "kkkkk");
  //For updating List
  const fetchDataFromApi = async () => {
    const empId = propsData.Empanelled.replace(/\[|\]/g, "");
    // console.log(empId, "empId");
    // Replace with your parameter value
    const token = storedToken;
    const guid = "8f430dd92a3ff151";
    try {
      const loginId = localStorage.getItem("loginId");
      // console.log(loginId, "loginId");
      const params = {
        eventID: "1004",
        addInfo: {
          id: propsData.Id,
          empannel: {
            empId: empId,
            id: loginId,
          },
        },
      };
      // console.log(params, "params");
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
        eventID: "1004",
        addInfo: {
          encHashData: hashedAddInfoString,
          encData: encryptedData,
          guid: "8f430dd92a3ff151",
        },
      };
      // console.log("encParamsUnLinkData", encParams);
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
          guid: guid,
        },
        body: JSON.stringify(encParams),
      });
      const responseData = await response.json();
      // console.log(responseData, "responseData.rData.rDataedit");
      // console.log("gfdsjgfj", responseData);
      if (response.ok) {
        // console.log("Unlink Successfully");

        alert("Unlink Successfully");
        navigate("/facility-list");
        setData(responseData.rData.rData);
      } else {
        setError(responseData.rData.rMessage || "Failed to fetch data");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
    }
  };

  //Filter Hospital Name

  const handleUnlinkClick = () => {
    const confirmUnlink = window.confirm("Are you sure you want to unlink?");
    if (confirmUnlink) {
      // User clicked "OK," proceed with unlinking
      fetchDataFromApi();
    }
    // If user clicked "Cancel," do nothing
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
                    Facilty
                  </h2>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">Edit Facility</h6>
                  </div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-6">
                        <label className="form-label">
                          Medikey Hospital Name
                        </label>
                        <input
                          value={propsData.Name}
                          type="text"
                          className="form-control"
                          required
                          readOnly
                        />
                      </div>

                      <div className="col-6">
                        <label className="form-label">Mobile Number</label>
                        <input
                          value={propsData.Mobile}
                          type="text"
                          className="form-control"
                          required
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Email Id</label>
                        <input
                          value={propsData.Email}
                          type="text"
                          className="form-control"
                          required
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">
                          ECHS Regional Center Name
                        </label>
                        <input
                          value={propsData.rcName}
                          type="text"
                          className="form-control"
                          required
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">ECHS Hospital Name</label>
                        <input
                          value={propsData.echsHosp}
                          type="text"
                          className="form-control"
                          required
                          readOnly
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">
                          Updated Time & Date
                        </label>
                        <input
                          value={propsData._date_time}
                          type="text"
                          className="form-control"
                          required
                          readOnly
                        />
                      </div>

                      <div className="col-12">
                        <button
                          type="submit"
                          onClick={handleUnlinkClick}
                          className="btn btn-primary"
                        >
                          Unlink
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
