"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Client, Account, ID } from "appwrite";
import {useRouter} from 'next/navigation'


function Page() {
    // input states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const router = useRouter();

    const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('68ca637200075ab30b2e')

    const account = new Account(client);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const response = await account.create(
                ID.unique(),
                email,
                password, 
                name || undefined
            );
            console.log("User Created", response)
            router.push('/login')

            alert("Sign Up Successfully")
        }catch (error) {
            console.log("Error in Sign Up", error.message);
            alert("Sign Up Failed:" + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div>
                <div className="container">
                    <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
                    <form className="max-w-sm mx-auto" onSubmit={handleSignup}>
                        <div className="mb-5">
                            <label
                                htmlFor="name"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Your name
                            </label>
                            <input
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                id="name"
                                placeholder="Enter Your Name"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Your email
                            </label>
                            <input
                                type="email"
                                onChange={(e) => setEmail(e.target.value)}
                                id="email"
                                placeholder="Create Email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900"
                            >
                                Your password
                            </label>
                            <input
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                placeholder="Create Password"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-full p-2.5"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full px-5 py-2.5"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Page;
