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
  Loader2,
  CheckCircle2,
  XCircle,
  UploadCloud,
  FileText,
  Lightbulb,
  FileSearch,
  Copy,
  Check,
} from "lucide-react";
import { auth } from "@/lib/firebase";

export default function ResumeAnalyzerForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const { refreshCredits } = useCredits();
  const COST = 30;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      setError("Please log in to analyze your resume.");
      setIsLoading(false);
      return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("userId", user.uid);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tools/resume-analyzer`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.status === 403) {
        throw new Error("Not enough credits. Please upgrade to continue.");
      }

      if (!response.ok) throw new Error("Failed to analyze resume");

      const data = await response.json();

      if (!data.analysis_result) {
        throw new Error(
          "No analysis data returned. Please try a different PDF."
        );
      }

      setAnalysisResult(data.analysis_result);
      refreshCredits();
    } catch (error) {
      console.error(error);
      if (error.message.includes("Not enough credits")) {
        setError(error.message);
      } else {
        setError(
          error.message || "Error: Could not analyze resume. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Copy Functionality
  const handleCopy = () => {
    if (!analysisResult) return;

    let text = `Resume Analysis Report\n\n`;

    if (analysisResult.strengths) {
      text += `✅ Strengths:\n${analysisResult.strengths
        .map((s) => `- ${s.point}`)
        .join("\n")}\n\n`;
    }
    if (analysisResult.weaknesses) {
      text += `❌ Areas for Improvement:\n${analysisResult.weaknesses
        .map((w) => `- ${w.point}`)
        .join("\n")}\n\n`;
    }
    if (analysisResult.suggestions_for_improvement) {
      text += `💡 Suggestions:\n${analysisResult.suggestions_for_improvement
        .map((s) => `- ${s.suggestion}`)
        .join("\n")}`;
    }

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="w-full border-2 border-black shadow-none bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="p-5 pb-0">
          {/* Header */}
          <CardHeader className="p-0 mb-4 text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
              {/* Theme Icon */}
              <div className="p-2 bg-[#2b7fff]/10 rounded-xl text-[#2b7fff] border border-black">
                <FileSearch className="w-5 h-5" />
              </div>
              <CardTitle
                className="text-[20px] font-bold
 ml-1"
              >
                Resume Analyzer
              </CardTitle>
            </div>
            <CardDescription className="text-[16px] font-medium text-gray-500 text-sm ml-1">
              Upload your resume (PDF) to get expert feedback and improvements.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 space-y-4">
            {/* File Upload Section */}
            <div className="space-y-1.5">
              <Label htmlFor="resume" className="text-[20px] font-medium ml-1">
                Upload Resume
              </Label>

              <div className="relative group cursor-pointer h-48 sm:h-56">
                <Input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf"
                  required
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                  onChange={(e) => setFileName(e.target.files[0]?.name || "")}
                />
                <div
                  className={`
                      border-2 border-dashed rounded-xl h-full flex flex-col items-center justify-center text-center transition-all duration-200 overflow-hidden
                      ${
                        fileName
                          ? "border-[#2b7fff] bg-[#2b7fff]/5"
                          : "border-black/30 bg-gray-50 group-hover:border-[#2b7fff] group-hover:bg-[#2b7fff]/5"
                      }
                    `}
                >
                  <div
                    className={`p-3 rounded-full mb-3 shadow-sm transition-colors border ${
                      fileName
                        ? "bg-white border-[#2b7fff]/20"
                        : "bg-white border-black/10"
                    }`}
                  >
                    {fileName ? (
                      <FileText className="h-6 w-6 text-[#2b7fff]" />
                    ) : (
                      <UploadCloud className="h-6 w-6 text-[#2b7fff]" />
                    )}
                  </div>

                  {fileName ? (
                    <div className="space-y-1 px-4">
                      <p className="font-semibold text-[#2b7fff] text-sm truncate max-w-[200px] mx-auto">
                        {fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Click to change file
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 px-4">
                      <p className="font-[20px] font-medium text-gray-700 text-sm">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-[16px] font-medium text-gray-500 text-sm ml-1 text-gray-500">
                        PDF files only (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Analysis Result Section */}
            {analysisResult && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-semibold text-gray-700 ml-1">
                    Analysis Report
                  </Label>
                </div>

                <div className="relative rounded-xl border-2 border-black bg-gray-50/50 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Copy Button */}
                  <Button
                    type="button"
                    onClick={handleCopy}
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white hover:bg-[#2b7fff]/10 text-[#2b7fff] border border-black/10 shadow-sm"
                    title="Copy Report"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Header */}
                  <div className="pb-3 border-b border-black/10 mb-4">
                    <h4 className="font-bold text-lg text-gray-900">
                      Resume Feedback
                    </h4>
                  </div>

                  <div className="space-y-6">
                    {/* Strengths */}
                    {analysisResult.strengths && (
                      <div className="space-y-2">
                        <h5 className="flex items-center text-sm font-bold text-green-700">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> Strengths
                        </h5>
                        <ul className="space-y-2 pl-1">
                          {analysisResult.strengths.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm text-gray-600 bg-white p-3 rounded-lg border border-black/5 shadow-sm"
                            >
                              <span className="mr-2 text-green-600 font-bold">
                                •
                              </span>
                              {item.point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {analysisResult.weaknesses && (
                      <div className="space-y-2">
                        <h5 className="flex items-center text-sm font-bold text-red-700">
                          <XCircle className="mr-2 h-4 w-4" /> Areas for
                          Improvement
                        </h5>
                        <ul className="space-y-2 pl-1">
                          {analysisResult.weaknesses.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start text-sm text-gray-600 bg-white p-3 rounded-lg border border-black/5 shadow-sm"
                            >
                              <span className="mr-2 text-red-600 font-bold">
                                •
                              </span>
                              {item.point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Suggestions */}
                    {analysisResult.suggestions_for_improvement && (
                      <div className="space-y-2">
                        <h5 className="flex items-center text-sm font-bold text-[#2b7fff]">
                          <Lightbulb className="mr-2 h-4 w-4" /> Actionable
                          Suggestions
                        </h5>
                        <ul className="grid gap-2 sm:grid-cols-2">
                          {analysisResult.suggestions_for_improvement.map(
                            (item, index) => (
                              <li
                                key={index}
                                className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-black/5 shadow-sm flex items-start"
                              >
                                <span className="mr-2 text-[#2b7fff] font-bold">
                                  →
                                </span>
                                {item.suggestion}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </div>

        <CardFooter className="p-5 pt-2 relative flex justify-center items-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-auto h-[50px] bg-[#0088FF] opacity-100 rounded-[14px] text-white  text-[24px] font-bold leading-[1] 
hover:bg-[#0088FF]/90 transition-all text-sm font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              `Analyze Resume (${COST} Credits)`
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
