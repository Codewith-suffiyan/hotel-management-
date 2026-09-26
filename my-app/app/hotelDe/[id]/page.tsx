"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useParams, useRouter } from "next/navigation";
import { Client, Databases, Account, ID } from "appwrite";

// Two Man Points.
// client ko hamsha global scope banana chaiye because agr hum function ky ander likhty ha to hamara client har render per again and again banta rehta ha or isy hamry server per load ziyada ata ha or server slow hota that's it. 
// correct: or jab hum client ko global scope banaty ha to ek hee client banega or sary componentes usko Reuse kaerngy or server per load bhi nh hoga or ziyada fast or clean hoga understand.

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // ✅ tumhara endpoint
  .setProject("68ca637200075ab30b2e"); // ✅ tumhara projectId

const account = new Account(client)

const databases = new Databases(client);

const Page = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (id) {
      const fetchHotel = async () => {
        try {
          const res = await databases.getDocument(
            "68ca647a0039e60720a4", // ✅ databaseId
            "rooms", // ✅ collectionId
            id as string
          );
          setHotel(res);
        } catch (err) {
          console.error("Error fetching hotel:", err);
        }
      };
      fetchHotel();
    }
  }, [id]);

  const addToCard = async () =>  {
    try{
      if(!hotel) return

      setLoading(true)

      const user = await account.get()
      // console.log(user)

      await databases.createDocument(
        "68ca647a0039e60720a4",
        "favhotel",
        ID.unique(),
        {
          user_Id: user.$id,               
          hotel_Id: hotel.$id,
          hotel_name: hotel.title,
          image: hotel.image,
          location: hotel.location,
          price: hotel.price_per_night,
        }
      )

      router.push("/addToCard")
      }catch (error: any){
        console.error("Add to favourite error:", error)
      
        if (error.code === 401) {
          router.push("/login");
        }
    }finally{
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* 🖼 Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <img
            src={hotel?.image || "/pexel.jpg"}
            alt={hotel?.title || "Hotel"}
            className="w-full h-80 object-cover rounded-lg shadow"
          />
          <div className="grid grid-cols-2 gap-2">
            <img src={hotel?.image || "/pexel.jpg"} className="w-full h-40 object-cover rounded-lg shadow" />
            <img src={hotel?.image || "/pexel.jpg"} className="w-full h-40 object-cover rounded-lg shadow" />
            <img src={hotel?.image || "/pexel.jpg"} className="w-full h-40 object-cover rounded-lg shadow" />
            <img src={hotel?.image || "/pexel.jpg"} className="w-full h-40 object-cover rounded-lg shadow" />
          </div>
        </div>

        {/* 🏨 Hotel Info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hotel?.title}
          </h1>
          <p className="text-gray-600 mb-4">
            📍 {hotel?.location}
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            {hotel?.description}
          </p>

          {/* ℹ️ Extra Hotel Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-700 mb-6">
            <p>🏨 Hotel: <span className="font-medium">{hotel?.hotel_name}</span></p>
            <p>🛏 Bedrooms: <span className="font-medium">{hotel?.bed_rooms}</span></p>
            <p>🚿 Washrooms: <span className="font-medium">{hotel?.washrooms}</span></p>
            <p>👥 Guests: <span className="font-medium">{hotel?.guest}</span></p>
            <p>📅 Availability: <span className="font-medium">{hotel?.availbility}</span></p>
          </div>

          {/* ✅ Amenities */}
          <h2 className="text-lg font-semibold mb-2">Amenities</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm text-gray-700">
            {hotel?.amenities
              ? hotel.amenities.split(",").map((a: string, i: number) => (
                <p key={i}>✔ {a.trim()}</p>
              ))
              : <p>No amenities listed</p>}
          </div>

          {/* 💰 Price & Booking */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-2xl font-bold text-blue-700">
              ${hotel?.price_per_night} / night
            </p>
            <div className="flex gap-4">
            <button 
              onClick={addToCard}
              disabled={loading}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
              >
              {loading ? "Adding..." : "Favorite Hotel ❤️"}
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800">
              Like 👍
            </button>
            <button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-700">
               Dislike 👎
            </button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;


