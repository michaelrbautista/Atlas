"use client";

import { Button } from "@/components/ui/button"
import MobileWeek from "./MobileWeek";
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Tables } from "../../../../../database.types";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const MobileCalendar = ({
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

    const [workouts, setWorkouts] = useState<Tables<"program_workouts">[]>([] as Tables<"program_workouts">[]);
    const [dayWorkouts, setDayWorkouts] = useState<Tables<"program_workouts">[]>([] as Tables<"program_workouts">[]);

    const [selectedDay, setSelectedDay] = useState({week: 1, day: "sunday"});

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

    useEffect(() => {
        setDayWorkouts(workouts.filter(workout => workout.week == selectedDay.week && workout.day == selectedDay.day))
    }, [selectedDay]);

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
        <div className="flex flex-col">
            <div className="flex flex-col items-center gap-5 pb-10">
                <div className="flex flex-row items-center justify-center gap-5">
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
                <div className="flex flex-col gap-2">
                    {weeksLoop.map((week) => {
                        return (
                            <MobileWeek
                                week={week}
                                disabled={isEnd && week > weeks}
                                selectedDay={selectedDay}
                                setSelectedDay={setSelectedDay}
                                key={week}
                            />
                        )
                    })}
                </div>
            </div>
            <div className="w-full">
                <p className="text-primaryText text-lg font-bold pb-2">Training</p>
                <div className="flex flex-col gap-2">
                    {dayWorkouts.length > 0 ? 
                        dayWorkouts.map((workout) => {
                            return (
                                <Link href={`/workout/${workout.id}`} key={workout.id} className="bg-systemGray5 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                                    <div className="">
                                        <p className="text-primaryText font-bold">{workout.title}</p>
                                        <p className="text-secondaryText">{workout.description}</p>
                                    </div>
                                    <ChevronRight />
                                </Link>
                            )
                        }) : (
                            <div className="bg-systemGray6 flex flex-row w-full justify-between items-center p-3 rounded-lg">
                                <p className="text-secondaryText">No workouts.</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
export default MobileCalendar