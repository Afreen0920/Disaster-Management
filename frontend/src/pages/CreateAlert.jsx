import { useState } from "react";
import axios from "axios";

export default function CreateAlert() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/alerts/create", {
      title,
      description,
    });
    alert("Alert Created!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Create Alert</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Alert Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br /><br />

        <textarea
          placeholder="Alert Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea><br /><br />

        <button type="submit">Send Alert</button>
      </form>
    </div>
  );
}
