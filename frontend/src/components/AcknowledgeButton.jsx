import axios from "axios";

export default function AcknowledgeButton({ alertId }) {
  const token = localStorage.getItem("token");

  const handleAck = async () => {
    await axios.post(
      `http://localhost:5000/api/acknowledge/${alertId}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Acknowledged");
  };

  return <button onClick={handleAck}>Acknowledge</button>;
}
