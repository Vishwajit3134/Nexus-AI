"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const CreditContext = createContext();

export function CreditProvider({ children }) {
  const [credits, setCredits] = useState(0);
  const [user, setUser] = useState(null);

  const fetchCredits = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/user-credits/${userId}?_=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchCredits(currentUser.uid);
      } else {
        setCredits(0);
      }
    });
    return () => unsubscribe();
  }, [fetchCredits]);

  const refreshCredits = () => {
    if (user) fetchCredits(user.uid);
  };

  // ✅ Optimistic UI update: Instantly deducts credits on the frontend
  const deductCredits = (amount) => {
    setCredits((prev) => Math.max(0, prev - amount));
  };

  return (
    <CreditContext.Provider value={{ credits, refreshCredits, deductCredits }}>
      {children}
    </CreditContext.Provider>
  );
}

export const useCredits = () => useContext(CreditContext);