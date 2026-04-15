"use client";
import { useCredits } from "@/components/contexts/CreditContext";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Loader2, Sparkles, FileText, Copy, Check } from "lucide-react"; // ✅ Added Copy, Check
import { auth } from "@/lib/firebase";

export default function ArticleGeneratorForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedArticle, setGeneratedArticle] = useState(null);
  const [error, setError] = useState(null);
  const [length, setLength] = useState("medium");
  const [isCopied, setIsCopied] = useState(false); // ✅ State for copy feedback
  const { refreshCredits } = useCredits();
  const COSTS = {
    short: 10,
    medium: 20,
    long: 30,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setGeneratedArticle(null);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to generate articles.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const topic = formData.get("topic");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tools/article-generator`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, length, userId: user.uid }),
        }
      );

      if (response.status === 403) {
        throw new Error("Not enough credits. Please upgrade to continue.");
      }

      if (!response.ok) throw new Error("Failed to generate article");

      const data = await response.json();
      setGeneratedArticle(data.generated_output);
      refreshCredits(); // Refresh credits after successful generation
    } catch (error) {
      console.error(error);
      if (error.message.includes("Not enough credits")) {
        setError(error.message);
      } else {
        setGeneratedArticle({
          title: "Error",
          sections: [
            {
              type: "paragraph",
              content: "Could not generate article. Please try again.",
            },
          ],
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ New Function: Handle Copy to Clipboard
  const handleCopy = () => {
    if (!generatedArticle) return;

    // Format text: Title + Double Newline + Sections separated by Double Newlines
    const textToCopy = `${generatedArticle.title}\n\n${(
      generatedArticle.sections || []
    )
      .map((s) => s.content)
      .join("\n\n")}`;

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);

    // Reset icon after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  const renderSection = (section, index) => {
    switch (section.type) {
      case "heading":
        return (
          <h2
            key={index}
            className="text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-gray-100"
          >
            {section.content}
          </h2>
        );
      case "paragraph":
        return (
          <p
            key={index}
            className="mb-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            {section.content}
          </p>
        );
      default:
        return (
          <p key={index} className="text-sm">
            {section.content}
          </p>
        );
    }
  };

  return (
    <Card className="w-full border-2 border-black shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        <div className="p-5 pb-0">
          <CardContent className="p-0 space-y-4">
            {/* Inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="topic"
                  className="text-[20px] font-bold
 ml-1"
                >
                  Topic
                </Label>
                <Input
                  id="topic"
                  name="topic"
                  placeholder="e.g., The Future of Renewable Energy"
                  required
                  className="h-10 px-3 
rounded-[15px] 
text-[16px] font-medium
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white 
text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="length"
                  className="text-[20px] font-bold
 ml-1"
                >
                  Article Length
                </Label>
                <Select
                  name="length"
                  defaultValue="medium"
                  onValueChange={setLength}
                >
                  <SelectTrigger
                    className="h-10 px-3 rounded-[15px] 
bg-white text-[16px] font-medium
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white  text-sm"
                  >
                    <SelectValue placeholder="Select a length" />
                  </SelectTrigger>
                  <SelectContent
                    className="border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white text-[16px] font-medium"
                  >
                    <SelectItem value="short">
                      Short (~300 words) - 10 Credits
                    </SelectItem>
                    <hr></hr>
                    <SelectItem value="medium">
                      Medium (~600 words) - 20 Credits
                    </SelectItem>
                    <hr></hr>

                    <SelectItem value="long">
                      Long (~1000 words) - 30 Credits
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Output Display Area */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <Label
                  className="text-[20px] font-bold
 ml-1"
                >
                  Generated Result
                </Label>
              </div>

              {/* ✅ Added 'relative' class to position the button inside */}
              <div
                className="relative rounded-[15px] 
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
 p-4 min-h-[150px] max-h-[50vh] overflow-y-auto dark:bg-gray-800/50 dark:border-gray-700 transition-colors custom-scrollbar"
              >
                {/* ✅ Copy Button - Only shows when article exists */}
                {/* ===========here code is put inside cardfooter================ */}
                {!generatedArticle && (
                  <div className="flex flex-col h-full items-center justify-center text-gray-400 gap-2 py-8">
                    <Sparkles className="w-8 h-8 opacity-20" />
                    <p className=" text-[16px] font-medium text-gray-500 text-sm">
                      Your generated article will appear here...
                    </p>
                  </div>
                )}

                {generatedArticle && (
                  <div className="prose prose-sm dark:prose-invert max-w-none animate-in fade-in slide-in-from-bottom-2 duration-500 pr-8">
                    <h1 className=" mb-4   pb-3 text-[37px] font-bold text-[#0088FF]">
                      {generatedArticle.title}
                    </h1>
                    {(generatedArticle.sections || []).map(renderSection)}
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
hover:bg-[#0088FF]/90 transition-all text-sm font-medium "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              `Generate (${COSTS[length]} Credits)`
            )}
          </Button>
          {generatedArticle && (
            <Button
              type="button"
              onClick={handleCopy}
              variant="ghost"
              size="sm"
              // className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-[#2b7fff]/10 text-[#2b7fff] border border-black/10 backdrop-blur-sm z-10"
              className="absolute right-5 
h-10 w-10 p-0 
bg-transparent hover:bg-gray-200
rounded-lg 
flex items-center justify-center"
              title="Copy to clipboard"
            >
              {/* ==========custome copy button======== */}
              {/* {isCopied ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" />
                        <path d="M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z" />
                        <path d="M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" />
                      </svg>
                    )} */}
              {isCopied ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <img src="/copy-icon.png" alt="Copy" className="w-5 h-5" />
              )}

              {/* {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} */}
              <span className="sr-only">Copy</span>
            </Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
