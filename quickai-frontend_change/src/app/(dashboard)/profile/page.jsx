"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, Shield, Loader2, Sparkles, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // Store DB user data here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        // Fetch extra details (like plan) from our PostgreSQL DB
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${currentUser.uid}`);
          if (response.ok) {
            const data = await response.json();
            setDbUser(data);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Helper to determine plan display
  const getPlanName = () => {
    if (!dbUser) return "Free Plan";
    // Check for premium variations
    if (dbUser.current_plan === 'premium' || dbUser.current_plan === 'Pro Plan') {
        return "Premium Plan";
    }
    return "Free Plan";
  };

  const isPremium = getPlanName() === "Premium Plan";

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          {/* Avatar & Plan Section */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
              <AvatarImage src={user.photoURL} alt={user.displayName || "User"} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                {user.email ? user.email[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
                <h3 className="font-bold text-xl text-foreground">{user.displayName || "Quick AI User"}</h3>
                
                {/* Dynamic Plan Badge */}
                <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Member since {new Date(user.metadata.creationTime).getFullYear()}</span>
                    
                    {isPremium ? (
                        <Badge className="ml-2 bg-gradient-to-r from-primary to-purple-600 border-0">
                            <Sparkles className="w-3 h-3 mr-1 fill-current" /> Premium
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="ml-2">Free</Badge>
                    )}
                </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="email" 
                    value={user.email} 
                    disabled 
                    className="pl-9 bg-muted/50 text-muted-foreground border-border cursor-not-allowed" 
                />
              </div>
              <p className="text-[11px] text-muted-foreground">Your email address is managed by Google Sign-In.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="uid">User ID</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                    id="uid" 
                    value={user.uid} 
                    disabled 
                    className="pl-9 bg-muted/50 text-muted-foreground border-border cursor-not-allowed font-mono text-xs" 
                />
              </div>
            </div>
            
            {/* Database Status Field (Good for debugging) */}
            <div className="space-y-2">
                <Label>Current Plan Status (Database)</Label>
                <div className="p-3 rounded-md border border-border bg-background text-sm font-medium flex justify-between items-center">
                    <span>{getPlanName()}</span>
                    {isPremium && <span className="text-green-500 text-xs">Active</span>}
                </div>
            </div>

          </div>

        </CardContent>
        <CardFooter className="flex justify-between border-t border-border bg-muted/20 p-6">
          <p className="text-xs text-muted-foreground">
            Account created: {new Date(user.metadata.creationTime).toLocaleDateString()}
          </p>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            className="gap-2 shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}