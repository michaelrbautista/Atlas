"use client";

import LibraryExercises from "@/app/creator/library/exercises/LibraryExercises";
import LibraryPrograms from "@/app/creator/library/programs/LibraryPrograms";
import LibraryWorkouts from "@/app/creator/library/workouts/LibraryWorkouts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Library = () => {
    return (
        <div className="h-full w-full px-5 py-20 sm:py-10">
            <div className="flex justify-between items-center pb-5">
                <p className="text-foreground text-2xl sm:text-2xl font-bold">Library</p>
            </div>
            <Tabs defaultValue="programs">
                <TabsList>
                    <TabsTrigger value="programs">Programs</TabsTrigger>
                    <TabsTrigger value="workouts">Workouts</TabsTrigger>
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                </TabsList>
                <TabsContent value="programs">
                    <LibraryPrograms />
                </TabsContent>
                <TabsContent value="workouts">
                    <LibraryWorkouts />
                </TabsContent>
                <TabsContent value="exercises">
                    <LibraryExercises />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Library