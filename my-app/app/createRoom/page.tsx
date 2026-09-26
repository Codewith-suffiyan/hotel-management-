"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Client, Databases, ID, Account } from "appwrite";

const Page = () => {
    // States for form fields
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [bedRooms, setBedRooms] = useState(2);
    const [washrooms, setWashrooms] = useState(1);
    const [guest, setGuest] = useState(3);
    const [availbility, setAvailbility] = useState("");
    const [location, setLocation] = useState("");
    const [pricePerNight, setPricePerNight] = useState<number | "">("");
    const [hotelName, setHotelName] = useState("");
    const [amenities, setAmenities] = useState("");


    // Appwrite client
    const client = new Client()
        .setEndpoint("https://fra.cloud.appwrite.io/v1")
        .setProject("68ca637200075ab30b2e");

    const databases = new Databases(client);
    const account = new Account(client);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // ✅ Get current logged-in user
            const user = await account.get();

            // ✅ Save room with user_id
            const response = await databases.createDocument(
                "68ca647a0039e60720a4", // Database ID
                "rooms", // Collection ID
                ID.unique(),
                {
                    user_id: user.$id,  // required
                    hotel_name: hotelName,
                    description,
                    location,
                    availbility,
                    price_per_night: pricePerNight,
                    image,
                    title,
                    bed_rooms: bedRooms,
                    guest,
                    washrooms,
                    amenities,
                }
            );

            console.log("Room Created:", response);
            alert("Room created successfully");
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating room, check console.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                    {/* Image URL */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Image URL</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Enter image URL"
                        />
                    </div>

                    {/* Title */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Title</label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Title"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Description</label>
                        <textarea
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Short summary..."
                            required
                        />
                    </div>

                    {/* Bed Rooms */}
                    <p className="text-sm font-medium text-gray-700 mb-1">Bed Rooms</p>
                    <div className="relative flex items-center mb-4">
                        <button
                            type="button"
                            onClick={() => setBedRooms((prev) => (prev > 1 ? prev - 1 : prev))}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11"
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={bedRooms}
                            readOnly
                            className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setBedRooms((prev) => prev + 1)}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11"
                        >
                            +
                        </button>
                    </div>

                    {/* Wash Rooms */}
                    <p className="text-sm font-medium text-gray-700 mb-1">Wash Rooms</p>
                    <div className="relative flex items-center mb-4">
                        <button
                            type="button"
                            onClick={() => setWashrooms((prev) => (prev > 1 ? prev - 1 : prev))}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11"
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={washrooms}
                            readOnly
                            className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setWashrooms((prev) => prev + 1)}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11"
                        >
                            +
                        </button>
                    </div>

                    {/* Guests */}
                    <p className="text-sm font-medium text-gray-700 mb-1">Guests</p>
                    <div className="relative flex items-center mb-4">
                        <button
                            type="button"
                            onClick={() => setGuest((prev) => (prev > 1 ? prev - 1 : prev))}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11"
                        >
                            -
                        </button>
                        <input
                            type="text"
                            value={guest}
                            readOnly
                            className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm block w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setGuest((prev) => prev + 1)}
                            className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11"
                        >
                            +
                        </button>
                    </div>

                    {/* Availability */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Availability</label>
                        <input
                            value={availbility}
                            onChange={(e) => setAvailbility(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Availability"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Amenities</label>
                        <input
                            type="text"
                            placeholder="Free WiFi, Parking, Food, Swimming Pool"
                            value={amenities}
                            onChange={(e) => setAmenities(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>


                    {/* Location */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Location</label>
                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Location"
                            required
                        />
                    </div>

                    {/* Price per Night */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Price per Night</label>
                        <input
                            type="number"
                            value={pricePerNight}
                            onChange={(e) => setPricePerNight(Number(e.target.value))}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Enter price per night"
                            required
                        />
                    </div>

                    {/* Hotel Name */}
                    <div className="mb-5">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Hotel Name</label>
                        <input
                            value={hotelName}
                            onChange={(e) => setHotelName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Hotel Name"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="m-3 text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        Create Room
                    </button>
                </form>
            </div>
        </>
    );
};

export default Page;
