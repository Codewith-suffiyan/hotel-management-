// "use client"

// import { useState, useEffect } from 'react'
// import { Client, Databases, Account, Query } from "appwrite"

// const client = new Client()
//     .setEndpoint("https://fra.cloud.appwrite.io/v1")
//     .setProject("68ca637200075ab30b2e")

// const databases = new Databases(client)
// const account = new Account(client)

// const DATABASES_ID = "68ca647a0039e60720a4"
// const REACTION_COLLECTION = "hotel_reactions"
// const HOTEL_COLLECTION = "hotels"



// const Page = () => {

//      const [likes, setLikes] = useState([])
//   const [loading, setLoading] = useState(true)

//     return (
//         <div>
//             like page
//         </div>
//     )
// }

// export default Page


"use client"

import { useState, useEffect } from "react"
import { Client, Databases, Account, Query } from "appwrite"

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject("68ca637200075ab30b2e")

const databases = new Databases(client)
const account = new Account(client)

const DATABASES_ID = "68ca647a0039e60720a4"
const REACTION_COLLECTION = "hotel_reactions"

const Page = () => {

  const [likes, setLikes] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLikes = async () => {

    try {

      const user = await account.get()

      const res = await databases.listDocuments(
        DATABASES_ID,
        REACTION_COLLECTION,
        [
          Query.equal("userId", user.$id),
          Query.equal("reactionType", "like")
        ]
      )

      setLikes(res.documents)

    } catch (error) {
      console.log(error)
    }

   finally{
     setLoading(false)
   } 
  }

  useEffect(() => {
    fetchLikes()
  }, [])

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-5">
        Liked Hotels ❤️
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && likes.length === 0 && (
        <p>No liked hotels found</p>
      )}

      {!loading && likes.map((item) => (
        <div key={item.$id} className="border p-4 rounded-lg mb-3">

          <p>Hotel ID: {item.hotelId}</p>
          <p>Reaction: {item.reactionType}</p>

        </div>
      ))}

    </div>
  )
}

export default Page