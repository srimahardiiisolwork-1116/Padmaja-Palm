import React from "react";
import '../styles/contact.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import Mapsetup from "./Mapsetup";
import websiteData from "../jsons/website_details.js";


export default function Contact() {
  
  return (
    <div className="outter1"><br /><br />
      <h1>Contact</h1>
      {websiteData.Contact.Main.Numbers.map((number, index) => (
        <h3 key={index}>  
          <FontAwesomeIcon icon={faPhone} /> {number}
        </h3> 
      ))}
     <br />
      {websiteData.Contact.Main.Email.map((mail, index) => (
        <h3 key={index}>  
         <FontAwesomeIcon icon={faEnvelope}/> {mail}
        </h3> 
      ))}
      <br />
      <h5> <span className="ss">
         ADDRESS: 
        </span>
        {'\u00A0'} sy no. 294, Airport road Mamidpally, Balapur mandal Rangareddy dist. <br />
Landmark : Mamidpally to Jalpally Rd, Hyderabad, Telangana 500005.</h5>
      <h6>Nearby Rajiv Gandhi International Airport, And Nehru The Outer Ring Road is just a few minutes away.</h6>
    <div className="mapset1">
      <Mapsetup zooml={8} />
    </div>
    </div>
  );
}
