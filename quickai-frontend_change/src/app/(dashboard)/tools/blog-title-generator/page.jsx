import BlogTitleGeneratorForm from "@/components/features/tools/blog-title-generator-form";

export default function BlogTitleGeneratorPage() {
  return (
    <div>
      <h1 className="mb-4   pb-3 text-[37px] font-bold text-[#0088FF]">
        AI Blog Title Generator
      </h1>
      <BlogTitleGeneratorForm />
    </div>
  );
}