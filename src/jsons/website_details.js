import { rooms, villa,rooms2,exerooms} from "../jsons/accomadation_pics.js";
import {villa_details,villa_amenities,proom_details,proom_amenities,sroom_details,sroom_amenities,exeroom_details,exeroom_amenities} from "../jsons/accomadation_details.js";
import img2 from "../asserts/resortpics/2.jpg"
import img3 from "../asserts/resortpics/4.jpg"
import img4 from "../asserts/resortpics/3.jpg"
import img5 from "../asserts/resortpics/security.jpg"
import img6 from "../asserts/resortpics/8.jpg"
import img7 from "../asserts/resortpics/kitchen/1.JPG"
import img8 from "../asserts/resortpics/6.jpg"
import {
  gazebopics,
  parkingpics,
  poolpics,
} from "../jsons/accomadation_pics.js";
import { Banquet, lawn, lawn22, ph,conv,ext } from "../jsons/venues_pics";

const websiteData =
{
  "Accomodations":{
    "Padmaja Grand Villa":{
        "images":villa,
        "details":villa_details,
        "Amenities":villa_amenities
    },
    "Premium Rooms":
    {
        "images":rooms,
        "details":proom_details,
        "Amenities":proom_amenities   
    },
    "Superior Rooms":
    {
        "images":rooms2,
        "details":sroom_details,
        "Amenities":sroom_amenities   
    },
    "Executive Rooms":
    {
        "images":exerooms,
        "details":exeroom_details,
        "Amenities":exeroom_amenities   
    }

  },
  "Services":{
    "Destination Weddings" :{
      "matter": "Indian weddings are traditionally multi-day affairs and involve many intricate ceremonies of sangeet, mehndi, cocktail parties, receptions and the marriage itself. We have the space to ensure that every wedding is memorable and that each moment is cherished. We also assign a dedicated event coordinator to assist and take care of all your wedding requirements, as well as a truly hospitable team committed to making it a rich experience.",
      "image": [img2]
    },
    "CORPORATE":{
      "matter": "Modern corporate meeting rooms in hotels, lavish banquet halls, and conference sites with lodging are all offered by us. We have hotels with function rooms, corporate meeting facilities, and venues for business meetings to suit your demands. Whether you need them for high-profile meetings or seminars that call for flawless corporate meeting venues or for product launches and promotions.",
      "image": [img3]
    },
    "Parties/ Photo Shoots":{
      "matter": "We welcome everyone who wants to gather with loved ones to celebrate any occasion. We provide you with the ideal location, whether it be for birthday celebrations, yearly events, or shootings.",
      "image": [img4]
    },
     "Safety and Security ":{
      "matter": "24x7 surveillance safety system",
      "image": [img5]
    },
    "Kitchens ":{
      "matter": "We provide the best ingredients, time-honoured methods, and modern flair, and we celebrate all types of food. We have professional chefs, and their passion is to produce the best modern dishes. Our food is a culinary fusion of signature dishes and exclusive selections made as per your dreams.",
      "image": [img7]
    },
    "Event management": {
      "matter": "We provide end-to-end solutions for all events and specialise in customising your ideas with the goal of creating unforgettable memories.",
      "image": [img6]
    },
    "Décor ":{
      "matter": "We are here to transform your dreams into design. ",
      "image": [img8]
    }
  },
  "Venues":{
    "Lawn 1":{
        "warning":"",
        "images":villa,
        "details":villa_details,
        "Amenities":villa_amenities
    },
    "Lawn 2":
    {
        "warning":"",
        "images":rooms,
        "details":proom_details,
        "Amenities":proom_amenities   
    },
    "Lawn 3":
    {
        "warning":"",
        "images":rooms2,
        "details":sroom_details,
        "Amenities":sroom_amenities   
    },
    "Banquet Hall":
    {
        "warning":"",
        "images":Banquet,
        "details":exeroom_details,
        "Amenities":exeroom_amenities   
    }

  },
  "Contact":
  {
    "Main":
    {
      "Numbers":["+919989565333","+919676867666"],
      "Email":["padmajapalms@gmail.com"]
    }
  }

};

export default websiteData;