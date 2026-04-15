import ArticleGeneratorForm from "@/components/features/tools/article-generator-form";

export default function ArticleGeneratorPage() {
  return (
    <div>
      <h1 className="mb-4   pb-3 text-[37px] font-bold text-[#0088FF]">
        AI Article Generator
      </h1>
      <ArticleGeneratorForm />
    </div>
  );
}