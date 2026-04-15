import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const ToolCard = ({ id, title, iconPath, description, isLocked, iconColor }) => {
  const href = isLocked ? "#" : `/tools/${id}`;

  return (
    <Link href={href} className={isLocked ? "cursor-not-allowed" : "group"}>
      <Card className={`relative h-full rounded-[15px] 
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white 
text-sm overflow-hidden shadow-none ${
        !isLocked && 'hover:border-[#0088ff]/50 hover:shadow-sm'
      }`}>
        <CardContent className="pl-4 pr-4 pb-4 pt-2">
          <div className="flex items-center justify-between mb-2">
            
            {/* Left: Icon + Title */}
            <div className="flex items-center gap-3">
              {/* <Icon className={`w-6 h-6 ${iconColor}`} strokeWidth={2} /> */}
              <Image
  src={iconPath}
  alt={title}
  width={22}
  height={22}
  className="object-contain"
/>

              <CardTitle className="text-[20px] font-bold text-gray-900 dark:text-white group-hover:text-[#0088ff] transition-colors">
                {title}
              </CardTitle>
            </div>

            {/* Right: Solid Blue Lock */}
           {isLocked && (
  <Image
    src="/lock.png"   // must exist inside public folder
    alt="Locked"
    width={20}
    height={20}
  />
)}

          </div>

          <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed pr-2">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ToolCard;