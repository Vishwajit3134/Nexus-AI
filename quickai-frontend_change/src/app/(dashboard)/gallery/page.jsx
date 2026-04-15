import GalleryFeed from "@/components/features/gallery/gallery-feed";

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="mb-4   pb-3 text-[37px] font-bold text-[#0088FF]">
          Community Gallery
        </h1>
        <p className="font-[16px] font-medium text-muted-foreground mt-2">
          Explore AI-generated artwork created by the Quick AI community.
        </p>
      </div>

      {/* The Feature Component */}
      <GalleryFeed />
    </div>
  );
}