"use client";

import { Button } from "@/components/ui/button"
import Week from "./Week"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Calendar = ({
    programId,
    weeks,
    pages
}: {
    programId: string,
    weeks: number,
    pages: number
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false);
    const [weeksLoop, setWeeksLoop] = useState<number[]>([]);

    const [workouts, setWorkouts] = useState<Tables<"program_workouts">[]>([]);

    const { toast } = useToast();

    useEffect(() => {
        const setWeeks = () => {
            let array = [];

            for (let i = calculateStartWeek(); i <= calculateEndWeek(); i++) {
                array.push(i);
            }

            setWeeksLoop(array);

            if (currentPage == pages) {
                setIsEnd(true);
            } else {
                setIsEnd(false);
            }
        }

        const getWorkouts = async () => {
            const supabase = createClient();

            const { data: workoutsData, error: workoutsError } = await supabase
                .from("program_workouts")
                .select()
                .eq("program_id", programId)
                .gte("week", calculateStartWeek())
                .lte("week", calculateEndWeek())
                
            if (workoutsError && !workoutsData) {
                toast({
                    title: "An error occurred.",
                    description: workoutsError.message
                })
                return
            }

            setWorkouts(workoutsData);
        }

        setWeeks();
        getWorkouts();
    }, [currentPage]);

    const removeWorkout = (workoutId: string) => {
        setWorkouts(workouts => workouts.filter(workout => workout.id !== workoutId));
    }

    const addWorkout = (workout: Tables<"program_workouts">) => {
        setWorkouts([...workouts, workout]);
    }

    const calculateStartWeek = () => {
        return 1 + (4 * (currentPage - 1));
    }

    const calculateEndWeek = () => {
        return 4 + (4 * (currentPage - 1));
    }

    const incrementWeeks = () => {
        setCurrentPage(currentPage => currentPage + 1);

        if (currentPage == pages) {
            setIsEnd(true);
        }
    }

    const decrementWeeks = () => {
        setCurrentPage(currentPage => currentPage - 1);

        if (currentPage < pages) {
            setIsEnd(false);
        }
    }

    return (
        <div className="flex flex-col pb-10">
            <div className="flex flex-row items-center w-full justify-start sm:justify-center gap-5 py-5">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage == 1}
                    onClick={decrementWeeks}
                >
                    <ChevronLeft className="text-secondaryText"></ChevronLeft>
                </Button>

                <p className="text-primaryText text-sm font-semibold">Weeks {calculateStartWeek()} - {calculateEndWeek()}</p>

                <Button
                    variant="ghost"
                    size="icon"
                    disabled={isEnd}
                    onClick={incrementWeeks}
                >
                    <ChevronRight className="text-secondaryText"></ChevronRight>
                </Button>
            </div>
            <div className="flex flex-col">
                {weeksLoop.map((week) => {
                    return (
                        <Week
                            programId={programId}
                            workouts={workouts.filter((workout) => workout.week == week)}
                            week={week}
                            disabled={isEnd && week > weeks}
                            addWorkout={addWorkout}
                            removeWorkout={removeWorkout}
                            key={week}
                        />
                    )
                })}
            </div>
        </div>
    )
}
export default Calendar