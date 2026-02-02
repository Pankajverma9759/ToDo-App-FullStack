import React, { useState } from "react";
 import "../Style/addtask.css";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");
  const [isError, setIsError] = useState(false);

  const handleAddTask = async () => {
    // Validation
    if (!title.trim() || !description.trim()) {
      setPopupMsg("All fields are required ❌");
      setIsError(true);
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();

      if (data.success) {
        setPopupMsg(data.message || "Task added successfully ✅");
        setIsError(false);
        setShowPopup(true);

        // Clear inputs
        setTitle("");
        setDescription("");
      } else {
        setPopupMsg(data.message || "No task added ❌");
        setIsError(true);
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMsg("Server error ❌");
      setIsError(true);
      setShowPopup(true);
    }
  };

  return (
    <>
      <div className="addtask-container">
        <h2>Add New Task</h2>

        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <button onClick={handleAddTask}>Add Task</button>
      </div>

      {/* ===== POPUP ===== */}
      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-box ${isError ? "error" : "success"}`}>
            <p>{popupMsg}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
