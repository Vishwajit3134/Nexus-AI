"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCredits } from "@/components/contexts/CreditContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { Loader2, Sparkles, Image as ImageIcon, Download, Check } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function ImageGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const COST = 50;
  const { refreshCredits } = useCredits();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to generate images.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const prompt = formData.get("prompt");
    const style = formData.get("style");
    const isPublic = formData.get("isPublic") === "on";

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tools/image-generator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            style,
            isPublic,
            userId: user.uid,
          }),
        }
      );

      const result = await response.json();

      if (response.status === 403) {
        throw new Error(result.error || "Not enough credits.");
      }

      if (response.status === 429) {
        const wait = result.retryAfter || 8;
        throw new Error(`Too many requests. Please wait ${wait} seconds.`);
      }

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate image.");
      }

      if (
        !result.imageUrl ||
        typeof result.imageUrl !== "string" ||
        result.imageUrl.trim() === ""
      ) {
        throw new Error("Invalid image URL received from server.");
      }

      setGeneratedImage(result.imageUrl);
      refreshCredits();
    } catch (err) {
      console.error("Image generation failed:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Download Function
  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 2000);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <Card className="w-full border-2 border-black shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-5 pb-0">
          <CardContent className="p-0 space-y-4">

            {/* Inputs Grid */}
            <div className="grid md:grid-cols-2 gap-4">

              {/* Prompt Input */}
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="prompt" className="text-[20px] font-bold
 ml-1">Prompt</Label>
                <Input
                  name="prompt"
                  placeholder="Describe your image... e.g. 'A futuristic city made of glass'"
                  required
                  className="h-10 px-3 rounded-[15px] 
bg-white text-[16px] font-medium
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              {/* Style Select */}
              <div className="space-y-1.5">
                <Label htmlFor="style" className="text-[20px] font-bold
 ml-1">Art Style</Label>
                <Select name="style" defaultValue="realistic">
                  <SelectTrigger className="h-10 px-3 rounded-[15px] 
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white">
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <hr></hr>
                    <SelectItem value="anime">Anime</SelectItem>
                    <hr></hr>

                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                    <hr></hr>

                    <SelectItem value="oil_painting">Oil Painting</SelectItem>
                    <hr></hr>

                    <SelectItem value="3d_render">3D Render</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between h-10 px-3 rounded-[15px] 
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white">
                <Label className="text-xs font-semibold text-gray-700 cursor-pointer" htmlFor="public-switch">Make Public</Label>
                <Switch name="isPublic" id="public-switch" defaultChecked className="data-[state=checked]:bg-[#2b7fff]" />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Result Area */}
            <div className="space-y-1.5">
              <Label className="text-[20px] font-bold
 ml-1">Generated Result</Label>
              <div className="relative rounded-[15px] 
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white p-2 min-h-[300px] flex items-center justify-center overflow-hidden">

                {/* Download Button */}
                {generatedImage && (
                  <Button
                    type="button"
                    onClick={handleDownload}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-[#2b7fff]/10 text-[#2b7fff] border border-black/10 backdrop-blur-sm z-30 shadow-sm transition-all"
                    title="Download Image"
                  >
                    {isDownloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  </Button>
                )}

                {!generatedImage && (
                  <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Sparkles className="w-8 h-8 opacity-20" />
                    <p className="text-[16px] font-medium text-gray-500 text-xs">Your image will appear here...</p>
                  </div>
                )}

                {typeof generatedImage === "string" && generatedImage.length > 0 && (
                  <div className="relative w-full h-full min-h-[300px] animate-in fade-in zoom-in duration-500">
                    <Image
                      src={generatedImage}
                      alt="Generated AI Image"
                      fill
                      className="object-contain rounded-lg"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>

          </CardContent>
        </div>

        <CardFooter className="p-5 pt-2 relative flex justify-center items-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-auto h-[50px] bg-[#0088FF] opacity-100 rounded-[14px] text-white  text-[24px] font-bold leading-[1] 
hover:bg-[#0088FF]/90 transition-all text-sm font-medium "   >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
            {isLoading ? "Generating..." : `Generate Image (${COST} Credits)`}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}