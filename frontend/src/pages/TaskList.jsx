import React, { useEffect, useState } from "react";
import "../Style/Home.css";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateDesc, setUpdateDesc] = useState("");

  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // deleteOne | deleteAll | complete | update
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  // ================= Fetch Tasks =================
  const getTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks",{
        credentials:'include'
      });
      const data = await res.json();
      if (data.success) setTasks(data.result);
      else setTasks([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  // ================= DELETE ONE =================
  const deleteTask = async () => {
    if (!selectedTaskId) return;

    try {
      const res = await fetch(`http://localhost:5000/task/${selectedTaskId}`, {
        method: "DELETE",
        credentials:'include'
      });
      const data = await res.json();

      if (data.success) {
        getTasks(); // refresh list from backend
      } else {
        alert("Task not found");
      }
    } catch (err) {
      console.error(err);
    }
    closePopup();
  };

  // ================= DELETE ALL =================
  const deleteAllTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "DELETE",
        credentials:'include'
      });
      const data = await res.json();

      if (data.success) {
        getTasks(); // refresh tasks
      } else {
        alert("Something went wrong");
      }
    } catch (err) {
      console.error(err);
    }
    closePopup();
  };

  // ================= COMPLETE TASK =================
  const completeTask = async () => {
    if (!selectedTaskId) return;

    try {
      const res = await fetch(
        `http://localhost:5000/task/${selectedTaskId}/complete`,
        { method: "PATCH",credentials:'include' }
      );
      const data = await res.json();

      if (data.success) {
        getTasks(); // refresh tasks
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
    closePopup();
  };

  // ================= UPDATE TASK =================
  const updateTask = async () => {
    if (!selectedTaskId) return;

    try {
      const res = await fetch(`http://localhost:5000/task/${selectedTaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials:'include',
        body: JSON.stringify({ title: updateTitle, description: updateDesc }),
      });

      const data = await res.json();

      if (data.success) {
        getTasks();
        closePopup();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= POPUP HANDLERS =================
  const openPopup = (type, id = null) => {
    setPopupType(type);
    setSelectedTaskId(id);
    setShowPopup(true);
  };

  const openUpdatePopup = (task) => {
    setSelectedTaskId(task._id);
    setUpdateTitle(task.title);
    setUpdateDesc(task.description);
    setPopupType("update");
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
    setSelectedTaskId(null);
    setUpdateTitle("");
    setUpdateDesc("");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>📝 Task List</h2>
        <button
          className="delete-all-btn"
          onClick={() => openPopup("deleteAll")}
        >
          Delete All
        </button>
      </div>

      {loading ? (
        <p className="loading">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="no-task">No tasks found</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div className="task-card" key={task._id}>
              <div className="task-left">
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  disabled={task.completed}
                  onChange={() =>
                    !task.completed && openPopup("complete", task._id)
                  }
                />

                <div className="task-text">
                  <h4 className={task.completed ? "task-done" : ""}>
                    {task.title}
                  </h4>
                  <p className="task-desc">{task.description}</p>
                </div>
              </div>

              <div className="task-actions">
                <button
                  className="update-btn"
                  onClick={() => openUpdatePopup(task)}
                >
                  Update
                </button>
                <button
                  className="delete-btn"
                  onClick={() => openPopup("deleteOne", task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            {popupType === "deleteOne" && (
              <>
                <h3>Delete Task?</h3>
                <p>This task will be permanently deleted.</p>
                <div className="popup-actions">
                  <button className="confirm-btn" onClick={deleteTask}>
                    Yes, Delete
                  </button>
                  <button className="cancel-btn" onClick={closePopup}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {popupType === "deleteAll" && (
              <>
                <h3>Delete All Tasks?</h3>
                <p>This action cannot be undone.</p>
                <div className="popup-actions">
                  <button className="confirm-btn" onClick={deleteAllTasks}>
                    Delete All
                  </button>
                  <button className="cancel-btn" onClick={closePopup}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {popupType === "update" && (
              <>
                <h3>Update Task</h3>
                <div className="popup-form">
                  <input
                    type="text"
                    value={updateTitle}
                    onChange={(e) => setUpdateTitle(e.target.value)}
                    placeholder="Task Title"
                  />
                  <textarea
                    value={updateDesc}
                    onChange={(e) => setUpdateDesc(e.target.value)}
                    placeholder="Task Description"
                  />
                </div>
                <div className="popup-actions">
                  <button className="confirm-btn" onClick={updateTask}>
                    Save
                  </button>
                  <button className="cancel-btn" onClick={closePopup}>
                    Cancel
                  </button>
                </div>
              </>
            )}

            {popupType === "complete" && (
              <>
                <h3>Mark Task as Completed?</h3>
                <p>Do you want to complete this task?</p>
                <div className="popup-actions">
                  <button className="confirm-btn" onClick={completeTask}>
                    Yes
                  </button>
                  <button className="cancel-btn" onClick={closePopup}>
                    No
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
