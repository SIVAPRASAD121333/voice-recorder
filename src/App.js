import React from "react";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Footer from "./Footer.js";
import AudioRecorder from "./AudioRecorder.js";
import "./App.css"; // Assuming you have an App.css file for global styles
import image from "./logoiiits.png"

function App() {
  return (
    <div>
      <header>
        <div style={{ display: "flex", alignItems: "center", textAlign: "center", paddingLeft: "300px" }}>
          {/* Example logo image; replace 'logoSrc' with your actual logo path */}
          <img
            src={image}
            alt="IIIT Sricity Logo"
            style={{ marginRight: "10px", height: "100px" }}
          />
          <h1 style={{ textAlign: "center",color:"#eb7434" }}>
            
          Indian Institute of Information Technology, Sri City, Chittoor
          <br></br>
          <span style={{ color: "Black" , fontWeight: "bold" ,fontSize:"25px"}}>
          (An Institute of National Importance under an Act of Parliament)
          </span>
          
  
          </h1>
        </div>
        <Navbar />
      </header>
      <MainContent />
      <h2 style={{ textAlign: "center" }}> Record or Select an Audio File </h2>
      <AudioRecorder />
      <Footer />
    </div>
  );
}

export default App;
