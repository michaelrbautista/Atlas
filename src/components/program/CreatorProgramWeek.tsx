"use client";

import { useEffect, useState } from "react";
import { Tables } from "../../../database.types";
import CreatorProgramDay from "./CreatorProgramDay";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "../ui/use-toast";

const CreatorProgramWeek = ({
    programId,
    week
}: {
    programId: string,
    week: number
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [workouts, setWorkouts] = useState<Tables<"workouts">[]>([] as Tables<"workouts">[])

    const { toast } = useToast();

    useEffect(() => {
        const getWeeksWorkouts = async () => {
            const supabase = createClient();

            const { data: weekData, error: weekError } = await supabase
                .from("workouts")
                .select()
                .eq("program_id", programId)
                .eq("week", week)

            if (weekError && !weekData) {
                toast({
                    title: "An error occurred.",
                    description: weekError.message
                })
                return
            }

            setWorkouts(weekData);
        }

        getWeeksWorkouts();
    }, [week]);

    return (
        <div className="flex flex-col gap-5">
            <CreatorProgramDay
                workouts={workouts.filter((workout) => workout.day == "monday")}
                programId={programId}
                week={week}
                day="monday"
            />
            <CreatorProgramDay
                workouts={workouts.filter((workout) => workout.day == "tuesday")}
                programId={programId}
                week={week}
                day="tuesday"
            />
            <CreatorProgramDay
                workouts={workouts.filter((workout) => workout.day == "wednesday")}
                programId={programId}
                week={week}
                day="wednesday"
            />
            <CreatorProgramDay
                workouts={workouts.filter((workout) => workout.day == "thursday")}
                programId={programId}
                week={week}
                day="thursday"
            />
            <CreatorProgramDay
                workouts={workouts.filter((workout) => workout.day == "friday")}
                programId={programId}
                week={week}
                day="friday"
            />
            <CreatorProgramDay
                workouts={workouts.filter((workout) => workout.day == "saturday")}
                programId={programId}
                week={week}
                day="saturday"
            />
            <CreatorProgramDay
                workouts={workouts.filter((workout) => workout.day == "sunday")}
                programId={programId}
                week={week}
                day="sunday"
            />
        </div>
    );
}
 
export default CreatorProgramWeek;