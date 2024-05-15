import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FacilityList from "./pages/FacilityList";
import DoctorList from "./pages/DoctorList";
import AppointmentList from "./pages/AppointmentList";
import ChangePassword from "./pages/ChangePassword";
import ServerKey from "./pages/ServerKey";
import HospitalEchsUpdate from "./pages/HospitalEchsUpdate";
import EditFacilityList from "./pages/EditFacilityList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/facility-list" element={<FacilityList />} />
      <Route path="/hospital-echs-update" element={<HospitalEchsUpdate />} />
      <Route path="/edit-facility-list" element={<EditFacilityList />} />
      <Route path="/doctor-list" element={<DoctorList />} />
      <Route path="/appointment-list" element={<AppointmentList />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/server-key" element={<ServerKey />} />
    </Routes>
  );
}

export default App;
