import ImageEditorForm from "@/components/features/tools/image-editor-form";

export default function ImageEditorPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="mb-4   pb-3 text-[37px] font-bold text-[#0088FF]">
          Magic Image Editor
        </h1>
        <p className="text-muted-foreground mt-2">
          Edit images using natural language instructions.
        </p>
      </div>

      <ImageEditorForm />
    </div>
  );
}
