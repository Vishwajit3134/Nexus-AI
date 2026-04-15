"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCredits } from "@/components/contexts/CreditContext"; // ✅ Import Hook
import { Coins } from "lucide-react";

// import { 
//   Home, 
//   Image as ImageIcon, 
//   SquarePen,      
//   LayoutTemplate, 
//   FileSearch,     
//   Images,         
//   Receipt,        
//   Coins 
// } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { credits } = useCredits(); // ✅ Use global credit state

  // const menuItems = [
  //   { icon: Home, label: 'Dashboard', href: '/dashboard' },
  //   { icon: SquarePen, label: 'Article Generator', href: '/tools/article-generator' },
  //   { icon: LayoutTemplate, label: 'Blog Title Generator', href: '/tools/blog-title-generator' },
  //   { icon: ImageIcon, label: 'Image Generator', href: '/tools/image-generator' },
  //   { icon: ImageIcon, label: 'Image Editor', href: '/tools/image-editor' },
  //   { icon: FileSearch, label: 'Resume Analyser', href: '/tools/resume-analyzer' }, 
  //   { icon: Images, label: 'Image Gallery', href: '/gallery' },
  //   { icon: Receipt, label: 'Billing', href: '/billing' },
  // ];
  const menuItems = [
    { iconPath: "/dashboard.png", label: "Dashboard", href: "/dashboard" },
    { iconPath: "/article.png", label: "Article Generator", href: "/tools/article-generator" },
    { iconPath: "/blog.png", label: "Blog Title Generator", href: "/tools/blog-title-generator" },
    { iconPath: "/img.png", label: "Image Generator", href: "/tools/image-generator" },
    { iconPath: "/imageditor1.png", label: "Image Editor", href: "/tools/image-editor" },
    { iconPath: "/resume.png", label: "Resume Analyser", href: "/tools/resume-analyzer" },
    { iconPath: "/gallary1.png", label: "Image Gallery", href: "/gallery" },
    { iconPath: "/billing.png", label: "Billing", href: "/billing" },
  ];


  return (
    <div className="hidden md:flex w-72 h-screen bg-white border-r border-gray-200 flex-col sticky top-0 font-sans">

      {/* Logo Area */}
      <div className="h-24 flex items-center justify-center border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="relative w-14 h-14">
            <Image
              src="/logo.png"
              alt="NexusAI Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`);

          return (
            <div key={item.label} className=" py-0.5">
              <Link
                href={item.href}
                className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                    ? "bg-[#007aff] text-white shadow-md"
                    : "text-black hover:bg-gray-50"
                  }`}

              >
<div
  className={`flex items-center justify-center ${
    item.href === "/tools/image-editor"
      ? "w-[28px] h-[28px]"
      : "w-[22px] h-[22px]"
  }`}
>
                  {/* <Image
                    src={item.iconPath}
                    alt={item.label}
                    width={22}
                    height={22}
                    className={`object-contain ${isActive ? "brightness-0 invert" : ""}`}
                  /> */}
                  <Image
  src={item.iconPath}
  alt={item.label}
  width={item.href === "/tools/image-editor" ? 28 : 22}
  height={item.href === "/tools/image-editor" ? 28 : 22}
  className={`object-contain ${isActive ? "brightness-0 invert" : ""}`}
/>

                </div>

                <span className="text-base font-semibold">
                  {item.label}
                </span>
              </Link>
              <hr className="border-t border-[#B3B3B3] dark:border-gray-600 w-full" />

            </div>
          );
        })}

      </nav>

      {/* Credits Display - Automatically Updates */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-[#007aff]" />
            <span className="text-sm font-bold text-gray-700">Credits</span>
          </div>
          {/* Display credits from Context */}
          <span className="text-sm font-bold text-[#007aff]">{credits}</span>
        </div>
      </div>

      {/* Bottom Decoration */}
      {/* <div className="pb-8 flex justify-center opacity-90 mt-auto">
        <svg width="120" height="120" viewBox="0 0 100 100" className="text-black">
          <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="40" ry="12" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(120 50 50)" />
          <circle cx="50" cy="50" r="3" fill="currentColor" />
        </svg>
      </div> */}
      <div className="pb-8 flex justify-center opacity-90 mt-auto">
        <Image
          src="/art1.png"   // your image name
          alt="Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

    </div>
  );
}