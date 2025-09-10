// components/companyAddress.js


//export const revalidate = 86400;

"use client";
import React from "react";
import { useState, useEffect } from "react";
import { MapPinIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { MapPinIcon as MapPinSolid} from "@heroicons/react/24/solid";

//import PostcodeMap from './PostcodeMap';


export default function CompanyAddress({ data }) {
  
  if (!data) return null;

  
   const RegAddress_AddressLine1 = data.registered_office_address.address_line_1;
   const RegAddress_PostTown = data.registered_office_address.locality;
   const RegAddress_PostCode = data.registered_office_address.postal_code;
   const CountryOfOrigin = data.registered_office_address.country;
  const postcodeLink =  RegAddress_PostCode ? `/explorer/postcode/${RegAddress_PostCode.replace(
    /\s+/g,
    "-"
  ).toLowerCase()}` : "";


  
  const mapWidth = 150;
  const mapHeight = 233;
  const postcode = RegAddress_PostCode;

  const [pinStyle, setPinStyle] = useState({ left: "0px", top: "0px" });

  useEffect(() => {
    if (!postcode) return;
  
    fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`, { next: { revalidate: 86400 }})
      .then(res => res.json())
      .then(resData => {
        if (resData.status === 200 && resData.result) {
          const { latitude, longitude } = resData.result;

          
          const { x, y } = latLonToPixel(latitude, longitude, mapWidth, mapHeight);
  
          setPinStyle({
            left: `${x - 5}px`,
            top: `${y + 15}px`
          });
        } else {
          console.warn("Postcode API returned no result for:", postcode, resData);
        }
      })
      .catch(err => {
        console.error("Error fetching postcode data:", err);
      });
  }, [postcode]);
  

  function latLonToPixel(lat, lon, mapWidth, mapHeight) {
    const minLat = 49.9, maxLat = 59.4;
    const minLon = -8.2, maxLon = 1.8;

    const x = ((lon - minLon) / (maxLon - minLon)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;

    return { x, y };
  }
  

  return (
    
    <div className="grid grid-cols-[min-content_auto] gap-x-4 gap-y-2">
 <div></div>
      <div>
        <div className="uk-map" style={{ position: "relative" }}>
          <img
            style={{ width: mapWidth, height: mapHeight, position: "relative" }}
            src="/shokunin_United_Kingdom_map.svg"
          />
          <div className="_pin" style={{ position: "absolute", ...pinStyle }}>
            <div style={{ position: "relative" }}>
              <MapPinSolid
                className="size-6 text-orange-500"
                style={{ left: "-16px", top: "-31px", position: "absolute" }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="whitespace-nowrap">
      <MapPinIcon className="size-6 text-blue-500"/>
      </div>
      <div className="text-left">
      <p className="">Address</p>

        {RegAddress_AddressLine1}
        <br />
        {RegAddress_PostTown}
        <br />
        {RegAddress_PostCode}
        <br />
        {CountryOfOrigin}
      
       

      </div>

      <div><InformationCircleIcon className="size-6 text-blue-500"/></div>
      

          <div>
            
            <a style={{ lineHeight: "16px" }} href={postcodeLink}>
              View Companies in {RegAddress_PostCode}
            </a>
           
          </div>

         
        </div>
     
  );
}
