"use client";
import { useCredits } from "@/components/contexts/CreditContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, Copy, Check, List } from "lucide-react";
import { auth } from "@/lib/firebase";

export default function BlogTitleGeneratorForm() {
  // ✅ FIX: Destructure refreshCredits so it is defined in this file
  const { refreshCredits } = useCredits();

  const [isLoading, setIsLoading] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const COST = 5;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneratedTitles([]);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to generate titles.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const keyword = formData.get("keyword");
    const category = formData.get("category");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tools/blog-title-generator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ keyword, category, userId: user.uid }),
        }
      );

      if (response.status === 403) {
        throw new Error("Not enough credits. Please upgrade to continue.");
      }

      if (!response.ok) throw new Error("Failed to generate titles");

      const data = await response.json();

      // Update state with titles
      setGeneratedTitles(data.generated_output.titles || []);

      // ✅ This will now work correctly because refreshCredits is defined above
      refreshCredits();
    } catch (error) {
      console.error(error);
      if (error.message.includes("Not enough credits")) {
        setError(error.message);
      } else {
        setError("Error: Could not generate titles. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedTitles.length === 0) return;
    const textToCopy = generatedTitles.map((t) => `- ${t}`).join("\n");
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="w-full border-2 border-black shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-5 pb-0">
          <CardContent className="p-0 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="keyword" className="text-[20px] font-bold ml-1">
                  Main Keyword
                </Label>
                <Input
                  id="keyword"
                  name="keyword"
                  placeholder="e.g., SaaS Marketing"
                  required
                  className="h-10 px-3 rounded-[15px] bg-white text-[16px] font-medium border-2 border-[#B3B3B3] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] focus:ring-2 focus:ring-[#2b7fff] dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="category"
                  className="text-[20px] font-bold ml-1"
                >
                  Category / Niche
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Marketing, Technology"
                  required
                  className="h-10 px-3 rounded-[15px] bg-white text-[16px] font-medium border-2 border-[#B3B3B3] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] focus:ring-2 focus:ring-[#2b7fff] dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-[20px] font-bold ml-1">
                Generated Titles
              </Label>
              <div className="relative rounded-[15px] bg-white border-2 border-[#B3B3B3] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] focus:ring-2 focus:ring-[#2b7fff] dark:bg-gray-800 dark:text-white custom-scrollbar p-4 min-h-[150px]">
                {generatedTitles.length > 0 && (
                  <Button
                    type="button"
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-[#2b7fff]/10 text-[#2b7fff] border border-black/10 backdrop-blur-sm z-10"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}

                {!generatedTitles.length && !isLoading && (
                  <div className="flex flex-col h-full items-center justify-center text-gray-400 gap-2 py-8">
                    <Sparkles className="w-8 h-8 opacity-20" />
                    <p className="text-[16px] font-medium text-gray-500 text-sm">
                      Your titles will appear here...
                    </p>
                  </div>
                )}

                {generatedTitles.length > 0 && (
                  <ul className="space-y-2 pr-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {generatedTitles.map((title, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white border border-black/10 shadow-sm hover:border-[#2b7fff]/50 transition-colors group"
                      >
                        <div className="mt-0.5 p-1 rounded-full bg-[#2b7fff]/10 text-[#2b7fff] shrink-0">
                          <List className="w-3 h-3" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed">
                          {title}
                        </span>
                      </li>
                    ))}
                  </ul>
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
hover:bg-[#0088FF]/90 transition-all text-sm font-medium "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ...
              </>
            ) : (
              `Generate Titles (${COST} Credits)`
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
