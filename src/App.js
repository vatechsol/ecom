import React from "react";
import "./App.css";
import Login from "./pages/login";
import Signup from "./pages/signup";
import DashBoard from "./pages/dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<DashBoard />} />
        </Routes>
      </Router>
    </div>
  );
}


export default App;
