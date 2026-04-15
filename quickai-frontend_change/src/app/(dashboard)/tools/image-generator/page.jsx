import ImageGeneratorForm from "@/components/features/tools/image-generator-form";

export default function ImageGeneratorPage() {
  return (
    <div>
      <h1 className="mb-4   pb-3 text-[37px] font-bold text-[#0088FF]">
        AI Image Generator
      </h1>
      <ImageGeneratorForm />
    </div>
  );
}