import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PlanStatus({ isPremium }) {
  if (isPremium) {
    return (
      <Card className="border-gray-200 shadow-none bg-white dark:bg-gray-900 rounded-2xl">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">You are on a Premium Plan</h3>
            <p className="text-gray-500 text-[15px] mt-1">You have unlimited access to all tools.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[15px] 
bg-white 
border-2 border-[#B3B3B3] 
shadow-[0px_4px_12px_rgba(0,0,0,0.08)] 
focus:ring-2 focus:ring-[#2b7fff] 
dark:bg-gray-800 dark:text-white 
text-sm">
      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between pl-4 pr-4 gap-4">
        <div>
          <h3 className="text-[20px] font-bold text-gray-900 dark:text-white">You are on a Free Plan</h3>
          <p className="text-gray-600 dark:text-gray-400 text-[15px] mt-1">Upgrade to Premium to unlock all the tools.</p>
        </div>
       <Button className="rounded-[15px] px-6 py-5 bg-[#0088ff] text-white hover:bg-[#0088ff]/90 text-[15px] font-semibold shadow-none">
  Upgrade to Premium
</Button>

      </CardContent>
    </Card>
  );
}