import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
    return (
        <Card className="h-full flex flex-col overflow-hidden border-border/60 bg-card/80 !py-0">
            <div className="aspect-video overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="pb-2 space-y-2">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex-grow pb-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="pt-0 pb-5">
                <Skeleton className="h-4 w-24" />
            </CardFooter>
        </Card>
    );
}
