'use client'
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import HotelCard from "./components/HotelCard";
import { Client, Databases } from "appwrite";

// Two Man Points.
// client ko hamsha global scope banana chaiye because agr hum function ky ander likhty ha to hamara client har render per again and again banta rehta ha or isy hamry server per load ziyada ata ha or server slow hota that's it. 
// or jab hum client ko global scope banaty ha to ek hee client banega or sary componentes usko Reuse kaerngy or server per load bhi nh hoga or ziyada fast or clean hoga understand.
const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68ca637200075ab30b2e");

const databases = new Databases(client);


export default function Home() {
  const [rooms, setRooms] = useState([]);

  // const client = new Client()
  //   .setEndpoint("https://fra.cloud.appwrite.io/v1")
  //   .setProject("68ca637200075ab30b2e");

  // const databases = new Databases(client);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await databases.listDocuments(
          "68ca647a0039e60720a4",
          "rooms"
        );
        setRooms(response.documents);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container flex flex-wrap -m-2">
        {rooms.map((room) => (
          <HotelCard
            id={room.$id}
            key={room.$id}
            image={room.image}
            title={room.title}
            description={room.description}
            price={room.price_per_night}
            bedrooms={room.bed_rooms}
            washrooms={room.washrooms}
            guests={room.guest}
            location={room.location}
            hotelName={room.hotel_name}
            availbility={room.availbility}
            amenities={room.amenities}
          />
        ))}
      </div>
    </>
  );
}
