import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Office from "./components/Office";
import CorporateRegistration from "./components/CorporateRegistration";
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/office" element={<Office />} />
          <Route path="/corporate" element={<CorporateRegistration />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;