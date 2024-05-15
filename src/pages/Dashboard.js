import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Loaders from "../components/Loaders";
import { useLocation, useNavigate } from "react-router-dom";
import { Base_Url } from "./Network";
import { networkRequest } from "./apiUtils";
import ApexCharts from "apexcharts";

export default function Dashboard() {
  const [isHovered, setIsHovered] = useState(false);
  const [linkedEchs, setLinkedEchs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [appointmentList, setAppointmentList] = useState([]);
  const [dataDoc, setDataDoc] = useState([]);
  const [dataAppointment, setDataAppointment] = useState([]);
  const [emptyPercent, setEmptyPercent] = useState([]);
  const [NonemptyPercent, setNonEmptyPercent] = useState([]);
  const [statusPer, setStatusPer] = useState([]);
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
  function getStatusLabel(status) {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Waiting";
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
      const guid = "8f430dd92a3ff151";
      const params = { eventID: "1001", addInfo: {} };
      const paramsDoc = { eventID: "1002", addInfo: {} };
      const paramsAppointment = { eventID: "1003", addInfo: {} };
      try {
        const responseFac = await networkRequest(
          "facility/services",
          "POST",
          params
        );

        const { rData } = responseFac;
        console.log("rData", rData);
        if (rData?.rCode === 0) {
          setData(rData.rData.length);
          console.log("facility", rData.rData);
          const totalCount = rData.rData.length;
          // Count of elements where "Empanelled" is an empty array
          const emptyEmpanelledCount = rData.rData.filter(
            (item) => item.Empanelled === "[]"
          ).length;

          // Count of elements where "Empanelled" is not an empty array
          const nonEmptyEmpanelledCount = rData.rData.filter(
            (item) => item.Empanelled !== "[]"
          ).length;
          setLinkedEchs(nonEmptyEmpanelledCount);
          const emptyEmpanelledPercent =
            (emptyEmpanelledCount / totalCount) * 100;
          const nonEmptyEmpanelledPercent =
            (nonEmptyEmpanelledCount / totalCount) * 100;
          setEmptyPercent(emptyEmpanelledPercent);
          setNonEmptyPercent(nonEmptyEmpanelledPercent);

          console.log(
            "Percentage of items with empty Empanelled:",
            emptyEmpanelledPercent.toFixed(2) + "%"
          );
          console.log(
            "Percentage of items with non-empty Empanelled:",
            nonEmptyEmpanelledPercent.toFixed(2) + "%"
          );
          const options = {
            chart: {
              width: 190,
              height: 190,
              type: "donut",
            },
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    show: true,
                    total: {
                      show: true,
                      showAlways: true,
                      label: "Total",
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#000",
                    },
                  },
                },
              },
            },
            dataLabels: {
              enabled: false,
            },
            legend: {
              position: "top",
              horizontalAlign: "center",
              show: false,
            },
            colors: ["grey", "#204e79"],
            series: [emptyEmpanelledCount, nonEmptyEmpanelledCount],
            labels: ["Unlink", "Link"],
          };

          const chart = new ApexCharts(
            document.querySelector("#apex-TotalStudent1"),
            options
          );
          chart.render();
          setIsLoading(false);
        } else {
          setError(rData.rMessage || "Failed to fetch data");
        }
        const responseDoc = await networkRequest(
          "facility/services",
          "POST",
          paramsDoc
        );

        const rDatas = responseDoc.rData; // Ensure rDatas is an object or set it to an empty object
        // console.log("rDatas", responseDoc.rData);
        if (rDatas?.rCode === 0) {
          // console.log("rDatas", rDatas.rData);
          setDataDoc(rDatas.rData.length);
        } else {
          setError(rDatas?.rMessage || "Failed to fetch data");
        }
        const responseAppointment = await networkRequest(
          "facility/services",
          "POST",
          paramsAppointment
        );

        const rDataAppointment = responseAppointment.rData; // Ensure rDatas is an object or set it to an empty object
        // console.log("rDatas", responseDoc.rData);
        if (rDataAppointment?.rCode === 0) {
          console.log("rDataAppointment.rData", rDataAppointment.rData);
          const statusNames = {
            0: "Pending",
            1: "Waiting",
            2: "Completed",
            3: "Cancelled",
            4: "Laps",
            5: "Doctor on Leave",
          };
          const statusColorCodes = {
            Pending: "#ffc107", // Example color code for Pending
            Waiting: "#fd7e14", // Example color code for Waiting
            Completed: "#198754", // Example color code for Completed
            Cancelled: "#dc3545", // Example color code for Cancelled
            Laps: "#d63384", // Example color code for Laps
            "Doctor on Leave": "#204e79", // Example color code for Doctor on Leave
          };
          const statusCount = {};

          // Iterate through the appointments array and count the occurrences of each status
          rDataAppointment.rData.forEach((appointment) => {
            const status = appointment.status;
            const statusName = statusNames[status];

            // Check if the status name is already in the count object
            if (statusCount[statusName]) {
              // If yes, increment the count
              statusCount[statusName]++;
            } else {
              // If no, initialize the count for that status name to 1
              statusCount[statusName] = 1;
            }
          });
          // Calculate the total count
          const totalCount = Object.values(statusCount).reduce(
            (acc, count) => acc + count,
            0
          );

          // Calculate the percentage for each status
          const statusPercentages = {};
          Object.keys(statusCount).forEach((statusName) => {
            const count = statusCount[statusName];
            const percentage = (count / totalCount) * 100;
            statusPercentages[statusName] = percentage.toFixed(2); // Round to two decimal places
          });
          console.log(
            "Status Percentages:",
            Object.values(statusPercentages).map(
              (percentage) => `${percentage}%`
            )
          );
          setStatusPer(statusPercentages);
          console.log("statusPercentages", statusPercentages);
          Object.keys(statusPercentages).forEach((statusName) => {
            const percentage = statusPercentages[statusName];
            console.log(`${statusName}: ${percentage}%`);
          });
          // Output the status name-wise count
          console.log("Status Name Wise Count:", statusCount);
          var options = {
            series: Object.values(statusCount),
            legend: {
              show: false,
            },
            dataLabels: {
              enabled: false,
            },
            chart: {
              height: 245,
              type: "pie",
            },
            labels: Object.keys(statusCount),
            colors: Object.keys(statusCount).map(
              (statusName) => statusColorCodes[statusName]
            ),
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          };
          var chart = new ApexCharts(
            document.querySelector("#sparkline-piechart"),
            options
          );
          chart.render();
          var options = {
            series: [
              {
                name: "Male",
                data: [23, 32, 45, 23, 56, 20, 23, 32, 45, 23, 56, 0],
              },
              {
                name: "Female",
                data: [25, 83, 92, 26, 23, 25, 23, 32, 45, 23, 56, 0],
              },
            ],
            chart: {
              type: "bar",
              height: 245,
              stacked: true,
              toolbar: {
                show: false,
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            stroke: {
              width: 1,
              colors: ["#fff"],
            },
            colors: ["#204e79", "grey"],
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              categories: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              labels: {
                formatter: function (val) {
                  return val + "";
                },
              },
            },
            yaxis: {
              title: {
                text: undefined,
              },
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val + "K";
                },
              },
            },
            fill: {
              opacity: 1,
            },
            legend: {
              position: "top",
              horizontalAlign: "center",
              offsetX: 0,
            },
          };
          var chart = new ApexCharts(
            document.querySelector("#Salary_Statistics_Chart"),
            options
          );
          chart.render();
          setAppointmentList(rDataAppointment.rData.slice(0, 5).reverse());
          setDataAppointment(rDataAppointment.rData.length);
        } else {
          setError(rDatas?.rMessage || "Failed to fetch data");
        }
      } catch (error) {
        setError(error.message);
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
          <div className="container-fluid">
            <div className="block-header py-lg-4 py-3">
              <div className="row g-3">
                <div className="col-md-6 col-sm-12">
                  <h2 className="m-0 fs-5">
                    <a
                      href="javascript:void(0);"
                      className="btn btn-sm btn-link ps-0 btn-toggle-fullwidth"
                    >
                      <i className="fa fa-arrow-left" />
                    </a>{" "}
                    Dashboard
                  </h2>
                </div>
              </div>
            </div>
            <div className="row g-2 clearfix row-deck">
              <div className="col-xl-3 col-lg-6 col-md-6">
                <div className="card top_counter">
                  <div className="list-group list-group-custom list-group-flush">
                    <div className="list-group-item d-flex align-items-center py-3">
                      <div className="icon text-center me-3">
                        <i className="fa fa-hospital-o" />{" "}
                      </div>
                      <div className="content">
                        <div>Total Facility</div>
                        <h5 className="mb-0">{data}</h5>
                      </div>
                    </div>
                    <div className="list-group-item d-flex align-items-center py-3">
                      <div className="icon text-center me-3">
                        <i className="fa fa-user-md" />{" "}
                      </div>
                      <div className="content">
                        <div>Total Doctor</div>
                        <h5 className="mb-0">{dataDoc}</h5>
                      </div>
                    </div>
                    <div className="list-group-item d-flex align-items-center py-3">
                      <div className="icon text-center me-3">
                        <i className="fa fa-calendar" />{" "}
                      </div>
                      <div className="content">
                        <div>Total Appointment</div>
                        <h5 className="mb-0">{dataAppointment}</h5>
                      </div>
                    </div>
                    <div className="list-group-item d-flex align-items-center py-3">
                      <div className="icon text-center me-3">
                        <i className="fa fa-link" />{" "}
                      </div>
                      <div className="content">
                        <div>Linked With ECHS</div>
                        <h5 className="mb-0">{linkedEchs}</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6 col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">Total Facility Action</h6>
                  </div>
                  {/* <div className="card-body text-center">
                    <div id="apex-TotalStudent1" />
                    <div className="mb-3 mt-4">
                      <span className="text-muted small">Unlink</span>
                      <h4 className="mb-0">{emptyPercent}%</h4>
                    </div>
                    <div>
                      <span className="text-muted small">Link</span>
                      <h4 className="mb-0">{NonemptyPercent}%</h4>
                    </div>
                  </div> */}
                  <div className="card-body text-center ">
                    <div
                      id="apex-TotalStudent1"
                      className="mt-3 d-flex justify-content-center"
                    />
                    <div className="stats-report">
                      <div className="stat-item d-inline-block px-2 mt-4">
                        <h5 className="mb-0 fw-normal fs-6">Unlink</h5>
                        <strong>{emptyPercent}%</strong>
                      </div>
                      <div className="stat-item d-inline-block px-2 mt-4">
                        <h5 className="mb-0 fw-normal fs-6">Link</h5>
                        <strong>{NonemptyPercent}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-6 col-lg-12 col-md-12">
                <div className="card">
                  <div className="card-header border-0">
                    <h6 className="card-title">Patient Visit by Gender</h6>
                  </div>
                  <div className="card-body">
                    <div id="Salary_Statistics_Chart" />
                  </div>
                </div>
              </div>

              <div className="col-xl-8 col-lg-7 col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">Upcoming Appointments</h6>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
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
                          {appointmentList.map((val, key) => (
                            <tr key={key}>
                              <td>
                                {key + 1}
                                {/* <strong>
                                  {(currentPage - 1) * itemsPerPage + key + 1}
                                </strong> */}
                              </td>
                              <td>{val.patientName}</td>
                              <td>{val.facilityName}</td>
                              <td>{val.doctorName}</td>
                              <td>{val.bookingDate}</td>
                              <td>{val.appointmentDate}</td>
                              <td>{formatTime(val.fromTime)}</td>
                              <td>{formatTime(val.toTime)}</td>
                              <td>
                                {getStatusLabel(val.status) === "Completed" && (
                                  <span className="badge bg-success">
                                    {getStatusLabel(val.status)}
                                  </span>
                                )}
                                {getStatusLabel(val.status) === "Waiting" && (
                                  <span className="badge bg-warning">
                                    {getStatusLabel(val.status)}
                                  </span>
                                )}
                                {getStatusLabel(val.status) === "Cancelled" && (
                                  <span className="badge bg-danger">
                                    {getStatusLabel(val.status)}
                                  </span>
                                )}

                                {getStatusLabel(val.status) === "Pending" && (
                                  <span className="badge bg-warning">
                                    {getStatusLabel(val.status)}
                                  </span>
                                )}
                                {getStatusLabel(val.status) ===
                                  "Doctor on Leave" && (
                                  <span className="badge bg-primary">
                                    {getStatusLabel(val.status)}
                                  </span>
                                )}
                                {getStatusLabel(val.status) ===
                                  "Appointment Date is over" && (
                                  <span className="badge bg-dark">
                                    {getStatusLabel(val.status)}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-5 col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h6 className="card-title">Total Appointment</h6>
                  </div>

                  <div className="card-body">
                    <div
                      id="sparkline-piechart"
                      className="mt-3 d-flex justify-content-center"
                    />
                    <div className="stats-report text-center">
                      {/* {Object.keys(statusPer).map((statusName) => (
                        <div key={statusName}>
                          <strong>{statusPer[statusName]}%</strong> {statusName}
                        </div>
                      ))} */}
                      {Object.keys(statusPer).map((statusName) => (
                        <div className="stat-item d-inline-block px-2 mt-4">
                          <h5 className="mb-0 fw-normal fs-6">{statusName}</h5>
                          <strong>{statusPer[statusName]}%</strong>
                        </div>
                      ))}
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
