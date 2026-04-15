"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase"; 
import Link from "next/link";
import Image from "next/image"; // ✅ Import Image component
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Save new user to database
      await fetch(`${apiUrl}/api/users/saveUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.uid, email: user.email }),
      });

      setMessage("Account created successfully! 🎉");
      
      // Redirect to Dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage(error.message); 
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Save user to database
      fetch(`${apiUrl}/api/users/saveUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.uid, email: user.email }),
      }).catch(err => console.error("DB Save Error:", err));

      setMessage("Signed up successfully with Google! 🎉");

      // Redirect to Dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      console.error(error);
      setMessage("Google sign-up failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative atoms - Matching Login Page */}
      <div className="absolute top-70 -translate-y-1/2 -left-60 opacity-100 pointer-events-none overflow-hidden">
        <svg width="480" height="480" viewBox="0 0 150 150">
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(0 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(45 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(90 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(135 75 75)" />
        </svg>
      </div>

      <div className="absolute bottom-10 left-20 opacity-100 pointer-events-none">
        <svg width="180" height="180" viewBox="0 0 150 150">
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1.5" transform="rotate(0 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1.5" transform="rotate(45 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1.5" transform="rotate(90 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1.5" transform="rotate(135 75 75)" />
        </svg>
      </div>

      <div className="absolute top-0 -right-48.5 opacity-100 pointer-events-none">
        <svg width="380" height="380" viewBox="0 0 150 150">
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1" transform="rotate(20 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1" transform="rotate(65 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1" transform="rotate(110 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#000000" strokeWidth="1" transform="rotate(155 75 75)" />
        </svg>
      </div>

      <div className="absolute -bottom-50 -right-50 opacity-100 pointer-events-none">
        <svg width="450" height="450" viewBox="0 0 150 150">
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(0 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(45 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(90 75 75)" />
          <ellipse cx="75" cy="75" rx="60" ry="15" fill="none" stroke="#3b82f6" strokeWidth="1" transform="rotate(135 75 75)" />
        </svg>
      </div>

      {/* SignUp Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10">
        
        {/* ✅ Logo Section (Updated) */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
             <Image 
                src="/logo.png" 
                alt="NexusAI Logo" 
                fill
                className="object-contain"
                priority
             />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">Create Account</h1>
        <p className="text-center text-gray-500 mb-8">Join NexusAI and explore amazing tools.</p>

        {/* Input Fields */}
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
            placeholder="Email address"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900"
            placeholder="Password"
          />

          <button
            onClick={handleSignUp}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
          </button>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignup}
          disabled={isLoading}
          className="w-full mt-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <path fill="#4285F4" d="M19.6 10.23c0-.82-.1-1.42-.25-2.05H10v3.72h5.5c-.15.96-.74 2.31-2.04 3.22v2.45h3.16c1.89-1.73 2.98-4.3 2.98-7.34z"/>
            <path fill="#34A853" d="M13.46 15.13c-.83.59-1.96 1-3.46 1-2.64 0-4.88-1.74-5.68-4.15H1.07v2.52C2.72 17.75 6.09 20 10 20c2.7 0 4.96-.89 6.62-2.42l-3.16-2.45z"/>
            <path fill="#FBBC05" d="M3.99 10c0-.69.12-1.35.32-1.97V5.51H1.07A9.973 9.973 0 000 10c0 1.61.39 3.14 1.07 4.49l3.24-2.52c-.2-.62-.32-1.28-.32-1.97z"/>
            <path fill="#EA4335" d="M10 3.88c1.88 0 3.13.81 3.85 1.48l2.84-2.76C14.96.99 12.7 0 10 0 6.09 0 2.72 2.25 1.07 5.51l3.24 2.52C5.12 5.62 7.36 3.88 10 3.88z"/>
          </svg>
          Sign up with Google
        </button>

        {/* Message */}
        {message && (
            <p className={`text-center mt-4 text-sm font-medium ${message.includes("failed") || message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
                {message}
            </p>
        )}

        {/* Login link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 hover:text-blue-600 font-semibold">
            Login
          </Link>{' '}
          instead.
        </p>
      </div>
    </div>
  );
}