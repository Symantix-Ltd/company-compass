"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function UKPostcodeMap({ postcode }) {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postcode) return;

    const fetchCoords = async () => {
      setLoading(true);
      try {
        let url = "";
        

        // Full postcode (e.g., SW1A 1AA)
        if (/^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i.test(postcode)) {
          url = `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`;
         
          const res = await fetch(url);
          const data = await res.json();
          if (data.status === 200) {
            setCoords([data.result.latitude, data.result.longitude]);
            setError(null);
          } else {
            setCoords(null);
            setError("Postcode not found");
          }
        } else {
          // Partial postcode (e.g., SW1A)
          url = `https://api.postcodes.io/postcodes?q=${encodeURIComponent(postcode)}`;

         
          const res = await fetch(url);
          const data = await res.json();
          if (data.status === 200 && data.result.length > 0) {
            // Take the first matching result
            setCoords([data.result[0].latitude, data.result[0].longitude]);
            setError(null);
          } else {
            setCoords(null);
            setError("Postcode not found");
          }
        }
      } catch (err) {
        setCoords(null);
        setError("Error fetching location");
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [postcode]);

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer center={coords} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={coords}>
          <Popup>{postcode}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
