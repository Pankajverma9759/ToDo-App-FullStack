import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/profile.css";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  // 🔹 Fetch profile
  useEffect(() => {
    axios
      .get("http://localhost:5000/profile", { withCredentials: true })
      .then((res) => {
        setProfile(res.data.data);
        setForm({
          email: res.data.data.email,
          password: "",
        });
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  // 🔹 Logout
  const logout = async () => {
    await axios.post(
      "http://localhost:5000/logout",
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("login");
    navigate("/login", { replace: true });
  };

  // 🔹 Update profile
  const updateProfile = async () => {
    await axios.patch(
      "http://localhost:5000/profile",
      form,
      { withCredentials: true }
    );

    alert("Profile Updated");
    setProfile({ ...profile, email: form.email });
    setShowPopup(false);
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>

      <p><b>Email:</b> {profile.email}</p>

      <div className="btn-group">
        <button onClick={() => setShowPopup(true)}>Edit Profile</button>
        <button className="logout" onClick={logout}>Logout</button>
      </div>

      {/* 🔥 Popup Modal */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Profile</h3>

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="New Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <div className="btn-group">
              <button onClick={updateProfile}>Update</button>
              <button
                className="cancel"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
