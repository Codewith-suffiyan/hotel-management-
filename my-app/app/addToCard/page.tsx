"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Client, Databases, Account, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68ca637200075ab30b2e")

const account = new Account(client);

const databases = new Databases(client);



// const sampleFavorites = [
//   {
//     id: 1,
//     hotel_name: "Grand Palace Hotel",
//     location: "New York, USA",
//     price: 250,
//     image: "/pexel.jpg"
//   },
//   {
//     id: 2,
//     hotel_name: "Sea View Resort",
//     location: "Maldives",
//     price: 300,
//     image: "/pexel.jpg"
//   },
//   {
//     id: 3,
//     hotel_name: "Mountain Retreat",
//     location: "Switzerland",
//     price: 180,
//     image: "/pexel.jpg"
//   }
// ];

export default function AddToCardUI() {

  const [loading, setLoading] = useState(false)
  const [favorites, setFavorites] = useState<any[]>([])
  const [user, setUser] = useState<any>(null);


  useEffect(() => {
    const getUser = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser)
        console.log("User successfully Login")
      } catch (error) {
        console.log("Don't have any User Please Login:")
      }
    };

    getUser()

  }, [])


  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      try {
        setLoading(true)

        const response = await databases.listDocuments(
          "68ca647a0039e60720a4",
          "favhotel",
          [Query.equal("user_Id", user.$id)]
        )

        setFavorites(response.documents)
        console.log("Favorites", response.documents)

      } catch (error) {
        console.log("error fetching favorites", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()

  }, [user]);


  const removeFavorite = async (hotelId: string) => {
    try {
      setLoading(true)

      await databases.deleteDocument(
        "68ca647a0039e60720a4",
        "favhotel",
        hotelId
      );

      setFavorites(prev => prev.filter(h => h.$id !== hotelId))

    } catch (error) {
      console.log("User Successfully Removing", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Favorite Hotels</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((hotel) => (
            <div key={hotel.$id} className="border rounded-lg shadow-md overflow-hidden hover:shadow-xl transition relative">
              <img
                src={hotel.image}
                alt={hotel.hotel_name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{hotel.hotel_name}</h2>
                <p className="text-gray-600">{hotel.location}</p>
                <p className="text-blue-700 font-bold mt-2">${hotel.price} / night</p>
              </div>

              {/* Remove Button Placeholder */}
              <button onClick={() => removeFavorite(hotel.$id)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
