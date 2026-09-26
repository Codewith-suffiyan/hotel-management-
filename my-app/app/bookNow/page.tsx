"use client";
import React, { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import { Client, Databases, Account, ID } from "appwrite";
import { useSearchParams } from "next/navigation";

export default function BookNowPage() {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [rooms, setRooms] = useState(1);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [hotel, setHotel] = useState<any>(null);
    const [ch, setCh] = useState(1)

    const cha = () => {
        setCh(2)
        console.log(setCh)
    }

    // ✅ Get hotelId from URL
    const searchParams = useSearchParams();
    const hotelId = searchParams.get("hotelId");

    // ✅ Appwrite setup
    const client = new Client()
        .setEndpoint("https://cloud.appwrite.io/v1")
        .setProject("68ca637200075ab30b2e");

    const databases = new Databases(client);
    const account = new Account(client);
    const databaseId = "68ca647a0039e60720a4";
    const roomsCollection = "rooms"; // ✅ rooms collection
    const bookingCollection = "booking";

    // ✅ Fetch hotel data by ID
    useEffect(() => {
        const fetchHotel = async () => {
            if (!hotelId) return;
            try {
                const res = await databases.getDocument(databaseId, roomsCollection, hotelId);
                setHotel(res);
            } catch (error) {
                console.error("Error fetching hotel:", error);
            }
        };
        fetchHotel();
    }, [hotelId]);

    // 🧮 Calculate total nights
    const nights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        const diff = Math.ceil((outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    }, [checkIn, checkOut]);

    // 💵 Price from room data
    // 💵 Price (from hotel or fallback)
    const pricePerNight = hotel?.price_per_night || 120;
    const total = pricePerNight * nights * rooms;

    // 📥 Handle booking
    const handleBooking = async () => {
        const user = await account.get()
        if (!checkIn || !checkOut || !name || !email || !phone) {
            setMessage("⚠️ Please fill all required fields.");
            return;
        }

        if (!hotelId) {
            setMessage("⚠️ Hotel ID not found in URL.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const bookingId = ID.unique();

            await databases.createDocument(databaseId, bookingCollection, bookingId, {
                bookingId: bookingId,
                userId: user.$id,
                roomId: hotelId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                status: "pending",
                totalPrice: total,
                name,
                email,
                phoneNumber: phone,
                // notes,
                guests,
                rooms,
            });

            setMessage("✅ Booking confirmed successfully!");
            setCheckIn("");
            setCheckOut("");
            setGuests(1);
            setRooms(1);
            setName("");
            setEmail("");
            setPhone("");
            setNotes("");
        } catch (error) {
            console.error(error);
            setMessage("❌ Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT SIDE */}
                        <div className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-2xl shadow-xl p-8">
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Book Your Stay</h2>
                            <p className="text-gray-500 mb-6">
                                {hotel ? hotel.title : "Loading room details..."}
                            </p>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check In</label>
                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                        className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check Out</label>
                                    <input
                                        type="date"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                        className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Nights */}
                            <div className="flex items-center justify-between bg-blue-100/70 border border-blue-300 rounded-lg p-3 text-blue-800 mb-5">
                                <span className="font-medium">Total Nights</span>
                                <span className="text-lg font-semibold">
                                    {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "—"}
                                </span>
                            </div>

                            {/* Guests / Rooms */}
                            <div className="grid grid-cols-2 gap-4 mb-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={guests}
                                        onChange={(e) => setGuests(Number(e.target.value))}
                                        className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rooms</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={rooms}
                                        onChange={(e) => setRooms(Number(e.target.value))}
                                        className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                    />
                                </div>
                            </div>

                            <hr className="my-5" />

                            {/* Guest Info */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">Guest Details</h3>
                            <div className="space-y-3 mb-5">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            <textarea
                                rows={3}
                                placeholder="Special Requests (Optional)"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2.5 w-full text-sm focus:ring-2 focus:ring-blue-400 outline-none mb-5"
                            />

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Nights: <span className="font-medium">{nights}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Rooms: <span className="font-medium">{rooms}</span>
                                    </p>
                                    <p className="text-lg font-semibold text-blue-700 mt-1">
                                        Total: ${total}
                                    </p>
                                </div>
                                <button
                                    onClick={handleBooking}
                                    disabled={loading}
                                    className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg font-semibold shadow-lg transition disabled:opacity-50"
                                >
                                    {loading ? "Booking..." : "Confirm Booking"}
                                </button>
                            </div>

                            {message && (
                                <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
                            )}
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="backdrop-blur-md bg-white/70 border border-gray-200 rounded-2xl shadow-xl p-8 h-fit">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Hotel Booking</h3>
                            <img
                                src={hotel?.image || "/pexel.jpg"}
                                alt="Hotel"
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <p className="font-semibold text-gray-800">{hotel?.title || "Loading..."}</p>
                            <p className="text-gray-500 text-sm mb-4">
                                📍 {hotel?.location || "Location not available"}
                            </p>

                            <div className="text-sm text-gray-600 space-y-1 mb-4">
                                <p>Guests: {hotel?.guest || guests}</p>
                                <p>Bedrooms: {hotel?.bed_rooms || rooms}</p>
                                <p>Nights: {nights}</p>
                            </div>


                            <div className="border-t pt-3">
                                <div className="flex justify-between text-sm text-gray-700 mb-1">
                                    <span>
                                        ${pricePerNight} × {nights} nights
                                    </span>
                                    <span>${pricePerNight * nights}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-blue-700">
                                    <span>Total</span>
                                    <span>${total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 onClick={cha}>{ch}</h3>
        </>
    );
}
