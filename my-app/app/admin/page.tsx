"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Client, Account, Databases, Query } from "appwrite";
import Navbar from "../components/Navbar";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("68ca637200075ab30b2e");

const account = new Account(client);
const databases = new Databases(client);

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // ✅ STEP 1: Check login
        const currentUser = await account.get();
        console.log("User", currentUser.$id)
        setUser(currentUser);

        // ✅ STEP 2: Check admin collection

        const res = await databases.listDocuments(
          "68ca647a0039e60720a4",
          "admins",
          [
            Query.equal("userId", currentUser.$id),
            Query.equal("role", "admin")
          ]
        );

        if (res.total !== 0) {
          console.log("Access denied: Not an admin");
          router.replace("/");
          return;
        }

        setIsAdmin(true);


      } catch (error) {
        console.log("Admin check error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  // 🔄 Loading screen (VERY IMPORTANT)
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Checking admin access...
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            onClick={() => router.push("/admin/create")}
            className="cursor-pointer p-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
          >
            ➕ Create Hotel
          </div>

          <div
            onClick={() => router.push("/")}
            className="cursor-pointer p-6 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
          >
            🏨 Manage Hotels
          </div>
        </div>
      </div>
    </>
  );
}
