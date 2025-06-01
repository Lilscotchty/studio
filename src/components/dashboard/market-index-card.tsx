
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

const iconMap = {
  us: "🇺🇸",
  uk: "🇬🇧",
  eu: "🇪🇺",
  jp: "🇯🇵",
  hk: "🇭🇰",
  cn: "🇨🇳",
  default: "🌐"
};


export interface MarketIndexProps {
  id: string;
  iconType: keyof typeof iconMap; // Simplified type
  name: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  dataAiHint: string;
}

export function MarketIndexCard({ iconType, name, value, change, changeType, dataAiHint }: MarketIndexProps) {
  const Icon = changeType === "positive" ? ArrowUpRight : changeType === "negative" ? ArrowDownRight : Minus;
  const changeColor = changeType === "positive" ? "text-green-500" : changeType === "negative" ? "text-red-500" : "text-yellow-500";
  const flagIcon = iconMap[iconType] || iconMap.default;


  return (
    <Card className="shadow-lg bg-card border-border hover:border-primary transition-colors duration-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl" role="img" aria-label={`${iconType} flag`}>{flagIcon}</span>
          <div className={cn("flex items-center text-xs font-semibold", changeColor)}>
            <Icon className="h-4 w-4 mr-1" />
            {change}
          </div>
        </div>
        <CardTitle className="text-lg font-headline tracking-tight">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <Image
            src={`https://placehold.co/300x50.png`}
            alt={`${name} chart placeholder`}
            width={300}
            height={50}
            className="w-full h-auto rounded-sm mt-2 opacity-75"
            data-ai-hint={dataAiHint}
          />
      </CardContent>
    </Card>
  );
}
