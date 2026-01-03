import axios from "axios";

const API_URL = "http://localhost:5000/api/rescue";

export const assignRescue = async (rescueId, responderId, token) => {
  const response = await axios.put(
    `${API_URL}/${rescueId}/assign`,
    { responderId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};
