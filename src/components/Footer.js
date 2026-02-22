import React from "react";
import "../styles/Footer.css";
import imglogo from "../asserts/Landscape without bg.png";
import { NavLink } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Mapsetup from "./Mapsetup";
import websiteData from "../jsons/website_details.js";

export default function Footer() {
  const scrolltopp = () => {
    window.scrollTo(0,0);
  }
  
  return (
    <div className="footer">
      <div className="foot">
        <div className="comp1">
          <div className="map">
            <Mapsetup zooml={14} />
             </div>
        </div>
        <div className="comp2">
          <div className="contact">
           <h4>
            Contact us
            </h4> 
            <p>
              sy no 294, airport road mamidpally, balapur mandal rangareddy dist.<br/>
            landmark : mamidpally to Jalpally Rd, Hyderabad, Telangana 500005
              </p>
          </div>
          <div className="call">
            <br />
            <h4>
            Call
            </h4>
           
             {websiteData.Contact.Main.Numbers.map((number, index) => (
                  <p key ={index}>{number}</p>
              ))}
  
            </div>
        </div>
        <div className="comp3">
          <div className="navs">
            <NavLink to="/" className="nvlns" onClick={scrolltopp}>
              Home
            </NavLink>
            {/* <NavLink to="about" className="nvlns"  onClick={scrolltopp}>
              About
            </NavLink> */}
            <NavLink to="service" className="nvlns"  onClick={scrolltopp}>
              Services and Facilities
            </NavLink>
            <NavLink to="accommodation" className="nvlns"  onClick={scrolltopp}>
            Accommodation
            </NavLink>
            <NavLink to="venues" className="nvlns"  onClick={scrolltopp}>
              Venues
            </NavLink>
            <NavLink to="gallery" className="nvlns"  onClick={scrolltopp}>
              Gallery
            </NavLink>
            <NavLink to="contact" className="nvlns"  onClick={scrolltopp}>
              Contact us
            </NavLink>
          </div>
        </div>
        <div className="comp4">
          <img src={imglogo} alt="" className="imglo" />
          <div>
            <button className="icons">
              <FaFacebook size={25} />
            </button>
            <button className="icons">
              <FaInstagram size={25} />
            </button>
            <button className="icons">
              <FaTwitter size={25}/>
            </button>
          </div>
        </div>
      </div>
      <div className="line" />
      <div className="copyright">
        <p>Copyright © PADMAJA PALM GROVES. All rights reserved.</p>
        <p className="sri-mahardii-link">
          Developed by <a href="https://www.srimahardiiisol.com/" target="_blank" rel="noopener noreferrer">Sri Mahardii Sol Private Limited</a>
        </p>
      </div>
    </div>
  );
}