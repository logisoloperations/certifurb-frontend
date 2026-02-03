"use client";

import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import { font } from "../Components/Font/font";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const router = useRouter();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed || !email) return;

    try {
      setIsLoading(true);
      const res = await fetch(
        "https://api.certifurb.com/api/delete-account-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert(data.message || "Your deletion request was sent successfully.");
        router.push("/");
        setIsLoading(false);
      } else {
        setError(data.message || "There was an error. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message || "Something went wrong.");
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${font.className} min-h-screen bg-white`}>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Delete Account Data</h1>
        <p className="text-gray-700 mb-6">
          Deleting your account data will permanently remove all your
          information from our systems. This includes your profile, orders,
          reviews, and any other data associated with your account.
        </p>

        <form onSubmit={handleSubmit} className="text-left">
          <label className="block text-sm font-semibold mb-1">
            Primary Email Address
          </label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="inline-flex items-start gap-2 text-sm mb-6">
            <input
              type="checkbox"
              className="mt-1"
              checked={confirmed}
              onChange={() => setConfirmed(!confirmed)}
            />
            I understand that deleting my account data is a permanent action and
            cannot be undone.
          </label>

          <button
            type="submit"
            className={`block w-full text-center px-4 py-2 rounded ${
              confirmed && email
                ? "cursor-pointer custom-green-bg text-white px-4 py-1 rounded-full transition-colors"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!confirmed || !email}
          >
            {isLoading ? "Submitting Request..." : "Submit Request"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
