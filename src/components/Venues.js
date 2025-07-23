import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import "../styles/Carousel.css";
import Autoplay from "embla-carousel-autoplay";
import "../jsons/accomadation_pics.js";
import {
  gazebopics,
  parkingpics,
  poolpics,
} from "../jsons/accomadation_pics.js";
import { Banquet, lawn, lawn22, ph,conv,ext } from "../jsons/venues_pics";
export default function Venues() {
  const [emblaRef1] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef2] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef3] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef5] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef6] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef4] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef7] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef8] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  const [emblaRef9] = useEmblaCarousel({ loop: true }, [Autoplay()]);
  return (
    <div className="mainaccom">
      <br />
      <h3 className="headin">Venues</h3>
      <p className="tess">
        Our Lawns, Banquet Hall and Party Hall at Padmaja Palm Groves Resort
        Conventions showcase cutting-edge amenities. Our venues can host
        weddings, conference meetings, product launches, shootings, family
        get-togethers and parties for groups of 100 to 5000 people. You have
        come to the right place if you want to experience Indian culture in the
        most authentic way. We'll help you in turning your dreams into reality
        with a skilled group of experts. Everything will go according to your
        dreams from the moment you arrive until the moment you go.
      </p>
      const emblaRefs = [emblaRef2,];
      {/* Lawn 1  */}

      <div className="villa">
        <div className="villapics">
          <div className="embla" ref={emblaRef2}>
            <div className="embla__container">
              {lawn22.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="villades">
          <div className="text12 lawnn">
            <h3>Lawn 1</h3>
            <div className="tess">
              <b> Area: </b>Out Door <br />
              <b> Seating:</b> 3000+ <br />
              <b> Dimensions:</b> 614' X 114' <br />
              <b> Total Area:</b> 70,000 SFT <br />
            </div>
          </div>
        </div>
      </div>

      {/* lawn 2 */}
      <div className="villarev">
        <div className="villades">
          <div className="text12 lawnn">
            <h3>Lawn 2</h3>
            <div className="tess">
              <b> Area: </b>Out Door <br />
              <b> Seating:</b> 700+ <br />
              <b> Dimensions:</b> 192' X 232' <br />
              (including stage of 80' X 40')
              <br />
              <b> Total Area:</b> 41,664 SFT <br />
              {/* <div className="ameni">
                <b> Amenities:</b> <br />
              </div>
               */}
            </div>
          </div>
        </div>
        <div className="villapics">
          <div className="embla" ref={emblaRef6}>
            <div className="embla__container">
              {lawn.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* lawn 3 */}
      <div className="villa">
        <div className="villapics">
          <div className="embla" ref={emblaRef5}>
            <div className="embla__container">
              {parkingpics.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="villades">
          <div className="text12 lawnn">
            <h3>Lawn 3</h3>
            <div className="tess">
              <b> Area: </b>Out Door <br />
              <b> Seating:</b> 1200+ <br />
              <b> Dimensions:</b> 160' X 366' <br />
              <b> Total Area:</b> 58,000 SFT <br />
              {/* <div className="ameni">
                <b> Amenities:</b> <br />
              </div>
              <div className="lis">
                <div className="lis1">
                  <li>Fully Air Conditioned</li>
                </div>
                <div className="lis2">
                  <li>Two waiting halls </li>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      {/* banquet hall */}

      <div className="villarev">
        <div className="villades">
          <div className="text12">
            <h3>Banquet Halls</h3>
            <div className="tess">
              <b> Area: </b>Indoor <br />
              <b> Seating:</b> 400+ <br />
              <b> Dimensions:</b> 166' X 38'5" X 12' <br />
              <b> Total Area:</b> 6,391 SFT <br />
              <br />
              <div className="ameni1">
                <b> Amenities:</b> <br />
              </div>
              <div className="lis">
                <div className="lis1">
                  <li>Fully Air Conditioned</li>
                  <li>Store Room</li>
                </div>
                <div className="lis2">
                  <li>Two waiting halls </li>
                  <li>Two Green rooms </li>
                </div>
              </div>
              <br />
              
            </div>
          </div>
        </div>
        <div className="villapics">
          <div className="embla" ref={emblaRef1}>
            <div className="embla__container">
              {Banquet.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* party hall */}
      <div className="villa">
        <div className="villapics">
          <div className="embla" ref={emblaRef3}>
            <div className="embla__container">
              {ph.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="villades">
          <div className="text12">
            <h3>Party Hall</h3>
            <div className="tess">
              <b> Area: </b>Indoor <br />
              <b> Seating:</b> 100+ <br />
              <b> Total Area:</b> 3,550 SFT <br />
              <div className="ameni">
                <b> Amenities:</b> <br />
              </div>
              <div className="lis">
                <div className="lis1">
                  <li>Fully Air Conditioned</li>
                </div>
                <div className="lis2">
                  <li>Music System </li>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* pool */}

      <div className="villarev">
        <div className="villades">
          <div className="text12 lawnn">
            <h3>Pool</h3>
            <div className="tess">
              <b> Seating:</b> 100+ <br />
              <b> Total Area:</b> 6,300 SFT <br />
              <b> No of Pools:</b> 2 <br />
             
            </div>
          </div>
        </div>
        <div className="villapics">
          <div className="embla" ref={emblaRef4}>
            <div className="embla__container">
              {poolpics.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* gazebo */}
      <div className="villa">
        <div className="villapics">
          <div className="embla" ref={emblaRef7}>
            <div className="embla__container">
              {gazebopics.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="villades">
          <div className="text12 lawnn">
            <h3>Gazebo</h3>
            <div className="tess">
              <b> Area: </b>Outdoor <br />
              <b> Seating:</b> 100+ <br />
              <b> Dimensions:</b> 100' X 50' <br />
              <b> Total Area:</b> 5000 SFT <br />
              
            </div>
          </div>
        </div>
      </div>
      {/* Banquet Extention */}
       <div className="villarev">
        <div className="villades">
          <div className="text12 lawnn">
            <h3>Banquet Extention</h3>
             <div className="tess">
              <b> Area: </b>Indoor (Non-AC)<br />
              <b> Dimensions:</b> 155 x 34.4 x 22 <br />
              <b> Total Area:</b> 5332 <br />
              
            </div>
          </div>
        </div>
        <div className="villapics">
          <div className="embla" ref={emblaRef8}>
            <div className="embla__container">
              {ext.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Convention */}
         <div className="villa">
        <div className="villapics">
          <div className="embla" ref={emblaRef9}>
            <div className="embla__container">
              {conv.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img src={item} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="villades">
          <div className="text12 lawnn">
            <h3>Convention</h3>
            <p
                style={{
                  color: "red",
                  padding: 0,
                  paddingBottom: 0,
                 
                }}
              >
                (Under Construction)
              </p>
          </div>
        </div>
      </div>

      <br />
    </div>
  );
}
