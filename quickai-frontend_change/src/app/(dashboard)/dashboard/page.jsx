"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; 
import PlanStatus from "@/components/features/dashboard/plan-status";
import ToolCard from "@/components/features/dashboard/tool-card";
// import { PenSquare, Image, FileText, ScanText, Trash2, MicVocal, Loader2 } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  // 1. Add state to store the real data
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2. Fetch the user's plan from your Backend API
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Call the backend route you selected: /api/users/:id
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.uid}`);
          
          if (response.ok) {
            const userData = await response.json();
            // Check if the plan is premium in the database
            console.log("User Data:", userData);
            if (userData.current_plan === 'premium' || userData.current_plan === 'Pro Plan') {
              setIsPremiumUser(true);
            }
          }
        } catch (error) {
          console.error("Failed to fetch user plan:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const tools = [
    { id: "article-generator",iconPath:"/articledash.jpeg", title: "Article Generator", desc: "Create full-length articles from a topic.", premium: false },
    { id: "blog-title-generator", iconPath:"/blogdash.jpeg",title: "Blog Title Generator", desc: "Generate catchy titles for your blog.", premium: false },
    { id: "image-generator", iconPath:"/imagedash.jpeg", title: "Image Generator", desc: "Turn your text prompts into stunning AI images.", premium: true },
    { id: "background-remover",iconPath:"/background-remover.jpeg", title: "Background Remover",  desc: "Effortlessly remove image backgrounds.", premium: true },
    { id: "object-remover", iconPath:"/object-remover.jpeg" ,title: "Object Remover",  desc: "Remove unwanted objects from your photos.", premium: true },
    { id: "resume-analyzer",iconPath:"/resume-analyzer.jpeg", title: "Resume Analyzer",  desc: "Get an expert analysis of your resume.", premium: true },
  ];

  // 3. Show a loader while checking status
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Updated Header with Branding */}
      <div>
        <h1 className="   pb-3 text-[37px] font-bold text-[#0088FF]">
          Welcome to NexusAI
        </h1>
        <p className="text-muted-foreground ">
          Create, edit, and analyze content with the power of AI.
        </p>
      </div>

      <PlanStatus isPremium={isPremiumUser} />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 ">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            id={tool.id}
            title={tool.title}
            // Icon={tool.icon}
              iconPath={tool.iconPath}


            description={tool.desc}
            isPremium={tool.premium}
            isLocked={tool.premium && !isPremiumUser}
          />
        ))}
      </div>
    </div>
  );
}