import React, { Component } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const location = useLocation();
  const logout = () => {
    // Redirect to the login page

    window.localStorage.clear();

    navigate("/");
    window.location.reload();
    //    window.history.pushState(null, '', '/');
    //    window.onpopstate = () => {
    //    window.history.pushState(null, '', '/');
    // };
  };

  const handleLogout = () => {
    if (token && username) {
      logout();
    }
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");

    if (storedUsername && storedToken) {
      setUsername(storedUsername);
      setToken(storedToken);
    }
  }, []);

  return (
    <div id="left-sidebar" className="sidebar">
      <div className="user-account p-3 mb-3">
        <div className="d-flex mb-3 pb-3 border-bottom align-items-center">
          <img
            src="assets/images/user.png"
            className="avatar lg rounded me-3"
            alt="User Profile Picture"
          />
          <div className="dropdown flex-grow-1">
            <span>Welcome,</span>
            <a
              href="#"
              className="dropdown-toggle user-name"
              data-bs-toggle="dropdown"
            >
              <strong>{username.split("@")[0]}</strong>
            </a>
            <ul className="dropdown-menu p-2 shadow-sm">
              <li>
                <a href="app-inbox.html">
                  <i className="fa fa-envelope-open me-2" />
                  {username}
                </a>
              </li>

              <li className="divider" />
              <li>
                <a onClick={handleLogout}>
                  <i className="fa fa-power-off me-2" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* nav tab: menu list */}

      {/* nav tab: content */}
      <div className="tab-content px-0">
        <div className="tab-pane fade show active" id="hr_menu" role="tabpanel">
          <nav className="sidebar-nav">
            <ul className="metismenu list-unstyled">
              <li
                className={location.pathname === "/dashboard" ? "active" : ""}
              >
                <Link to="/dashboard">
                  <i className="fa fa-tachometer" />
                  <span>Dashboard</span>
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/facility-list" ? "active" : ""
                }
              >
                <Link to="/facility-list">
                  <i className="fa fa-hospital-o" />
                  <span>Facility List</span>
                </Link>
              </li>
              <li
                className={location.pathname === "/doctor-list" ? "active" : ""}
              >
                <Link to="/doctor-list">
                  <i className="fa fa-user-md" />
                  <span>Doctor List</span>
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/appointment-list" ? "active" : ""
                }
              >
                <Link to="/appointment-list">
                  <i className="fa fa-calendar" />
                  <span>Appointment List</span>
                </Link>
              </li>
              <li
                className={
                  location.pathname === "/change-password" ? "active" : ""
                }
              >
                <Link to="/change-password">
                  <i className="fa fa-edit" />
                  <span>Change Password</span>
                </Link>
              </li>
              <li
                className={location.pathname === "/server-key" ? "active" : ""}
              >
                <Link to="/server-key">
                  <i className="fa fa-key" />
                  <span>Server Key</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="tab-pane fade" id="project_menu" role="tabpanel">
          <nav className="sidebar-nav">
            <ul className="metismenu list-unstyled">
              <li>
                <a href="index2.html">
                  <i className="fa fa-tachometer" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="app-inbox.html">
                  <i className="fa fa-envelope-o" />
                  <span>Inbox App</span>
                </a>
              </li>
              <li>
                <a href="app-chat.html">
                  <i className="fa fa-comments" />
                  <span>Chat App</span>
                </a>
              </li>
              <li>
                <a href="#Projects" className="has-arrow">
                  <i className="fa fa-list-ul" />
                  <span>Projects</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="project-add.html">Add Projects</a>
                  </li>
                  <li>
                    <a href="project-list.html">Projects List</a>
                  </li>
                  <li>
                    <a href="project-grid.html">Projects Grid</a>
                  </li>
                  <li>
                    <a href="project-detail.html">Projects Detail</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#Clients" className="has-arrow">
                  <i className="fa fa-user" />
                  <span>Clients</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="client-add.html">Add Clients</a>
                  </li>
                  <li>
                    <a href="client-list.html">Clients List</a>
                  </li>
                  <li>
                    <a href="client-detail.html">Clients Detail</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="project-team.html">
                  <i className="fa fa-users" />
                  <span>Team</span>
                </a>
              </li>
              <li>
                <a href="app-taskboard.html">
                  <i className="fa fa-tag" />
                  <span>Taskboard</span>
                </a>
              </li>
              <li>
                <a href="app-tickets.html">
                  <i className="fa fa-ticket" />
                  <span>Tickets</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="tab-pane fade" id="sub_menu" role="tabpanel">
          <nav className="sidebar-nav">
            <ul className="metismenu list-unstyled">
              <li>
                <a href="#Blog" className="has-arrow">
                  <i className="fa fa-globe" />
                  <span>Blog</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="blog-dashboard.html">Dashboard</a>
                  </li>
                  <li>
                    <a href="blog-post.html">New Post</a>
                  </li>
                  <li>
                    <a href="blog-list.html">Blog List</a>
                  </li>
                  <li>
                    <a href="blog-details.html">Blog Detail</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#FileManager" className="has-arrow">
                  <i className="fa fa-folder" />
                  <span>File Manager</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="file-dashboard.html">Dashboard</a>
                  </li>
                  <li>
                    <a href="file-documents.html">Documents</a>
                  </li>
                  <li>
                    <a href="file-media.html">Media</a>
                  </li>
                  <li>
                    <a href="file-images.html">Images</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#Widgets" className="has-arrow">
                  <i className="fa fa-puzzle-piece" />
                  <span>Widgets</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="widgets-statistics.html">Statistics Widgets</a>
                  </li>
                  <li>
                    <a href="widgets-data.html">Data Widgets</a>
                  </li>
                  <li>
                    <a href="widgets-chart.html">Chart Widgets</a>
                  </li>
                  <li>
                    <a href="widgets-weather.html">Weather Widgets</a>
                  </li>
                  <li>
                    <a href="widgets-social.html">Social Widgets</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#Pages" className="has-arrow">
                  <i className="fa fa-files-o" />
                  <span>Extra Pages</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="page-blank.html">Blank Page</a>
                  </li>
                  <li>
                    <a href="page-profile2.html">Profile</a>
                  </li>
                  <li>
                    <a href="page-gallery.html">
                      Image Gallery{" "}
                      <span className="badge bg-secondary float-end">v1</span>
                    </a>
                  </li>
                  <li>
                    <a href="page-timeline.html">Timeline</a>
                  </li>
                  <li>
                    <a href="page-timeline-h.html">Horizontal Timeline</a>
                  </li>
                  <li>
                    <a href="page-pricing.html">Pricing</a>
                  </li>
                  <li>
                    <a href="page-invoices.html">Invoices</a>
                  </li>
                  <li>
                    <a href="page-invoices2.html">
                      Invoices{" "}
                      <span className="badge bg-warning float-end">v2</span>
                    </a>
                  </li>
                  <li>
                    <a href="page-search-results.html">Search Results</a>
                  </li>
                  <li>
                    <a href="page-helper-class.html">Helper Classes</a>
                  </li>
                  <li>
                    <a href="page-maintenance.html">Maintenance</a>
                  </li>
                  <li>
                    <a href="page-testimonials.html">Testimonials</a>
                  </li>
                  <li>
                    <a href="page-faq.html">FAQs</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#uiElements" className="has-arrow">
                  <i className="fa fa-diamond" />
                  <span>UI Elements</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="ui-typography.html">Typography</a>
                  </li>
                  <li>
                    <a href="ui-tabs.html">Tabs</a>
                  </li>
                  <li>
                    <a href="ui-buttons.html">Buttons</a>
                  </li>
                  <li>
                    <a href="ui-bootstrap.html">Bootstrap UI</a>
                  </li>
                  <li>
                    <a href="ui-icons.html">Icons</a>
                  </li>
                  <li>
                    <a href="ui-notifications.html">Notifications</a>
                  </li>
                  <li>
                    <a href="ui-colors.html">Colors</a>
                  </li>
                  <li>
                    <a href="ui-dialogs.html">Dialogs</a>
                  </li>
                  <li>
                    <a href="ui-list-group.html">List Group</a>
                  </li>
                  <li>
                    <a href="ui-media-object.html">Media Object</a>
                  </li>
                  <li>
                    <a href="ui-modals.html">Modals</a>
                  </li>
                  <li>
                    <a href="ui-nestable.html">Nestable</a>
                  </li>
                  <li>
                    <a href="ui-progressbars.html">Progress Bars</a>
                  </li>
                  <li>
                    <a href="ui-range-sliders.html">Range Sliders</a>
                  </li>
                  <li>
                    <a href="ui-treeview.html">Treeview</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#forms" className="has-arrow">
                  <i className="fa fa-pencil" />
                  <span>Forms</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="forms-validation.html">Form Validation</a>
                  </li>
                  <li>
                    <a href="forms-advanced.html">Advanced Elements</a>
                  </li>
                  <li>
                    <a href="forms-basic.html">Basic Elements</a>
                  </li>
                  <li>
                    <a href="forms-wizard.html">Form Wizard</a>
                  </li>
                  <li>
                    <a href="forms-dragdropupload.html">
                      Drag &amp; Drop Upload
                    </a>
                  </li>
                  <li>
                    <a href="forms-cropping.html">Image Cropping</a>
                  </li>
                  <li>
                    <a href="forms-summernote.html">Summernote</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#Tables" className="has-arrow">
                  <i className="fa fa-tag" />
                  <span>Tables</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="table-basic.html">
                      Tables Example
                      <span className="badge bg-info float-end">New</span>
                    </a>
                  </li>
                  <li>
                    <a href="table-normal.html">Normal Tables</a>
                  </li>
                  <li>
                    <a href="table-jquery-datatable.html">Jquery Datatables</a>
                  </li>
                  <li>
                    <a href="table-editable.html">Editable Tables</a>
                  </li>
                  <li>
                    <a href="table-color.html">Tables Color</a>
                  </li>
                  <li>
                    <a href="table-filter.html">
                      Table Filter{" "}
                      <span className="badge bg-info float-end">New</span>
                    </a>
                  </li>
                  <li>
                    <a href="table-dragger.html">
                      Table dragger{" "}
                      <span className="badge bg-info float-end">New</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#charts" className="has-arrow">
                  <i className="fa fa-bar-chart" />
                  <span>Charts</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="chart-morris.html">Morris</a>
                  </li>
                  <li>
                    <a href="chart-flot.html">Flot</a>
                  </li>
                  <li>
                    <a href="chart-jquery-knob.html">Jquery Knob</a>
                  </li>
                  <li>
                    <a href="chart-sparkline.html">Sparkline Chart</a>
                  </li>
                  <li>
                    <a href="chart-peity.html">Peity</a>
                  </li>
                  <li>
                    <a href="chart-apex.html">Apex Charts</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="#Maps" className="has-arrow">
                  <i className="fa fa-map-o" />
                  <span>Maps</span>
                </a>
                <ul className="list-unstyled">
                  <li>
                    <a href="map-yandex.html">Yandex Map</a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <div className="tab-pane fade" id="setting_menu" role="tabpanel">
          <div className="px-3">
            <h6>Choose Skin</h6>
            <ul className="choose-skin list-unstyled">
              <li data-theme="purple" className="mb-2">
                <div className="purple" />
                <span>Purple</span>
              </li>
              <li data-theme="blue" className="mb-2">
                <div className="blue" />
                <span>Blue</span>
              </li>
              <li data-theme="cyan" className="active mb-2">
                <div className="cyan" />
                <span>Cyan</span>
              </li>
              <li data-theme="green" className="mb-2">
                <div className="green" />
                <span>Green</span>
              </li>
              <li data-theme="orange" className="mb-2">
                <div className="orange" />
                <span>Orange</span>
              </li>
              <li data-theme="blush" className="mb-2">
                <div className="blush" />
                <span>Blush</span>
              </li>
            </ul>
            <hr />
            <h6>Theme Option</h6>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center mb-1">
                <div className="form-check form-switch theme-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="theme-switch"
                  />
                  <label className="form-check-label" htmlFor="theme-switch">
                    Enable Dark Mode!
                  </label>
                </div>
              </li>
              <li className="d-flex align-items-center mb-1">
                <div className="form-check form-switch theme-high-contrast">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="theme-high-contrast"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="theme-high-contrast"
                  >
                    Enable High Contrast
                  </label>
                </div>
              </li>
              <li className="d-flex align-items-center mb-1">
                <div className="form-check form-switch theme-rtl">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="theme-rtl"
                  />
                  <label className="form-check-label" htmlFor="theme-rtl">
                    Enable RTL Mode!
                  </label>
                </div>
              </li>
              <li className="d-flex align-items-center mb-1">
                <div className="form-check form-switch minisidebar-active">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="mini-active"
                  />
                  <label className="form-check-label" htmlFor="mini-active">
                    Mini Sidebar
                  </label>
                </div>
              </li>
            </ul>
            <hr />
            <h6>General Settings</h6>
            <ul className="setting-list list-unstyled">
              <li>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault"
                  >
                    Default checkbox
                  </label>
                </div>
              </li>
              <li>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    id="flexCheckDefault1"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault1"
                  >
                    Email Redirect
                  </label>
                </div>
              </li>
              <li>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    id="flexCheckDefault2"
                    defaultChecked
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault2"
                  >
                    Notifications
                  </label>
                </div>
              </li>
              <li>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    id="flexCheckDefault3"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault3"
                  >
                    Auto Updates
                  </label>
                </div>
              </li>
              <li>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    id="flexCheckDefault4"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault4"
                  >
                    Offline
                  </label>
                </div>
              </li>
              <li>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    defaultValue
                    id="flexCheckDefault5"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="flexCheckDefault5"
                  >
                    Location Permission
                  </label>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
