import { Card, CardContent } from "@/components/ui/card";

export default function InfoCard({ limit, used, className }: { limit: number; used: number, className?: string }) {
    return (
        <Card className={`bg-indigo-50/60 border-indigo-100 ${className}`}>
            <CardContent className="space-y-3 text-sm text-indigo-900">

                <div className="flex items-start gap-3">
                    <span>Max 2 total books per user.</span>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {Array.from({ length: limit }).map((_, i) => (
                            <span
                                key={i}
                                className={`h-1.5 w-8 rounded-full ${i < used
                                    ? "bg-indigo-600"
                                    : "bg-indigo-200"
                                    }`}
                            />
                        ))}
                    </div>

                    <span className="text-[10px] text-muted-foreground">
                        {used}/{limit} Limit
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}