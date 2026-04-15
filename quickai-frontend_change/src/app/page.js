"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Import Image component
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/login"); // Or /signup if you have one
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-between p-8 relative overflow-hidden font-sans">
      {/* Decorative atoms - Matching Login Page */}
      <div className="absolute top-70 -translate-y-1/2 -left-60 opacity-100 pointer-events-none overflow-hidden">
        <svg width="480" height="480" viewBox="0 0 150 150">
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(0 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(45 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(90 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(135 75 75)"
          />
        </svg>
      </div>

      <div className="absolute bottom-10 left-20 opacity-100 pointer-events-none">
        <svg width="180" height="180" viewBox="0 0 150 150">
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            transform="rotate(0 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            transform="rotate(45 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            transform="rotate(90 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            transform="rotate(135 75 75)"
          />
        </svg>
      </div>

      <div className="absolute top-0 -right-48.5 opacity-100 pointer-events-none">
        <svg width="380" height="380" viewBox="0 0 150 150">
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            transform="rotate(20 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            transform="rotate(65 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            transform="rotate(110 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#000000"
            strokeWidth="1"
            transform="rotate(155 75 75)"
          />
        </svg>
      </div>

      <div className="absolute -bottom-50 -right-50 opacity-100 pointer-events-none">
        <svg width="450" height="450" viewBox="0 0 150 150">
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(0 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(45 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(90 75 75)"
          />
          <ellipse
            cx="75"
            cy="75"
            rx="60"
            ry="15"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1"
            transform="rotate(135 75 75)"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 max-w-4xl mx-auto">
        {/* ✅ Logo Section (Updated) */}
        <div className="mb-8 relative w-24 h-24">
          <Image
            src="/logo.png"
            alt="NexusAI Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Brand Name */}
        <h1 className="text-6xl font-bold mb-6 text-gray-900">NexusAI</h1>

        {/* Tagline */}
        <h2 className="text-4xl font-bold mb-6 text-gray-800">
          Smart Tools for a Smart You
        </h2>

        {/* Description */}
        <p className="text-lg text-gray-600 mb-2 max-w-2xl">
          Create content, Generate Images and explore AI-powered tools — All in
          one place.
        </p>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Sign Up today and unlock the full potential of NexusAI.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition duration-200 text-lg shadow-lg hover:shadow-blue-200"
          >
            Get Started
          </button>
          <button
            onClick={handleLogin}
            className="px-8 py-3 bg-white hover:bg-gray-50 text-black font-semibold rounded-full border-2 border-black transition duration-200 text-lg"
          >
            Login
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 relative z-10 text-sm">
        <p>
          ©2025 <span className="text-blue-500 font-semibold">NexusAI</span> —
          Empowering Creators with Intelligence.
        </p>
      </div>
    </div>
  );
}
