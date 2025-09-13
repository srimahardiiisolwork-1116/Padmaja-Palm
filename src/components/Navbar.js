import React from "react";
import "../styles/navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRef } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from '../asserts/Landscape without bg.png';
//import logo1 from '../asserts/Landscape without bg.png'

export default function Navbar() {
  const navref = useRef();
  const showNavbar = () => {
    navref.current.classList.toggle("responsive_nav");
    window.scrollTo(0,0);
  };
  const [color, setcolor] = useState("rgba(255, 255, 255, 0.6)");
  function setscroll() {
    if (window.scrollY >= 10) {
      setcolor("white");
    } else {
      setcolor("rgba(255, 255, 255, 0.6)");
    }
  }
  const scrolltop = () =>{
    window.scrollTo(0,0);
  }
  window.addEventListener("scroll", setscroll);
  return (
    <div className="navvv">
      <header style={{ background: color}}>
        <NavLink onClick={scrolltop} to="/">
      <img src={logo} alt="" className="img1" />
        </NavLink>
        <nav ref={navref}>
          <NavLink onClick={showNavbar} to="/">Home</NavLink>
          {/* <NavLink onClick={showNavbar} to="about">About</NavLink> */}
          <NavLink onClick={showNavbar} to="service">Services</NavLink>
          <NavLink onClick={showNavbar} to="accommodation">Accommodation</NavLink>
          <NavLink onClick={showNavbar} to="venues">Venues</NavLink>
          <NavLink onClick={showNavbar} to="gallery">Gallery</NavLink>
          <NavLink onClick={showNavbar} to="events">Events</NavLink>
          <NavLink onClick={showNavbar} to="contact">Contact us</NavLink>
          <button className="navbtn navclsbtn" onClick={showNavbar} >
            <FaTimes />
          </button>
        </nav>
        <button className="navbtn" onClick={ showNavbar}>
          <FaBars />
        </button>
      </header>
    </div>
  );
}
