import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string | number;
  footerText: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive";
  onClick?: () => void;
  isActive?: boolean;
};

export default function KpiCard({ title, value, footerText, icon, variant = "default", onClick, isActive=false }: KpiCardProps) {
  const cardContent = (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", variant === "destructive" && "text-destructive")}>
            {value}
        </div>
        <p className="text-xs text-muted-foreground">{footerText}</p>
      </CardContent>
    </>
  );

  return (
    <Card 
        className={cn(
            "transition-shadow",
            variant === "destructive" && "border-destructive/50 bg-destructive/10",
            onClick && "cursor-pointer hover:bg-muted/50",
            isActive && "ring-2 ring-primary shadow-primary/40",
        )}
        onClick={onClick}
    >
      {cardContent}
    </Card>
  );
}
