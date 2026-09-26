"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Client, Account } from "appwrite";
import { useRouter } from "next/navigation";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // Appwrite client setup
    const client = new Client()
        .setEndpoint("https://fra.cloud.appwrite.io/v1")
        .setProject("68ca637200075ab30b2e");

    const account = new Account(client);

    // handle login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await account.deleteSession("current").catch(() => { });

            const session = await account.createEmailPasswordSession(email, password);
            console.log("Login Successful:", session);
            alert("Login Successful");
            router.push('/profile')
        } catch (error) {
            console.error("Login Failed:", error.message);
            alert("Login Failed" + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <form className="max-w-sm mx-auto" onSubmit={handleLogin}>
                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            Your email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Enter Your Email:"
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
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            placeholder="Enter Your Password:"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm w-full px-5 py-2.5"
                    >
                        Login
                    </button>
                </form>
            </div>
        </>
    );
};

export default Login;
