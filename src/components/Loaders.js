import React from "react";

export default function Loaders() {
  return (
    <div className="page-loader-wrapper text-center">
      <div className="loader">
        <img
          src="assets/images/medsKeylogo.png"
          className="avatar lg rounded me-3"
          alt="User Profile Picture"
        />
        <div className="h5 fw-light mt-3">Please wait</div>
      </div>
    </div>
  );
}
