import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Base_Url } from "./Network";
import { CSVLink } from "react-csv";

export default function FacilityList() {
  const storedUsername = localStorage.getItem("username");
  const storedToken = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Step 2: Add an event handler to update the search input
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1);
  };

  // Step 3: Modify the rendering of table rows to filter data
  // console.log(data, "useStateData");
  const dataLength = data.length;
  // console.log(dataLength, "dataLength");
  const filteredData = data.filter((val) => {
    return (
      val.Name.toLowerCase().includes(searchInput.toLowerCase()) ||
      val.Mobile.includes(searchInput) ||
      val.Email.toLowerCase().includes(searchInput.toLowerCase())
    );
  });
  //Step 4:Applying Pagination on rows Data
  const itemsPerPage = 10; // Number of items to display per page

  // Calculate the start and end index of the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // console.log(endIndex, "endIndex");
  // Data for the current page
  const currentData = filteredData.slice(startIndex, endIndex);
  // console.log(currentData, "currentData");
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  useEffect(() => {
    if (!storedToken) {
      navigate("/");
    }
    const fetchData = async () => {
      setIsLoading(true);
      const guid = "8f430dd92a3ff151";
      const params = { eventID: "1001", addInfo: {} };

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
          console.log(responseData.rData.rData, "rdoctor");
          // setDoctorData(responseData.rData.rData);
          setData(responseData.rData.rData);

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
                    Facility List
                  </h2>
                </div>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-header">
                    <h6 class="card-title">Facility List</h6>

                    {/* <small class="d-block">
                      Basic example without any additional modification classes
                    </small> */}
                  </div>
                  <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                      {/* <h1 className="navbar-brand">Facility List</h1> */}
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
                            className="form-control me-2"
                            type="search"
                            placeholder="Search Facility List..."
                            aria-label="Search"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                          />
                        </form>

                        {/* Add the cloud download icon */}
                      </div>
                      <CSVLink
                        data={data}
                        filename={"medsKey-facility.csv"}
                        className="btn btn-primary"
                      >
                        <i className="fas fa-cloud-download-alt">
                          {" "}
                          Export Facility List
                        </i>
                      </CSVLink>
                    </div>
                  </nav>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th> Facility Name</th>
                            <th>Mobile Number</th>
                            <th>Email Id</th>
                            <th>RC Name</th>
                            <th> Hospital Name</th>
                            <th> Date & Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((val, key) => {
                            // console.log(val, "length");
                            // console.log(key, "key");
                            //object destructure
                            const {
                              Name,
                              Mobile,
                              Email,
                              Id,
                              Empanelled,
                              echsHosp,
                              rcName,
                              _date_time,
                            } = val;
                            // console.log(Empanelled, "Empanelled_id");
                            return (
                              <tr>
                                <td>
                                  <strong>
                                    {" "}
                                    {(currentPage - 1) * itemsPerPage + key + 1}
                                  </strong>
                                </td>
                                <td>{Name}</td>
                                <td>{Mobile}</td>
                                <td>{Email}</td>

                                <td>
                                  {rcName || (
                                    <span style={{ color: "Black" }}>
                                      No Link With ECHS{" "}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {echsHosp || (
                                    <span style={{ color: "Black" }}>
                                      No Link With ECHS{" "}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {_date_time || (
                                    <span style={{ color: "black" }}>
                                      No Link With ECHS{" "}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {val.Empanelled === "[]" ? (
                                    <button
                                      className="btn btn-primary"
                                      onClick={() => {
                                        navigate("/hospital-echs-update", {
                                          state: {
                                            Name,
                                            Mobile,
                                            Email,
                                            Id: Id,
                                          },
                                        });
                                      }}
                                    >
                                      <i
                                        className="fa fa-check-square"
                                        aria-hidden="true"
                                      ></i>{" "}
                                      Link With ECHS
                                    </button>
                                  ) : (
                                    <div>
                                      <button
                                        className="btn btn-primary"
                                        style={{
                                          width: "150px",
                                        }}
                                        onClick={() => {
                                          navigate("/edit-facility-list", {
                                            state: {
                                              Name,
                                              Mobile,
                                              Email,
                                              Id: Id,
                                              Empanelled,
                                              echsHosp,
                                              rcName,
                                              _date_time,
                                            },
                                          });
                                        }}
                                      >
                                        <i className="fas fa-edit"></i> UnLink
                                      </button>
                                    </div>
                                  )}
                                </td>
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
                          className="prev-btn"
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
