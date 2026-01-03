import React from "react";
import { assignRescue } from "../services/rescueService";

const Alerts = ({ rescues, user, token }) => {
  const handleAssign = async (rescueId) => {
    try {
      await assignRescue(rescueId, user._id, token);
      alert("Rescue assigned successfully");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <div>
      <h2>Active Rescue Alerts</h2>

      {rescues.map((rescue) => (
        <div key={rescue._id} className="alert-card">
          <p><strong>Location:</strong> {rescue.location}</p>
          <p><strong>Message:</strong> {rescue.message}</p>
          <p><strong>Status:</strong> {rescue.status}</p>

          {rescue.status === "Pending" && (
            <button onClick={() => handleAssign(rescue._id)}>
              Assign to Me
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Alerts;
