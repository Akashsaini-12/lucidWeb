import React from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";
import { Base_Url } from "./Network";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AppointmentList() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointmentList, setAppointmentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [appointmentData, setAppointment] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("token");

  const formatTime = (inputTime) => {
    // Ensure the input is a string
    const inputTimeString = inputTime.toString();

    // Check if the input time has at least 3 characters
    if (inputTimeString.length >= 3) {
      // Extract hours and minutes
      const hours = inputTimeString.slice(0, -2);
      const minutes = inputTimeString.slice(-2);

      // Format the time as HH:MM
      const formattedTime = `${hours}:${minutes}`;

      return formattedTime;
    }

    // Return the original input if it doesn't have at least 3 characters
    return inputTimeString;
  };
  useEffect(() => {
    if (!storedToken) {
      navigate("/");
    }
    const fetchAppointData = async () => {
      const guid = "8f430dd92a3ff151";
      const params = { eventID: "1003", addInfo: {} };
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
          // console.log(responseData.rData.rData, "responseData.rData.rData");
          setAppointmentList(responseData.rData.rData);

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
    fetchAppointData();
  }, []);

  const itemsPerPage = 10;
  const dataLength = appointmentList.length;
  // console.log(dataLength,"dataLength");
  const filteredData = appointmentList.filter((val) => {
    return (
      val.patientName.toLowerCase().includes(searchInput.toLowerCase()) ||
      val.facilityName.includes(searchInput) ||
      val.doctorName.includes(searchInput)
    );
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);

  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // converting status code in to Statement.
  function getStatusLabel(status) {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Pending";
      case 2:
        return "Completed";
      case 3:
        return "Cancelled";
      case 4:
        return "Appointment Date is over";
      case 5:
        return "Doctor on Leave";
      default:
        return "Unknown";
    }
  }
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
                    Appointment List
                  </h2>
                </div>
              </div>
            </div>

            <div class="row g-3">
              <div class="col-lg-12">
                <div class="card">
                  <div class="card-header">
                    <h6 class="card-title"> Appointment List</h6>
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
                            placeholder="Search AppointntList.."
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
                            <th>Patient Name</th>
                            <th>Hospital Name</th>
                            <th>Doctor Name</th>
                            <th>Booking Date</th>
                            <th>Appointment Date</th>
                            <th>Form Time</th>
                            <th>To Time</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentData.map((val, key) => (
                            <tr key={key}>
                              <td>
                                <strong>
                                  {(currentPage - 1) * itemsPerPage + key + 1}
                                </strong>
                              </td>
                              <td>{val.patientName}</td>
                              <td>{val.facilityName}</td>
                              <td>{val.doctorName}</td>
                              <td>{val.bookingDate}</td>
                              <td>{val.appointmentDate}</td>
                              <td>{formatTime(val.fromTime)}</td>
                              <td>{formatTime(val.toTime)}</td>
                              <td> {getStatusLabel(val.status)}</td>
                            </tr>
                          ))}
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
