import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Style/Register.css";

export default function Register() {
  const navigate = useNavigate();

  useEffect(()=>{
      if(localStorage.getItem('login')){
        navigate('/')
      }
    })

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleRegister = async () => {
    // Frontend Validation
    if (!name || !email || !password) {
      setPopupMessage("All fields are required!");
      setIsError(true);
      setShowPopup(true);
      return;
    }

    if (name.length > 15) {
      setPopupMessage("Name must be max 15 characters!");
      setIsError(true);
      setShowPopup(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setPopupMessage("Enter a valid email address!");
      setIsError(true);
      setShowPopup(true);
      return;
    }

    if (password.length < 6) {
      setPopupMessage("Password must be at least 6 characters!");
      setIsError(true);
      setShowPopup(true);
      return;
    }

    try {
      // API call
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials:'include'
      });

      const data = await response.json();


      if (data.success) {
        setPopupMessage("✅ Registered Successfully!");
        setIsError(false);
        setShowPopup(true);

        document.cookie="token="+data.token;
        localStorage.setItem("login", email); // ✅ FIXED

        // Clear fields
        setName("");
        setEmail("");
        setPassword("");

        // Navigate to login after 2 sec
        setTimeout(() => navigate("/"), 2000);
      } else {
        setPopupMessage(data.message || "Registration failed!");
        setIsError(true);
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage("Something went wrong. Try again!");
      setIsError(true);
      setShowPopup(true);
      console.error(error);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>Register</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Register</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3 style={{ color: isError ? "red" : "green" }}>{popupMessage}</h3>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
