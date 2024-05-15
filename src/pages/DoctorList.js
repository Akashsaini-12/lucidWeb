import React from "react";
import { useState, useEffect } from "react";
import { Base_Url } from "./Network";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";

export default function DoctorList() {
  const [isLoading, setIsLoading] = useState(true); // State to manage loading
  const [doctorList, setDoctorList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [doctorData, setDoctorData] = useState([]);
  const [error, setError] = useState(null);

  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  useEffect(() => {
    // Simulate an API call to fetch data (you can replace this with your actual API call)
    if (!storedToken) {
      navigate("/");
    }
    const fetchDoctorData = async () => {
      //const token = storedToken;
      const guid = "8f430dd92a3ff151";
      const params = { eventID: "1002", addInfo: {} };
      // console.log("params", params);
      try {
        const response = await fetch(`${Base_Url}facility/services`, {
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
        });
        const responseData = await response.json();
        // console.log("responseData", responseData);
        if (response.ok) {
          // console.log(responseData.rData.rData, "rdoctor");
          // setDoctorData(responseData.rData.rData);
          setDoctorList(responseData.rData.rData);

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
    fetchDoctorData();
  }, []);

  //pagination
  const itemsPerPage = 10;
  const doctorListLength = doctorList.length;
  //  console.log(doctorListLength,"doctorListLength");
  const filteredData = doctorList.filter((val) => {
    return (
      val.doctorName.toLowerCase().includes(searchInput.toLowerCase()) ||
      val.doctorMobile.includes(searchInput) ||
      val.doctorEmail.includes(searchInput)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
                    Doctor List
                  </h2>
                </div>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-header">
                    <h6 class="card-title">Doctor List</h6>
                  </div>
                  <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                      <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                      >
                        <span className="navbar-toggler-icon"></span>
                      </button>
                      <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                      >
                        <form className="d-flex">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Search DoctorList..."
                            value={searchInput}
                            onChange={handleSearchInputChange}
                            style={{ textAlign: "center" }}
                          />
                        </form>
                      </div>
                    </div>
                  </nav>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>SL No</th>
                            <th>Doctor Name</th>
                            <th>Mobile Number</th>
                            <th>Email Id</th>
                            <th>No. Of Experience</th>
                            <th>Hospital Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((val, key) => {
                            return (
                              <tr key={key}>
                                <td>
                                  <strong>
                                    {(currentPage - 1) * itemsPerPage + key + 1}
                                  </strong>
                                </td>
                                <td>{val.doctorName}</td>
                                <td>{val.doctorMobile}</td>
                                <td>{val.doctorEmail}</td>
                                <td>{val.doctorExperience}</td>
                                <td>{val.FacilityName}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                      <div
                        className="pagination"
                        style={{
                          marginTop: "25px",
                          float: "right",
                          marginRight: "3%",
                        }}
                      >
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          style={{
                            cursor: "pointer",
                            color: "black",
                            padding: "8px 16px",
                            textDecoration: "none",
                            transition: "backgroundColor 0.3s",
                            border: "1px solid #ddd",
                          }}
                        >
                          <i className="fa fa-chevron-left"></i>
                        </button>
                        {Array.from({
                          length: Math.ceil(filteredData.length / itemsPerPage),
                        }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => handlePageChange(index + 1)}
                            className={`pagination-button ${
                              currentPage === index + 1 ? "active" : ""
                            }`}
                            style={{
                              cursor: "pointer",
                              color:
                                currentPage === index + 1 ? "white" : "black",
                              padding: "8px 16px",
                              textDecoration: "none",
                              transition: "background-color 0.3s",
                              border: "1px solid #ddd",
                              backgroundColor:
                                currentPage === index + 1
                                  ? "#204e79"
                                  : "initial",
                            }}
                          >
                            {index + 1}
                          </button>
                        ))}
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={endIndex >= filteredData.length}
                          style={{
                            cursor: "pointer",
                            color: "black",
                            padding: "8px 16px",
                            textDecoration: "none",
                            transition: "backgroundColor 0.3s",
                            border: "1px solid #ddd",
                          }}
                        >
                          <i className="fa fa-chevron-right"></i>
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
