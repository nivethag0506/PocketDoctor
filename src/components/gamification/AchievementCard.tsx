
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Star, ShieldCheck, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const achievements = [
    { name: "Perfect Week", description: "7 days of perfect adherence!", icon: Star, achieved: true },
    { name: "Perfect Month", description: "30 days of perfect adherence!", icon: ShieldCheck, achieved: true },
    { name: "Consistency King", description: "Took all doses on time for 3 straight days.", icon: Award, achieved: false },
];

export function AchievementCard() {
    // This is a simulated streak value. In a real app, this would be calculated based on historical data.
    const streak = 7;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Flame className="text-orange-500" />
                    Adherence Streak
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center">
                    <p className="text-6xl font-bold text-orange-500">{streak}</p>
                    <p className="text-muted-foreground">consecutive days</p>
                </div>
                <div className="mt-6">
                    <h4 className="font-semibold mb-2">Badges Earned</h4>
                    <div className="flex justify-center gap-4">
                        <TooltipProvider>
                            {achievements.map((ach) => (
                                <Tooltip key={ach.name}>
                                    <TooltipTrigger>
                                        <div className={`relative p-3 rounded-full border-2 ${ach.achieved ? 'bg-amber-100 dark:bg-amber-900/40 border-amber-400' : 'bg-muted border-dashed'}`}>
                                            <ach.icon className={`h-8 w-8 ${ach.achieved ? 'text-amber-500' : 'text-muted-foreground'}`} />
                                            {ach.achieved && <div className="absolute -top-1 -right-1 bg-green-500 rounded-full h-4 w-4 border-2 border-background" />}
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-semibold">{ach.name}</p>
                                        <p className="text-sm text-muted-foreground">{ach.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
