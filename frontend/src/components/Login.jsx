import React, { useEffect, useState } from "react";
import "../Style/Login.css";
import { Link ,useNavigate}  from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('login')){
      navigate('/')
    }
  })

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setPopupMessage("All fields are required!");
      setIsError(true);
      setShowPopup(true);
      return;
    } else if (!validateEmail(email)) {
      setPopupMessage("Invalid email format!");
      setIsError(true);
      setShowPopup(true);
      return;
    } else if (password.length < 6) {
      setPopupMessage("Password must be at least 6 characters!");
      setIsError(true);
      setShowPopup(true);
      return;
    }

    // Call API
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials:'include'
      });

      const data = await response.json();

     

      if (response.ok) {
        setPopupMessage("Login Successful ✅");
        setIsError(false);
        setShowPopup(true);

        // Optional: save token if backend provides JWT
        if (data.token) {
          localStorage.setItem("token", data.token);
           document.cookie = "token=" + data.token;
        } 

          localStorage.setItem("login", email); // ✅ FIXED
          window.dispatchEvent(new Event('localStorage-change'))
 

        
        // Navigate to login after 2 sec
        setTimeout(() => navigate("/"), 2000);


        // Reset form
        setEmail("");
        setPassword("");
      } else {
        // Show error from API
        setPopupMessage(data.message || "Login Failed ❌");
        setIsError(true);
        setShowPopup(true);
      }
    } catch (error) {
      setPopupMessage("Server Error! Try again later.");
      setIsError(true);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
          <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-box ${isError ? "error" : "success"}`}>
            <p>{popupMessage}</p>
            <button onClick={() => setShowPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
}
