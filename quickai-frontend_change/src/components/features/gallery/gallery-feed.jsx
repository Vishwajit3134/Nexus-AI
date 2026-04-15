"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Loader2, ImageIcon, Calendar, User } from "lucide-react";
import Image from "next/image";

export default function GalleryFeed() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/gallery`);
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();
        setImages(data.images);
      } catch (err) {
        console.error(err);
        setError("Could not load gallery.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center text-destructive bg-destructive/5 rounded-xl border border-destructive/20 m-4">
        <p className="text-lg font-medium">{error}</p>
        <p className="text-sm text-muted-foreground">Please check your connection and try again.</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border rounded-xl bg-muted/20">
          <div className="p-4 bg-muted rounded-full mb-4">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium text-lg">No public images yet</p>
          <p className="text-sm text-muted-foreground">Be the first to create one in the Image Generator!</p>
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((img) => (
        <Card key={img.id} className="group overflow-hidden border-border bg-card hover:shadow-xl transition-all duration-300 rounded-xl hover:-translate-y-1">
          <div className="relative aspect-square overflow-hidden bg-muted">
            {/* Image */}
            <Image
              src={img.storage_url}
              alt={img.prompt_input}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              unoptimized // Use this if your image URLs are external (like Unsplash/Firebase)
            />
            
            {/* Overlay (Visible on Hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-white text-sm line-clamp-2 font-medium mb-2">
                "{img.prompt_input}"
              </p>
              <div className="flex items-center justify-between">
                <span className="capitalize bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] backdrop-blur-sm border border-white/10">
                  {img.artistic_style || "General"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Footer Info */}
          <div className="p-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border bg-card/50">
             <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                <span>{new Date(img.created_at).toLocaleDateString()}</span>
             </div>
             {/* Placeholder for User ID/Name if you add that later */}
             <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <User className="w-3 h-3" />
                <span>Artist</span>
             </div>
          </div>
        </Card>
      ))}
    </div>
  );
}