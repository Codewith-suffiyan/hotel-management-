"use client";
import React from "react";
import { useRouter } from "next/navigation";

type HotelCardProps = {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  bedrooms: number;
  washrooms: number;
  guests: number;
  hotelName: string;
  location: string;
  availbility: string;
  amenities: string;
};

function HotelCard(props: HotelCardProps) {
  const router = useRouter();

  // ✅ Navigate to hotel details page
  const detailP = () => {
    router.push(`/hotelDe/${props.id}`);
  };

  // ✅ Navigate to book now page
  const handleBookNow = () => {
    router.push(`/bookNow?hotelId=${props.id}`);
  };

  return (
    <div className="w-full md:w-1/2 p-2">
      <div className="flex flex-col bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full">
        <img
          className="object-cover w-full h-40 rounded-t-lg"
          src={props.image || "/pexel.jpg"}
          alt={props.title}
        />

        <div className="flex flex-col justify-between p-4 leading-normal flex-grow">
          <h5 className="mb-1 text-xl font-bold tracking-tight text-gray-900">
            {props.title}
          </h5>

          <p className="mb-2 text-gray-700 line-clamp-2 text-sm">
            {props.description}
          </p>

          <div className="text-xs text-gray-600 space-y-1 mb-2">
            <p>
              Bedrooms: <span className="font-medium">{props.bedrooms}</span>
            </p>
            <p>
              Washrooms: <span className="font-medium">{props.washrooms}</span>
            </p>
            <p>
              Guests: <span className="font-medium">{props.guests}</span>
            </p>
          </div>

          {(props.amenities || "")
            .split(",")
            .slice(1, 4)
            .map((item, index) => (
              <span
                key={index}
                className="bg-light-100 text-light-700 text-xs px-2 py-1 rounded"
              >
                {item.trim()}
              </span>
            ))}

          <p className="text-xs text-gray-500 mb-1">{props.availbility}</p>
          <p className="text-xs text-gray-500">{props.location}</p>

          <div className="mt-2">
            <p className="text-base font-semibold text-blue-700 mb-1">
              ${props.price} / night
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Hotel: {props.hotelName}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={detailP}
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-md text-xs px-3 py-1.5"
              >
                Details
              </button>

              <button
                type="button"
                onClick={handleBookNow}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300 font-medium rounded-md text-xs px-3 py-1.5"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;
