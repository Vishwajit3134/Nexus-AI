"use client";

import { useCredits } from "@/components/contexts/CreditContext";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, UploadCloud, ImageIcon, Wand2, Download, Eraser, Edit } from "lucide-react";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Define fixed prompt for specific mode
const FIXED_PROMPTS = {
  "remove-bg": "Remove the background completely from this image, isolating the main subject on a transparent or solid background.",
};

export default function ImageEditorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [editorMode, setEditorMode] = useState("custom"); // 'custom' or 'remove-bg'
  const [prompt, setPrompt] = useState("");
  const [editedImage, setEditedImage] = useState(null);
  const [error, setError] = useState(null);
  const imageInputRef = useRef(null);

  const { credits, deductCredits } = useCredits();
  
  // Set fixed cost to 40 credits per image
  const COST = 40; 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setEditedImage(null); 
    }
  };

  const getActivePrompt = () => {
    if (editorMode === "custom") return prompt;
    return FIXED_PROMPTS[editorMode];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (credits < COST) {
      setError(`Not enough credits. This action requires ${COST} credits.`);
      return;
    }

    if (!image) {
      setError("Please upload an image first.");
      return;
    }

    const finalPrompt = getActivePrompt();
    if (!finalPrompt.trim()) {
        setError("Please enter instructions for editing.");
        return;
    }

    setIsLoading(true);
    setEditedImage(null);
    setError(null);
    deductCredits(COST); 

    const user = auth.currentUser;
    if (!user) {
        setError("Please log in to use the editor.");
        setIsLoading(false);
        deductCredits(-COST); 
        return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", finalPrompt); 
      formData.append("userId", user.uid);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/image-editor`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to edit image");
      }

      const data = await response.json();
      if (!data.imageUrl) throw new Error("No image URL in response");
      
      setEditedImage(data.imageUrl);

    } catch (error) {
      console.error(error);
      deductCredits(-COST); 
      setError(error.message || "Error: Could not edit image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!editedImage) return;
    try {
      const response = await fetch(editedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const timestamp = new Date().getTime();
      link.download = `nexusai-${editorMode}-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Failed to download image. Try right-clicking and saving.");
    }
  };

  const getModeButtonClasses = (modeStr) => {
    const isActive = editorMode === modeStr;
    return cn(
        "rounded-full border transition-all shadow-sm px-5 py-2",
        isActive 
            ? "bg-[#0088ff] text-white border-[#0088ff] hover:bg-[#0088ff]/90" 
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#0088ff]/50 hover:text-[#0088ff]"
    );
  }

  return (
    <Card className="w-full border-2 border-black shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-5 pb-0">
          

          <CardContent className="p-0 space-y-6">
            {/* 1. Image Upload Section */}
            <div className="space-y-2">
              <Label className="text-[20px] font-bold
 ml-1">1. Upload Source Image</Label>
              <div 
                onClick={() => imageInputRef.current?.click()}
                className={`
                  relative group cursor-pointer h-64 sm:h-80 border-3 border-dashed rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 overflow-hidden bg-gray-50
                  ${image ? 'border-[#0088ff]/50 bg-[#0088ff]/5' : 'border-gray-300 hover:border-[#0088ff] hover:bg-[#0088ff]/5'}
                `}
              >
                <Input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                
                {image ? (
                  <div className="relative w-full h-full">
                     <Image 
                        src={URL.createObjectURL(image)} 
                        alt="Upload preview" 
                        fill
                        className="object-contain p-2"
                     />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold bg-black/50 px-4 py-2 rounded-full">Click to change</p>
                     </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3 p-6">
                    <div className="p-4 rounded-full bg-white shadow-sm border border-gray-200 group-hover:border-[#0088ff]/30 group-hover:scale-110 transition-transform">
                      <UploadCloud className="h-10 w-10 text-[#0088ff]" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-bold text-gray-800 text-lg">Click to upload image</p>
                      <p className="text-[16px] text-sm font-medium text-gray-500">Supports JPG, PNG (Max 10MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Editing Controls Section */}
            <div className="space-y-4">
                <Label className="text-[20px] font-bold
 ml-1">2. Select Editing Mode</Label>
                
                {/* Mode Selection Buttons - Tightly wrapped and spaced */}
                <div className="flex gap-2 p-1.5 bg-gray-100/60 rounded-full border border-gray-200 w-fit mx-auto sm:mx-0">
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditorMode("custom")} className={getModeButtonClasses("custom")}>
                        <Edit className="w-4 h-4 mr-2"/> Custom Edit
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditorMode("remove-bg")} className={getModeButtonClasses("remove-bg")}>
                        <Eraser className="w-4 h-4 mr-2"/> Remove BG
                    </Button>
                </div>

                {/* Conditional Prompt Input Area */}
                <div className="relative mt-2">
                    <Textarea
                        placeholder={editorMode === "custom" ? "E.g., Change hair color to red, add sunglasses, make it look like a painting..." : ""}
                        value={getActivePrompt()}
                        onChange={(e) => editorMode === "custom" && setPrompt(e.target.value)}
                        readOnly={editorMode !== "custom"}
                        rows={editorMode === "custom" ? 3 : 2}
                        className={`
                             text-[16px] font-mediummin-h-[90px] resize-none rounded-xl border-2 font-medium transition-colors
                            ${editorMode !== "custom" 
                                ? "bg-gray-100/80 text-gray-500 border-gray-200 cursor-not-allowed focus-visible:ring-0 italic pt-8" 
                                : "bg-white border-black/20 focus:border-[#0088ff] focus-visible:ring-[#0088ff]" 
                            }
                        `}
                    />
                    {editorMode !== "custom" && (
                        <div className="absolute left-3 top-3 text-xs font-bold text-[#0088ff] bg-[#0088ff]/10 px-2.5 py-0.5 rounded-full border border-[#0088ff]/20">
                            Fixed Prompt
                        </div>
                    )}
                 </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200/80 text-red-700 text-sm font-bold text-center animate-in fade-in">
                {error}
              </div>
            )}

            {/* 3. Result Section */}
            {editedImage && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-2">
                 <Label className="text-sm font-bold text-gray-800 ml-1 flex items-center justify-between">
                    <span>3. Generated Result</span>
                 </Label>
                 <div className="relative rounded-[15px] 
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white  overflow-hidden h-64 sm:h-80 group">
                    <Image 
                        src={editedImage} 
                        alt="Edited Result" 
                        fill 
                        className="object-contain p-2" 
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button type="button" variant="secondary" size="icon" className="rounded-full h-12 w-12 bg-white/90 hover:bg-white text-[#0088ff]" onClick={() => window.open(editedImage, '_blank')}>
                            <ImageIcon className="h-6 w-6" />
                        </Button>
                        <Button type="button" size="icon" onClick={handleDownload} className="rounded-full h-12 w-12 bg-[#0088ff] hover:bg-[#0088ff]/90 text-white border-2 border-white">
                            <Download className="h-6 w-6" />
                        </Button>
                    </div>
                 </div>
                  <p className="text-center text-xs font-medium text-gray-500 mt-2">Hover over image to download</p>
              </div>
            )}

          </CardContent>
        </div>

        <CardFooter className="p-5 pt-2 relative flex justify-center items-center">
          <Button
            type="submit"
            disabled={isLoading || !image || (editorMode === 'custom' && !prompt.trim())}
            className={`
"w-[150px] h-[50px] bg-[#0088FF] opacity-100 rounded-[14px] text-white  text-[24px] font-bold leading-[1] 
hover:bg-[#0088FF]/90 transition-all text-sm font-medium "
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0088ff] hover:bg-[#0088ff]/90 text-white border-2 border-black/10'}
            `}
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing Image...</>
            ) : (
              <><Wand2 className="mr-2 h-5 w-5" /> Generate ({COST} Credits)</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}