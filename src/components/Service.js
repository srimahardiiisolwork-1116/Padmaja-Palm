import React from "react";
import "../styles/service.css";
// import "../jsons/services.js";
// import {data} from "../jsons/services.js"
import website from "../jsons/website_details.js";

export default function Service() {
  
  return (
    <div className="mmm">
      <br />
        {/* <img src={imgbg} alt="" className="imgbg2" /> */}
          {
            Object.entries(website.Services).map(([type, data], sectionIndex) =>{
              if(sectionIndex % 2 !== 0){
                return(
                  <div className="maindiv" key={sectionIndex}>
                    <div className="text1">
                      <h3>{type}</h3>
                      <p>{data.matter}</p>
                    </div>
                    <div className="imgser">
                      <img src={data.image[0]} alt="" id="igsam"/>
                    </div>
                  </div>

                );
              }
              else{
                return(
                  <div className="maindivrev" key={sectionIndex}>
                    <div className="imgser">
                      <img src={data.image[0]} alt="" id="igsam"/>
                    </div>
                    <div className="text1">
                      <h3>{type}</h3>
                      <p>{data.matter}</p>
                    </div>
                  </div>
                );
              }

            })
          }
         
        <br />
    </div>
  );
}
